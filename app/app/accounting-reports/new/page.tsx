"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewReportPage() {
  const router = useRouter();
  const [entities, setEntities] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    entityId: "",
    reportType: "balance-sheet",
    period: new Date().toISOString().split("T")[0],
    content: "",
  });

  useEffect(() => {
    fetch("/api/v1/entities")
      .then((r) => r.json())
      .then((d) => setEntities(d.entities || []))
      .catch(console.error);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/v1/accounting-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();
      router.push(`/accounting-reports/${data.report.id}`);
    } catch (error) {
      console.error(error);
      alert("Error al crear informe");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 fade-in">
      <Link href="/accounting-reports" className="text-accent hover:underline mb-4 inline-block">
        ← Volver
      </Link>

      <div className="max-w-2xl bg-surface-1 border border-border rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6">Nuevo Informe Contable</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Entidad</label>
            <select
              required
              value={formData.entityId}
              onChange={(e) => setFormData({ ...formData, entityId: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded bg-surface-2"
            >
              <option value="">Seleccionar...</option>
              {entities.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tipo de Informe</label>
            <select
              value={formData.reportType}
              onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded bg-surface-2"
            >
              <option value="balance-sheet">Balance General</option>
              <option value="income-statement">Estado de Resultados</option>
              <option value="cash-flow">Flujo de Caja</option>
              <option value="trial-balance">Balance de Comprobación</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Período</label>
            <input
              type="date"
              required
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded bg-surface-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Contenido</label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              className="w-full px-3 py-2 border border-border rounded bg-surface-2 font-mono text-sm"
              placeholder="Contenido del informe (JSON o texto)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white py-2 rounded hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Crear Informe"}
          </button>
        </form>
      </div>
    </main>
  );
}
