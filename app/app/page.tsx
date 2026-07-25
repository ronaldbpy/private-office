import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { nextDueDate, daysUntil, formatDatePY } from "@/lib/dueDates";
import { getUserAccess, accessibleEntityIds } from "@/lib/access";

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

  // Agrupar participaciones por empresa (ahora una empresa puede tener
  // varios owners a la vez, ej: Axentia EAS 50% + Alexis De Kermenguy 50%).
  const ownershipByEntity = new Map<string, typeof ownershipInterests>();
  for (const oi of ownershipInterests) {
    const key = oi.subjectEntity.id;
    const list = ownershipByEntity.get(key) ?? [];
    list.push(oi);
    ownershipByEntity.set(key, list);
  }

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
                className="rounded-full border border-border bg-surface-2 px-2.5 py-1 text-xs text-text-secondary"
                title={a.cascadedFrom ? `Acceso vía ${a.cascadedFrom}` : undefined}
              >
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

      <SectionCard eyebrow="FS-017" title="Obligaciones tributarias">
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex items-center justify-between px-5 py-4"
          >
            <div>
              <p className="text-sm font-medium text-text-primary">
                {row.code} — {row.name}
              </p>
              <p className="text-xs text-text-secondary">{row.entity.name}</p>
            </div>
            <div className="text-right">
              {row.pending ? (
                <Badge tone="warning">Vencimiento sin confirmar</Badge>
              ) : (
                <>
                  <p className="tabular text-sm text-text-primary">
                    {row.nextDue ? formatDatePY(row.nextDue) : "—"}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {row.daysLeft !== null ? `en ${row.daysLeft} días` : ""}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </SectionCard>
    </main>
  );
}
