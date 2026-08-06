"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Entity {
  id: string;
  name: string;
  type: string;
  taxId?: string;
  jurisdiction?: string;
  baseCurrency?: string;
  address?: string;
  phone?: string;
  email?: string;
  status: string;
  colorToken?: string;
}

const typeLabels: Record<string, string> = {
  LEGAL_ENTITY: "Entidad Legal",
  PERSONAL_PROFILE: "Perfil Personal",
};

export default function EntityDetailPage() {
  const params = useParams();
  const entityId = params.id as string;

  const [entity, setEntity] = useState<Entity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEntity();
  }, [entityId]);

  async function fetchEntity() {
    try {
      const res = await fetch(`/api/v1/entities/${entityId}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setEntity(data.entity);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando entidad");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <p className="px-5 py-4 text-sm text-text-secondary">Cargando...</p>;
  if (error)
    return <p className="px-5 py-4 text-sm text-red-500">Error: {error}</p>;
  if (!entity)
    return <p className="px-5 py-4 text-sm text-text-secondary">Entidad no encontrada</p>;

  return (
    <div className="px-5 py-6 max-w-2xl mx-auto">
      <Link href="/entities" className="mb-6 inline text-sm text-accent hover:underline">
        ← Volver a Entidades
      </Link>

      <div className="mb-6 rounded border border-border-soft bg-bg-secondary p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              {entity.colorToken && (
                <div
                  className="h-4 w-4 rounded-full ring-2 ring-border-soft"
                  style={{
                    backgroundColor: `var(--${entity.colorToken})`,
                  }}
                />
              )}
              <h1 className="text-2xl font-bold text-text-primary">
                {entity.name}
              </h1>
            </div>
            <p className="text-sm text-text-secondary">
              {typeLabels[entity.type] || entity.type}
            </p>
          </div>
          <span
            className={`rounded px-3 py-1 text-xs font-semibold ${
              entity.status === "active"
                ? "bg-green-500/20 text-green-600"
                : "bg-gray-500/20 text-gray-600"
            }`}
          >
            {entity.status === "active"
              ? "Activa"
              : entity.status === "pending_incorporation"
                ? "Pendiente"
                : entity.status === "closed"
                  ? "Cerrada"
                  : "Suspendida"}
          </span>
        </div>

        <div className="space-y-3">
          {entity.taxId && (
            <p>
              <span className="text-text-secondary">RUC:</span>{" "}
              <span className="text-text-primary font-medium">{entity.taxId}</span>
            </p>
          )}
          {entity.baseCurrency && (
            <p>
              <span className="text-text-secondary">Moneda:</span>{" "}
              <span className="text-text-primary font-medium">
                {entity.baseCurrency}
              </span>
            </p>
          )}
          {entity.jurisdiction && (
            <p>
              <span className="text-text-secondary">Jurisdicción:</span>{" "}
              <span className="text-text-primary font-medium">
                {entity.jurisdiction}
              </span>
            </p>
          )}
          {entity.address && (
            <p>
              <span className="text-text-secondary">Dirección:</span>{" "}
              <span className="text-text-primary">{entity.address}</span>
            </p>
          )}
          {entity.phone && (
            <p>
              <span className="text-text-secondary">Teléfono:</span>{" "}
              <span className="text-text-primary">{entity.phone}</span>
            </p>
          )}
          {entity.email && (
            <p>
              <span className="text-text-secondary">Email:</span>{" "}
              <span className="text-text-primary">{entity.email}</span>
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          href={`/holdings?entity=${entityId}`}
          className="rounded border border-border-soft bg-bg-secondary p-3 text-center text-sm text-accent hover:bg-bg-tertiary transition"
        >
          📊 Propiedad
        </Link>
        <Link
          href={`/projects?entity=${entityId}`}
          className="rounded border border-border-soft bg-bg-secondary p-3 text-center text-sm text-accent hover:bg-bg-tertiary transition"
        >
          📋 Proyectos
        </Link>
        <Link
          href={`/intelligence?entity=${entityId}`}
          className="rounded border border-border-soft bg-bg-secondary p-3 text-center text-sm text-accent hover:bg-bg-tertiary transition"
        >
          🤖 Inteligencia
        </Link>
      </div>
    </div>
  );
}
