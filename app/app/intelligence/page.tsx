"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDatePY } from "@/lib/dueDates";

interface Report {
  id: string;
  entityId: string;
  reportType: string;
  title: string;
  summary: string;
  confidence?: number;
  createdAt: string;
  entity: {
    id: string;
    name: string;
  };
}

interface Entity {
  id: string;
  name: string;
}

const reportTypeLabels: Record<string, string> = {
  treasury_forecast: "Pronóstico de Tesorería",
  project_risk: "Análisis de Riesgos",
  obligation_alert: "Alertas de Obligaciones",
};

export default function IntelligencePage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState("");
  const [selectedType, setSelectedType] = useState("treasury_forecast");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Promise.all([fetchReports(), fetchEntities()]).finally(() =>
      setLoading(false)
    );
  }, []);

  async function fetchReports() {
    try {
      const res = await fetch("/api/v1/intelligence");
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setReports(data.reports || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando reportes");
    }
  }

  async function fetchEntities() {
    try {
      const res = await fetch("/api/v1/entities");
      if (!res.ok) return;
      const data = await res.json();
      setEntities(data.entities || []);
    } catch (err) {
      console.error("Error fetching entities:", err);
    }
  }

  async function handleGenerateReport() {
    if (!selectedEntity || !selectedType) {
      alert("Selecciona entity y tipo");
      return;
    }

    setGenerating(true);
    try {
      const res = await fetch("/api/v1/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityId: selectedEntity,
          reportType: selectedType,
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      setSelectedEntity("");
      fetchReports();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error generando reporte");
    } finally {
      setGenerating(false);
    }
  }

  if (loading)
    return <p className="px-5 py-4 text-sm text-text-secondary">Cargando inteligencia...</p>;
  if (error)
    return <p className="px-5 py-4 text-sm text-red-500">Error: {error}</p>;

  const filteredReports = reports.filter(
    (r) =>
      searchQuery === "" ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const byEntity = filteredReports.reduce(
    (acc, r) => {
      if (!acc[r.entity.id]) {
        acc[r.entity.id] = {
          entity: r.entity,
          reports: [],
        };
      }
      acc[r.entity.id].reports.push(r);
      return acc;
    },
    {} as Record<string, { entity: Report["entity"]; reports: Report[] }>
  );

  return (
    <div className="px-5 py-6">
      <h1 className="mb-6 text-2xl font-bold">Inteligencia (AI)</h1>

      <input
        type="text"
        placeholder="Buscar por título o resumen..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-6 w-full rounded border border-border-soft bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary"
      />

      <div className="mb-6 rounded border border-border-soft bg-bg-secondary p-4">
        <div className="mb-4">
          <label className="block text-xs text-text-secondary mb-2">Entity</label>
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="w-full rounded border border-border-soft bg-bg-tertiary px-3 py-2 text-sm text-text-primary"
          >
            <option value="">Seleccionar entity...</option>
            {entities.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-text-secondary mb-2">Tipo de Reporte</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full rounded border border-border-soft bg-bg-tertiary px-3 py-2 text-sm text-text-primary"
          >
            {Object.entries(reportTypeLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={!selectedEntity || generating}
          className="rounded bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? "Generando..." : "Generar Reporte"}
        </button>
      </div>

      {Object.keys(byEntity).length === 0 ? (
        <p className="text-sm text-text-secondary">
          {searchQuery
            ? "Sin reportes que coincidan con la búsqueda."
            : "Sin reportes aún. Genera uno para empezar."}
        </p>
      ) : (
        Object.entries(byEntity).map(([entityId, { entity, reports: rpts }]) => (
          <div key={entityId} className="mb-8">
            <h2 className="mb-4 text-lg font-semibold">{entity.name}</h2>

            <div className="grid gap-4">
              {rpts.map((r) => (
                <Link
                  key={r.id}
                  href={`/intelligence/${r.id}`}
                  className="rounded border border-border-soft bg-bg-secondary p-4 transition hover:bg-bg-tertiary"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-medium text-text-primary">{r.title}</h3>
                    {r.confidence && (
                      <span className="rounded bg-accent/20 px-2 py-1 text-xs text-accent font-semibold">
                        {r.confidence}% confianza
                      </span>
                    )}
                  </div>

                  <p className="mb-3 text-sm text-text-secondary line-clamp-2">
                    {r.summary}
                  </p>

                  <div className="flex items-center justify-between text-xs text-text-tertiary">
                    <span className="rounded bg-text-tertiary/10 px-2 py-1">
                      {reportTypeLabels[r.reportType] || r.reportType}
                    </span>
                    <span>Generado: {formatDatePY(new Date(r.createdAt))}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
