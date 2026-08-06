"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Holding {
  id: string;
  ownerId?: string;
  ownerName?: string;
  subjectEntityId: string;
  subjectEntityName: string;
  percentage?: number;
  interestType: string;
  effectiveFrom: string;
  effectiveTo?: string;
  verificationState: string;
}

const interestTypeLabels: Record<string, string> = {
  equity: "Participación Accionaria",
  economic_rights: "Derechos Económicos",
  voting_control: "Control de Votación",
};

const verificationLabels: Record<string, string> = {
  unverified: "No Verificado",
  verified: "Verificado",
};

export default function HoldingsPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHoldings();
  }, []);

  async function fetchHoldings() {
    try {
      const res = await fetch("/api/v1/holdings");
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setHoldings(data.holdings || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando participaciones");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <p className="px-5 py-4 text-sm text-text-secondary">Cargando participaciones...</p>;
  if (error)
    return <p className="px-5 py-4 text-sm text-red-500">Error: {error}</p>;

  const activeHoldings = holdings.filter((h) => !h.effectiveTo);
  const historicalHoldings = holdings.filter((h) => h.effectiveTo);

  const byOwner = activeHoldings.reduce(
    (acc, h) => {
      const owner = h.ownerName || "Sin dueño";
      if (!acc[owner]) {
        acc[owner] = [];
      }
      acc[owner].push(h);
      return acc;
    },
    {} as Record<string, Holding[]>
  );

  return (
    <div className="px-5 py-6">
      <h1 className="mb-6 text-2xl font-bold">Estructura de Propiedad</h1>

      <div className="mb-6 rounded border border-border-soft bg-bg-secondary p-4">
        <p className="text-sm text-text-secondary mb-2">
          Participaciones activas: {activeHoldings.length}
        </p>
        <p className="text-sm text-text-secondary">
          Participaciones históricas: {historicalHoldings.length}
        </p>
      </div>

      {activeHoldings.length === 0 ? (
        <p className="text-sm text-text-secondary">
          Sin participaciones activas registradas.
        </p>
      ) : (
        <>
          <h2 className="mb-4 text-lg font-semibold">Participaciones Activas</h2>
          <div className="grid gap-4 mb-8">
            {Object.entries(byOwner).map(([owner, ownings]) => (
              <div key={owner} className="rounded border border-border-soft bg-bg-secondary p-4">
                <h3 className="mb-3 font-medium text-text-primary">
                  {owner}
                </h3>

                <div className="space-y-2">
                  {ownings.map((h) => (
                    <Link
                      key={h.id}
                      href={`/entities/${h.subjectEntityId}`}
                      className="block rounded border border-border-soft/50 bg-bg-tertiary p-3 transition hover:bg-accent/10"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium text-text-primary">
                          {h.subjectEntityName}
                        </span>
                        <div className="flex gap-2">
                          {h.percentage && (
                            <span className="rounded bg-accent/20 px-2 py-1 text-xs text-accent font-semibold">
                              {h.percentage.toFixed(2)}%
                            </span>
                          )}
                          <span
                            className={`rounded px-2 py-1 text-xs font-semibold ${
                              h.verificationState === "verified"
                                ? "bg-green-500/20 text-green-600"
                                : "bg-yellow-500/20 text-yellow-600"
                            }`}
                          >
                            {verificationLabels[h.verificationState] || h.verificationState}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-text-secondary space-y-1">
                        <p>Tipo: {interestTypeLabels[h.interestType] || h.interestType}</p>
                        <p>Desde: {new Date(h.effectiveFrom).toLocaleDateString("es-PY")}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {historicalHoldings.length > 0 && (
        <>
          <h2 className="mb-4 text-lg font-semibold">Participaciones Históricas</h2>
          <div className="grid gap-4">
            {historicalHoldings.map((h) => (
              <div
                key={h.id}
                className="rounded border border-border-soft bg-bg-secondary p-4 opacity-60"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-text-primary line-through">
                      {h.ownerName || "Sin dueño"} → {h.subjectEntityName}
                    </p>
                  </div>
                  {h.percentage && (
                    <span className="rounded bg-text-tertiary/20 px-2 py-1 text-xs">
                      {h.percentage.toFixed(2)}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-tertiary">
                  Hasta: {h.effectiveTo ? new Date(h.effectiveTo).toLocaleDateString("es-PY") : "—"}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
