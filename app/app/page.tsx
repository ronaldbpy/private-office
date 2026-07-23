import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { prisma } from "@/lib/prisma";
import { nextDueDate, daysUntil, formatDatePY } from "@/lib/dueDates";

export default async function Home() {
  const user = await currentUser();

  const obligations = await prisma.obligation.findMany({
    include: { entity: true, dueRule: true },
    orderBy: [{ entity: { name: "asc" } }, { code: "asc" }],
  });

  const today = new Date();

  const rows = obligations.map((ob) => {
    const due = nextDueDate(ob.code, today);
    return {
      ...ob,
      nextDue: due,
      daysLeft: due ? daysUntil(due, today) : null,
      pending: !ob.dueRule?.confirmed,
    };
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 p-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light">Private Office</h1>
          <p className="text-sm text-neutral-500">
            Hola, {user?.firstName ?? "Ronald"}. Hoy es{" "}
            {formatDatePY(today)}.
          </p>
        </div>
        <UserButton afterSignOutUrl="/sign-in" />
      </header>

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
