"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface AccountingReport {
  id: string;
  entityId: string;
  reportType: string;
  period: string;
  createdAt: string;
  entity: { id: string; name: string };
}

export default function AccountingReportsPage() {
  const [reports, setReports] = useState<AccountingReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/accounting-reports")
      .then((r) => r.json())
      .then((d) => {
        setReports(d.reports || []);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <main className="p-6 fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Informes Contables</h1>
        <Link
          href="/accounting-reports/new"
          className="bg-accent text-white px-4 py-2 rounded hover:opacity-90"
        >
          Nuevo Informe
        </Link>
      </div>

      {reports.length === 0 ? (
        <p className="text-text-secondary">No hay informes registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-surface-2">
              <tr>
                <th className="p-3 text-left">Entidad</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Período</th>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id} className="border-b border-border-soft hover:bg-surface-2">
                  <td className="p-3">{report.entity.name}</td>
                  <td className="p-3 capitalize">{report.reportType}</td>
                  <td className="p-3">{report.period}</td>
                  <td className="p-3">{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <Link
                      href={`/accounting-reports/${report.id}`}
                      className="text-accent hover:underline"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
