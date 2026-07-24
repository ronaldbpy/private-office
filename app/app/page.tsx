import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { nextDueDate, daysUntil, formatDatePY } from "@/lib/dueDates";
import { getUserAccess, accessibleEntityIds } from "@/lib/access";

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
        <h1 className="text-2xl font-light">Private Office</h1>
        <p className="text-neutral-500">
          Tu usuario todavía no tiene ninguna empresa asignada. Pedile al
          Owner que te dé acceso desde la administración del sistema.
        </p>
        <UserButton afterSignOutUrl="/sign-in" />
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
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light">Private Office</h1>
          <p className="text-sm text-neutral-500">
            Hola, {user.firstName ?? "Ronald"}. Hoy es {formatDatePY(today)}.
          </p>
          <p className="text-xs text-neutral-400">
            Acceso a: {access.map((a) => a.entityName).join(", ")}
          </p>
        </div>
        <UserButton afterSignOutUrl="/sign-in" />
      </header>

      <section>
        <h2 className="mb-3 text-lg font-medium">Estructura de propiedad</h2>
        <div className="flex flex-col divide-y divide-neutral-200 rounded-lg border border-neutral-200">
          {Array.from(ownershipByEntity.values()).map((interests) => {
            const entity = interests[0].subjectEntity;
            const notesText = interests.find((oi) => oi.notes)?.notes;
            return (
              <div key={entity.id} className="px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{entity.name}</p>
                  {entity.status === "pending_incorporation" && (
                    <span className="rounded-full border border-amber-600/40 px-2 py-0.5 text-[10px] uppercase tracking-wide text-amber-600">
                      Pendiente de constitución
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-col gap-0.5">
                  {interests.map((oi) => {
                    const ownerName =
                      oi.owner?.name ===
                      "RUC Personal — Ronald Alejandro Barrios Duarte"
                        ? "Ronald"
                        : (oi.owner?.name ?? oi.ownerParty?.fullName ?? "—");
                    return (
                      <div
                        key={oi.id}
                        className="flex items-center justify-between text-neutral-500"
                      >
                        <span>
                          {ownerName}
                          {oi.verificationState === "unverified" && (
                            <span className="ml-1 text-amber-600">
                              (sin verificar)
                            </span>
                          )}
                        </span>
                        <span className="font-medium text-neutral-900">
                          {oi.percentage ? `${Number(oi.percentage)}%` : "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {notesText && (
                  <p className="mt-2 text-xs text-amber-600">{notesText}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">Contactos</h2>
        <div className="flex flex-col divide-y divide-neutral-200 rounded-lg border border-neutral-200">
          {partyLinks.length === 0 ? (
            <p className="px-4 py-3 text-sm text-neutral-500">
              Todavía no hay contactos cargados.
            </p>
          ) : (
            partyLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{link.party.fullName}</p>
                  <p className="text-neutral-500">
                    {relationshipLabels[link.party.relationshipType] ??
                      link.party.relationshipType}
                    {link.party.taxId ? ` · RUC ${link.party.taxId}` : ""}
                  </p>
                </div>
                <p className="text-neutral-500">{link.entity.name}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-medium">Obligaciones tributarias</h2>
        <div className="flex flex-col divide-y divide-neutral-200 rounded-lg border border-neutral-200">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex items-center justify-between px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium">
                  {row.code} — {row.name}
                </p>
                <p className="text-neutral-500">{row.entity.name}</p>
              </div>
              <div className="text-right">
                {row.pending ? (
                  <span className="text-amber-600">
                    Vencimiento sin confirmar
                  </span>
                ) : (
                  <>
                    <p>Próximo: {row.nextDue ? formatDatePY(row.nextDue) : "—"}</p>
                    <p className="text-neutral-500">
                      {row.daysLeft !== null ? `en ${row.daysLeft} días` : ""}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
