"use client";

import { useEffect } from "react";

// UI-002: estado de error reutilizable a nivel de página. Next.js lo activa
// automáticamente si app/page.tsx (u otro Server Component del árbol) tira
// una excepción no controlada. Tono MD-400 ("calm is functional") — nunca el
// stack trace crudo para el usuario final, aunque en desarrollo Next.js
// igual muestra su propio overlay superpuesto a esto.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Registro mínimo en consola del servidor/navegador para poder
    // correlacionar con logs — no expone el detalle al usuario final.
    console.error("Private Office — error no controlado:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
        Private Office
      </p>
      <h1 className="font-[family-name:var(--font-display)] text-2xl text-text-primary">
        Algo no salió bien
      </h1>
      <p className="text-sm text-text-secondary">
        No pudimos cargar esta pantalla. El equipo técnico puede revisar el
        detalle con el código{" "}
        <span className="tabular text-text-tertiary">
          {error.digest ?? "sin código"}
        </span>
        .
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-surface-0"
      >
        Reintentar
      </button>
    </main>
  );
}
