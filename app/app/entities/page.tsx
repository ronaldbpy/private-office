"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Entity {
  id: string;
  name: string;
  type: string;
  taxId?: string;
  jurisdiction?: string;
  baseCurrency?: string;
  status: string;
  colorToken?: string;
}

const typeLabels: Record<string, string> = {
  LEGAL_ENTITY: "Entidad Legal",
  PERSONAL_PROFILE: "Perfil Personal",
};

export default function EntitiesPage() {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEntities();
  }, []);

  async function fetchEntities() {
    try {
      const res = await fetch("/api/v1/entities");
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setEntities(data.entities || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando entidades");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <p className="px-5 py-4 text-sm text-text-secondary">Cargando entidades...</p>;
  if (error)
    return <p className="px-5 py-4 text-sm text-red-500">Error: {error}</p>;

  const active = entities.filter((e) => e.status === "active");
  const archived = entities.filter((e) => e.status !== "active");

  return (
    <div className="px-5 py-6">
      <h1 className="mb-6 text-2xl font-bold">Entidades</h1>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded border border-border-soft bg-bg-secondary p-4">
          <p className="text-2xl font-bold text-text-primary">{entities.length}</p>
          <p className="text-sm text-text-secondary">Total</p>
        </div>
        <div className="rounded border border-border-soft bg-bg-secondary p-4">
          <p className="text-2xl font-bold text-green-600">{active.length}</p>
          <p className="text-sm text-text-secondary">Activas</p>
        </div>
        <div className="rounded border border-border-soft bg-bg-secondary p-4">
          <p className="text-2xl font-bold text-gray-600">{archived.length}</p>
          <p className="text-sm text-text-secondary">Archivadas</p>
        </div>
      </div>

      {active.length > 0 && (
        <>
          <h2 className="mb-4 text-lg font-semibold">Activas</h2>
          <div className="mb-8 grid gap-4">
            {active.map((e) => (
              <Link
                key={e.id}
                href={`/entities/${e.id}`}
                className="rounded border border-border-soft bg-bg-secondary p-4 transition hover:bg-bg-tertiary"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {e.colorToken && (
                      <div
                        className="h-3 w-3 rounded-full ring-1 ring-border-soft"
                        style={{
                          backgroundColor: `var(--${e.colorToken})`,
                        }}
                      />
                    )}
                    <h3 className="font-medium text-text-primary">{e.name}</h3>
                  </div>
                  <span className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-600 font-semibold">
                    Activa
                  </span>
                </div>

                <div className="space-y-1 text-xs text-text-secondary">
                  {typeLabels[e.type] && <p>Tipo: {typeLabels[e.type]}</p>}
                  {e.taxId && <p>RUC: {e.taxId}</p>}
                  {e.baseCurrency && <p>Moneda: {e.baseCurrency}</p>}
                  {e.jurisdiction && <p>Jurisdicción: {e.jurisdiction}</p>}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {archived.length > 0 && (
        <>
          <h2 className="mb-4 text-lg font-semibold">Archivadas</h2>
          <div className="grid gap-4">
            {archived.map((e) => (
              <Link
                key={e.id}
                href={`/entities/${e.id}`}
                className="rounded border border-border-soft bg-bg-secondary p-4 opacity-60 transition hover:opacity-100"
              >
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="font-medium text-text-primary line-through">
                    {e.name}
                  </h3>
                  <span className="rounded bg-gray-500/20 px-2 py-1 text-xs text-gray-600 font-semibold">
                    {e.status === "pending_incorporation"
                      ? "Pendiente"
                      : e.status === "closed"
                        ? "Cerrada"
                        : "Suspendida"}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-text-secondary">
                  {e.taxId && <p>RUC: {e.taxId}</p>}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
