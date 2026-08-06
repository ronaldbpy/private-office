"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatDatePY } from "@/lib/dueDates";

interface Report {
  id: string;
  entityId: string;
  reportType: string;
  title: string;
  summary: string;
  content: string;
  contentType: string;
  confidence?: number;
  createdAt: string;
  entity: {
    id: string;
    name: string;
  };
}

const reportTypeLabels: Record<string, string> = {
  treasury_forecast: "Pronóstico de Tesorería",
  project_risk: "Análisis de Riesgos",
  obligation_alert: "Alertas de Obligaciones",
};

export default function ReportDetailPage() {
  const params = useParams();
  const reportId = params.id as string;

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  async function fetchReport() {
    try {
      const res = await fetch(`/api/v1/intelligence/${reportId}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setReport(data.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando reporte");
    } finally {
      setLoading(false);
    }
  }

  if (loading)
    return <p className="px-5 py-4 text-sm text-text-secondary">Cargando...</p>;
  if (error)
    return <p className="px-5 py-4 text-sm text-red-500">Error: {error}</p>;
  if (!report)
    return <p className="px-5 py-4 text-sm text-text-secondary">Reporte no encontrado</p>;

  return (
    <div className="px-5 py-6 max-w-3xl mx-auto">
      <Link href="/intelligence" className="mb-6 inline text-sm text-accent hover:underline">
        ← Volver a Inteligencia
      </Link>

      <div className="mb-6">
        <h1 className="mb-4 text-3xl font-bold text-text-primary">
          {report.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="rounded bg-text-tertiary/10 px-3 py-1 text-sm">
            {reportTypeLabels[report.reportType] || report.reportType}
          </span>
          {report.confidence && (
            <span className="rounded bg-accent/20 px-3 py-1 text-sm text-accent font-semibold">
              {report.confidence}% confianza
            </span>
          )}
          <span className="rounded bg-text-tertiary/10 px-3 py-1 text-sm">
            {report.entity.name}
          </span>
        </div>

        <p className="text-sm text-text-tertiary">
          Generado: {formatDatePY(new Date(report.createdAt))}
        </p>
      </div>

      <div className="rounded border border-border-soft bg-bg-secondary p-6 mb-6">
        <h2 className="mb-4 text-lg font-semibold">Resumen</h2>
        <p className="text-text-secondary">{report.summary}</p>
      </div>

      <div className="rounded border border-border-soft bg-bg-secondary p-6">
        <h2 className="mb-4 text-lg font-semibold">Análisis Completo</h2>

        {report.contentType === "markdown" ? (
          <div className="prose prose-invert max-w-none">
            <div className="text-sm text-text-secondary whitespace-pre-wrap">
              {report.content}
            </div>
          </div>
        ) : (
          <p className="text-sm text-text-secondary">{report.content}</p>
        )}
      </div>
    </div>
  );
}
