"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Report {
  id: string;
  entityId: string;
  reportType: string;
  period: string;
  content: string;
  htmlContent?: string;
  createdBy: string;
  createdAt: string;
  entity: { id: string; name: string };
}

export default function ReportDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/accounting-reports/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setReport(d.report);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!report) return <div className="p-6">Informe no encontrado.</div>;

  return (
    <main className="p-6 fade-in">
      <Link href="/accounting-reports" className="text-accent hover:underline mb-4 inline-block">
        ← Volver a informes
      </Link>

      <div className="bg-surface-1 border border-border rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">{report.reportType.toUpperCase()}</h1>
        <p className="text-text-secondary mb-4">
          {report.entity.name} · Período: {report.period}
        </p>

        <div className="prose dark:prose-invert max-w-none">
          {report.htmlContent ? (
            <div dangerouslySetInnerHTML={{ __html: report.htmlContent }} />
          ) : (
            <pre className="bg-surface-2 p-4 rounded overflow-auto text-sm">{report.content}</pre>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-border-soft text-xs text-text-tertiary">
          Creado: {new Date(report.createdAt).toLocaleString()}
        </div>
      </div>
    </main>
  );
}
