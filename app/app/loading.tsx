// UI-002: estado de carga reutilizable. Next.js muestra esto automáticamente
// mientras se resuelve el Server Component de app/page.tsx (varias consultas
// secuenciales a Prisma). Respeta prefers-reduced-motion vía la regla global
// en globals.css (la animación de pulso se desactiva sola).
function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface-1">
      <div className="border-b border-border-soft px-5 py-4">
        <div className="h-2.5 w-16 animate-pulse rounded bg-surface-2" />
        <div className="mt-2 h-4 w-40 animate-pulse rounded bg-surface-2" />
      </div>
      <div className="flex flex-col gap-3 px-5 py-4">
        <div className="h-3.5 w-full max-w-64 animate-pulse rounded bg-surface-2" />
        <div className="h-3.5 w-full max-w-48 animate-pulse rounded bg-surface-2" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-6 py-10 sm:px-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="h-2.5 w-24 animate-pulse rounded bg-surface-2" />
          <div className="h-8 w-48 animate-pulse rounded bg-surface-2" />
        </div>
        <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-surface-2" />
      </div>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </main>
  );
}
