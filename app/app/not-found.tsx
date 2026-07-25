import Link from "next/link";

// UI-002: estado "no encontrado" — mismo tono calmo que error.tsx. Se activa
// automáticamente en cualquier ruta que no exista.
export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
        Private Office
      </p>
      <h1 className="font-[family-name:var(--font-display)] text-2xl text-text-primary">
        No encontramos esta página
      </h1>
      <p className="text-sm text-text-secondary">
        Puede que el enlace esté vencido o que no tengas acceso a este
        contenido.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-surface-0"
      >
        Volver al inicio
      </Link>
    </main>
  );
}
