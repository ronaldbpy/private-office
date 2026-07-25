import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { nextDueDate, daysUntil, formatDatePY } from "@/lib/dueDates";
import { getUserAccess, accessibleEntityIds } from "@/lib/access";
import { VaultSection } from "@/components/VaultSection";

function Badge({
  tone,
  children,
}: {
  tone: "warning" | "success" | "danger" | "neutral";
  children: React.ReactNode;
}) {
  const toneClasses = {
    warning: "bg-warning-soft text-warning",
    success: "bg-success-soft text-success",
    danger: "bg-danger-soft text-danger",
    neutral: "bg-surface-2 text-text-secondary",
  }[tone];
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${toneClasses}`}
    >
      {children}
    </span>
  );
}

// Puntito de color estable por empresa — identificador visual rápido para
// ver de un vistazo qué empresas comparten un mismo vencimiento agrupado.
function EntityDot({
  name,
  colorToken,
}: {
  name: string;
  colorToken: string | null;
}) {
  return (
    <span
      title={name}
      className="inline-block h-2.5 w-2.5 rounded-full ring-1 ring-border-soft"
      style={{
        backgroundColor: colorToken ? `var(--${colorToken})` : "var(--text-tertiary)",
      }}
    />
  );
}

function SectionCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface-1">
      <div className="border-b border-border-soft px-5 py-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-tertiary">
          {eyebrow}
        </p>
        <h2 className="mt-0.5 font-[family-name:var(--font-display)] text-xl text-text-primary">
          {title}
        </h2>
      </div>
      <div className="divide-y divide-border-soft">{children}</div>
    </section>
  );
}

export default async function Home() {
  const user = await currentUser();

  if (!user) {
    // El middleware ya debería haber redirigido a /sign-in antes de esto.
    return null;
  }

  const access = await getUserAccess(user.id);
  const entityIds = accessibleEntityIds(access);

  const today = new Date();

  // Regla FS-005: un usuario sin entidades asignadas ve un estado vacío,
  // nunca un error ni datos de otra persona.
  if (entityIds.length === 0) {
    return (
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-text-primary">
          Private Office
        </h1>
        <p className="text-text-secondary">
          Tu usuario todavía no tiene ninguna empresa asignada. Pedile al
          Owner que te dé acceso desde la administración del sistema.
        </p>
        <UserButton />
      </main>
    );
  }

  const obligations = await prisma.obligation.findMany({
    where: { entityId: { in: entityIds } },
    include: { entity: true, dueRule: true },
    orderBy: [{ entity: { name: "asc" } }, { code: "asc" }],
  });

  const rows = obligations.map((ob) => {
    const due = nextDueDate(ob.code, today);
    return {
      ...ob,
      nextDue: due,
      daysLeft: due ? daysUntil(due, today) : null,
      pending: !ob.dueRule?.confirmed,
    };
  });

  // Agrupar por código de obligación (211, 700, etc.): el mismo vencimiento
  // se repite idéntico entre empresas, así que se muestra UNA vez con un
  // punto de color por cada empresa que lo tiene — de un vistazo se ve qué
  // vence y a quiénes afecta, en vez de repetir la misma fila 9 veces.
  const obligationGroups = new Map<
    string,
    {
      code: string;
      name: string;
      nextDue: Date | null;
      daysLeft: number | null;
      pending: boolean;
      entities: { id: string; name: string; colorToken: string | null }[];
    }
  >();
  for (const row of rows) {
    const entityInfo = {
      id: row.entity.id,
      name: row.entity.name,
      colorToken: row.entity.colorToken,
    };
    const existing = obligationGroups.get(row.code);
    if (existing) {
      existing.entities.push(entityInfo);
      // Conservador: si CUALQUIER entidad tiene ese código sin confirmar,
      // el grupo entero se muestra como pendiente de confirmar.
      existing.pending = existing.pending || row.pending;
    } else {
      obligationGroups.set(row.code, {
        code: row.code,
        name: row.name,
        nextDue: row.nextDue,
        daysLeft: row.daysLeft,
        pending: row.pending,
        entities: [entityInfo],
      });
    }
  }
  const obligationRows = Array.from(obligationGroups.values()).sort((a, b) =>
    a.code.localeCompare(b.code),
  );

  // FS-003: participaciones donde la entidad "sujeto" es una de las
  // entidades a las que este usuario tiene acceso. El owner puede ser una
  // Entity (ej: Axentia EAS) o un Party externo sin login (ej: Alexis de
  // Kermenguy) — hay que traer ambos.
  const ownershipInterests = await prisma.ownershipInterest.findMany({
    where: { subjectEntityId: { in: entityIds } },
    include: { owner: true, ownerParty: true, subjectEntity: true },
    orderBy: { subjectEntity: { name: "asc" } },
  });

  // FS-004: parties vinculados a alguna de las entidades accesibles.
  const partyLinks = await prisma.partyEntityLink.findMany({
    where: { entityId: { in: entityIds } },
    include: { party: true, entity: true },
    orderBy: { party: { fullName: "asc" } },
  });

  // FS-016: documentos vinculados a alguna de las entidades accesibles.
  const documents = await prisma.document.findMany({
    where: { entityLinks: { some: { entityId: { in: entityIds } } } },
    include: { entityLinks: { include: { entity: true } } },
    orderBy: { createdAt: "desc" },
  });
  const vaultDocuments = documents.map((d) => ({
    id: d.id,
    title: d.title,
    filename: d.filename,
    classification: d.classification,
    entityNames: d.entityLinks.map((l) => l.entity.name),
  }));
  const vaultEntities = access.map((a) => ({
    id: a.entityId,
    name: a.entityName,
  }));

  // Agrupar participaciones por empresa (ahora una empresa puede tener
  // varios owners a la vez, ej: Axentia EAS 50% + Alexis De Kermenguy 50%).
  const ownershipByEntity = new Map<string, typeof ownershipInterests>();
  for (const oi of ownershipInterests) {
    const key = oi.subjectEntity.id;
    const list = ownershipByEntity.get(key) ?? [];
    list.push(oi);
    ownershipByEntity.set(key, list);
  }

  // ---------------------------------------------------------------------
  // Cola de atención (FS-001) — no agrega ningún hecho nuevo: solo junta en
  // un solo lugar lo que YA está marcado como pendiente en otras secciones
  // (empresas sin RUC, vencimientos sin confirmar, vencimientos próximos),
  // para que se vea de un vistazo qué necesita atención hoy — tal como pide
  // MD-100 ("la experiencia es un decision briefing").
  // ---------------------------------------------------------------------
  type AttentionItem = {
    id: string;
    severity: "high" | "normal" | "informational";
    text: string;
    colorToken?: string | null;
  };
  const attentionItems: AttentionItem[] = [];

  for (const group of ownershipByEntity.values()) {
    const entity = group[0].subjectEntity;
    if (entity.status === "pending_incorporation") {
      attentionItems.push({
        id: `pending-${entity.id}`,
        severity: "normal",
        text: `${entity.name} — sin RUC, pendiente de constitución legal`,
        colorToken: entity.colorToken,
      });
    }
  }

  for (const group of obligationRows) {
    if (group.pending) {
      attentionItems.push({
        id: `oblig-pending-${group.code}`,
        severity: "informational",
        text: `${group.code} — ${group.name}: vencimiento sin confirmar (${group.entities.length} ${group.entities.length === 1 ? "empresa" : "empresas"})`,
      });
    } else if (group.daysLeft !== null && group.daysLeft <= 15) {
      attentionItems.push({
        id: `oblig-soon-${group.code}`,
        severity: group.daysLeft <= 7 ? "high" : "normal",
        text: `${group.code} — ${group.name}: vence en ${group.daysLeft} días (${group.entities.length} ${group.entities.length === 1 ? "empresa" : "empresas"})`,
      });
    }
  }

  const severityOrder: Record<AttentionItem["severity"], number> = {
    high: 0,
    normal: 1,
    informational: 2,
  };
  attentionItems.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  // ---------------------------------------------------------------------
  // Actividad reciente (FS-002, versión liviana) — mismo principio: nada
  // nuevo, solo se combinan fechas `createdAt` que ya existen en 3 tablas
  // distintas (entidad creada, documento subido, participación registrada)
  // en una sola línea de tiempo ordenada.
  // ---------------------------------------------------------------------
  type ActivityItem = {
    id: string;
    date: Date;
    text: string;
    colorToken?: string | null;
  };
  const activityItems: ActivityItem[] = [
    ...Array.from(ownershipByEntity.values()).map((group) => {
      const entity = group[0].subjectEntity;
      return {
        id: `entity-${entity.id}`,
        date: entity.createdAt,
        text: `${entity.name} — entidad creada en el sistema`,
        colorToken: entity.colorToken,
      };
    }),
    ...documents.map((d) => ({
      id: `doc-${d.id}`,
      date: d.createdAt,
      text: `Documento subido: “${d.title}”`,
      colorToken: d.entityLinks[0]?.entity.colorToken ?? null,
    })),
    ...ownershipInterests.map((oi) => ({
      id: `oi-${oi.id}`,
      date: oi.createdAt,
      text: `Participación registrada en ${oi.subjectEntity.name}${
        oi.percentage ? ` (${Number(oi.percentage)}%)` : ""
      }`,
      colorToken: oi.subjectEntity.colorToken,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 12);

  const relationshipLabels: Record<string, string> = {
    SUPPLIER: "Proveedor",
    CLIENT: "Cliente",
    EXTERNAL_PARTNER: "Socio externo",
    ATTORNEY: "Abogado",
    BANK: "Banco",
    FAMILY_MEMBER: "Familiar",
    OTHER: "Otro",
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-6 py-10 sm:px-8">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
            Private Office
          </p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl italic text-text-primary">
            Hola, {user.firstName ?? "Ronald"}.
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Hoy es {formatDatePY(today)}.
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {access.map((a) => (
              <span
                key={a.entityId}
                className="flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-text-secondary"
                title={a.cascadedFrom ? `Acceso vía ${a.cascadedFrom}` : undefined}
              >
                <EntityDot name={a.entityName} colorToken={a.entityColorToken} />
                {a.entityName}
                {a.cascadedFrom && (
                  <span className="text-text-tertiary"> · vía {a.cascadedFrom}</span>
                )}
              </span>
            ))}
          </div>
        </div>
        <UserButton />
      </header>

      {attentionItems.length > 0 && (
        <SectionCard eyebrow="FS-001" title="Cola de atención">
          {attentionItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 px-5 py-3.5"
            >
              <div className="flex items-center gap-2">
                {item.colorToken !== undefined && (
                  <EntityDot name="" colorToken={item.colorToken ?? null} />
                )}
                <p className="text-sm text-text-primary">{item.text}</p>
              </div>
              <Badge
                tone={
                  item.severity === "high"
                    ? "danger"
                    : item.severity === "normal"
                      ? "warning"
                      : "neutral"
                }
              >
                {item.severity === "high"
                  ? "Urgente"
                  : item.severity === "normal"
                    ? "Pendiente"
                    : "Informativo"}
              </Badge>
            </div>
          ))}
        </SectionCard>
      )}

      <SectionCard eyebrow="FS-003" title="Estructura de propiedad">
        {Array.from(ownershipByEntity.values()).map((interests) => {
          const entity = interests[0].subjectEntity;
          const notesText = interests.find((oi) => oi.notes)?.notes;

          // Sumar tramos del mismo dueño dentro de la misma empresa (ej:
          // Ronald 50% inicial + 50% cerrado después = 100%, una sola fila).
          // Si CUALQUIER tramo de ese dueño está sin verificar, la fila
          // combinada se marca sin verificar (conservador: no mostrar una
          // cifra como confirmada si parte de ella no lo está).
          const byOwner = new Map<
            string,
            { name: string; percentage: number; unverified: boolean }
          >();
          for (const oi of interests) {
            const key = oi.ownerId ?? oi.ownerPartyId ?? oi.id;
            const rawName =
              oi.owner?.name ?? oi.ownerParty?.fullName ?? "—";
            const name =
              rawName === "RUC Personal — Ronald Alejandro Barrios Duarte"
                ? "Ronald"
                : rawName;
            const existing = byOwner.get(key);
            const pct = oi.percentage ? Number(oi.percentage) : 0;
            byOwner.set(key, {
              name,
              percentage: (existing?.percentage ?? 0) + pct,
              unverified:
                (existing?.unverified ?? false) ||
                oi.verificationState === "unverified",
            });
          }

          return (
            <div key={entity.id} className="px-5 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <EntityDot name={entity.name} colorToken={entity.colorToken} />
                <p className="text-sm font-medium text-text-primary">
                  {entity.name}
                </p>
                {entity.status === "pending_incorporation" && (
                  <Badge tone="warning">Pendiente de constitución</Badge>
                )}
              </div>
              <div className="mt-2 flex flex-col gap-1">
                {Array.from(byOwner.values()).map((owner) => (
                  <div
                    key={owner.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-text-secondary">
                      {owner.name}
                      {owner.unverified && (
                        <span className="ml-1.5">
                          <Badge tone="neutral">Sin verificar</Badge>
                        </span>
                      )}
                    </span>
                    <span className="tabular font-medium text-text-primary">
                      {owner.percentage}%
                    </span>
                  </div>
                ))}
              </div>
              {notesText && (
                <p className="mt-2.5 text-xs leading-relaxed text-warning">
                  {notesText}
                </p>
              )}
            </div>
          );
        })}
      </SectionCard>

      <SectionCard eyebrow="FS-004" title="Contactos">
        {partyLinks.length === 0 ? (
          <p className="px-5 py-4 text-sm text-text-secondary">
            Todavía no hay contactos cargados.
          </p>
        ) : (
          partyLinks.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {link.party.fullName}
                </p>
                <p className="text-xs text-text-secondary">
                  {relationshipLabels[link.party.relationshipType] ??
                    link.party.relationshipType}
                  {link.party.taxId ? ` · RUC ${link.party.taxId}` : ""}
                </p>
              </div>
              <p className="text-xs text-text-tertiary">{link.entity.name}</p>
            </div>
          ))
        )}
      </SectionCard>

      <SectionCard eyebrow="FS-016" title="Vault">
        <VaultSection entities={vaultEntities} documents={vaultDocuments} />
      </SectionCard>

      <SectionCard eyebrow="FS-017" title="Obligaciones tributarias">
        {obligationRows.map((group) => (
          <div
            key={group.code}
            className="flex items-center justify-between px-5 py-4"
          >
            <div>
              <p className="text-sm font-medium text-text-primary">
                {group.code} — {group.name}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                {group.entities.map((e) => (
                  <EntityDot key={e.id} name={e.name} colorToken={e.colorToken} />
                ))}
              </div>
            </div>
            <div className="text-right">
              {group.pending ? (
                <Badge tone="warning">Vencimiento sin confirmar</Badge>
              ) : (
                <>
                  <p className="tabular text-sm text-text-primary">
                    {group.nextDue ? formatDatePY(group.nextDue) : "—"}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {group.daysLeft !== null ? `en ${group.daysLeft} días` : ""}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </SectionCard>

      <SectionCard eyebrow="FS-002" title="Actividad reciente">
        {activityItems.length === 0 ? (
          <p className="px-5 py-4 text-sm text-text-secondary">
            Todavía no hay actividad registrada.
          </p>
        ) : (
          activityItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 px-5 py-3.5"
            >
              <div className="flex items-center gap-2">
                <EntityDot name="" colorToken={item.colorToken ?? null} />
                <p className="text-sm text-text-primary">{item.text}</p>
              </div>
              <p className="tabular shrink-0 text-xs text-text-tertiary">
                {formatDatePY(item.date)}
              </p>
            </div>
          ))
        )}
      </SectionCard>
    </main>
  );
}
