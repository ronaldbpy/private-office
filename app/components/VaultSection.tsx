"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type VaultEntity = { id: string; name: string };
type VaultDocument = {
  id: string;
  title: string;
  filename: string;
  classification: string;
  entityNames: string[];
};

const classificationLabels: Record<string, string> = {
  RESTRICTED: "Restringido",
  CONFIDENTIAL: "Confidencial",
  INTERNAL: "Interno",
  PUBLIC: "Público",
};

export function VaultSection({
  entities,
  documents,
}: {
  entities: VaultEntity[];
  documents: VaultDocument[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const res = await fetch("/api/vault/upload", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "No se pudo subir el archivo.");
      return;
    }
    setFormKey((k) => k + 1); // limpia el <form> (inputs no controlados)
    startTransition(() => router.refresh());
  }

  return (
    <div>
      <form
        key={formKey}
        action={handleSubmit}
        className="flex flex-col gap-3 border-b border-border-soft px-5 py-4"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            name="entityId"
            required
            defaultValue=""
            className="rounded-lg border border-border bg-surface-0 px-3 py-2 text-sm text-text-primary"
          >
            <option value="" disabled>
              Empresa…
            </option>
            {entities.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
          <input
            name="title"
            required
            placeholder="Título del documento"
            className="flex-1 rounded-lg border border-border bg-surface-0 px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary"
          />
          <select
            name="classification"
            defaultValue="CONFIDENTIAL"
            className="rounded-lg border border-border bg-surface-0 px-3 py-2 text-sm text-text-primary"
          >
            {Object.entries(classificationLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="file"
            name="file"
            required
            className="flex-1 text-sm text-text-secondary file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-sm file:text-text-primary"
          />
          <button
            type="submit"
            disabled={isPending}
            className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-surface-0 disabled:opacity-50"
          >
            {isPending ? "Subiendo…" : "Subir"}
          </button>
        </div>
        {error && <p className="text-xs text-danger">{error}</p>}
      </form>

      {documents.length === 0 ? (
        <p className="px-5 py-4 text-sm text-text-secondary">
          Todavía no hay documentos cargados.
        </p>
      ) : (
        <div className="divide-y divide-border-soft">
          {documents.map((doc) => (
            <a
              key={doc.id}
              href={`/api/vault/${doc.id}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-surface-2"
            >
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {doc.title}
                </p>
                <p className="text-xs text-text-secondary">
                  {doc.entityNames.join(", ")} · {doc.filename}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-text-secondary">
                {classificationLabels[doc.classification] ?? doc.classification}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
