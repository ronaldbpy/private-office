"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewEventPage() {
  const router = useRouter();
  const [entities, setEntities] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState({
    entityId: "",
    title: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    location: "",
  });

  useEffect(() => {
    fetch("/api/v1/entities")
      .then((r) => r.json())
      .then((d) => setEntities(d.entities || []))
      .catch(console.error);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/v1/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      router.push(`/events/${data.event.id}`);
    } catch (error) {
      console.error(error);
      alert("Error al crear evento");
    }
  }

  return (
    <main className="p-6 fade-in">
      <Link href="/events" className="text-accent hover:underline mb-4 inline-block">
        ← Volver
      </Link>

      <div className="max-w-2xl bg-surface-1 border border-border rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-6">Nuevo Evento</h1>

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
            <label className="block text-sm font-medium mb-2">Título</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded bg-surface-2"
              placeholder="Nombre del evento"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Descripción</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded bg-surface-2"
              placeholder="Descripción del evento"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Fecha</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded bg-surface-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Ubicación</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded bg-surface-2"
              placeholder="Lugar del evento"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-accent text-white py-2 rounded hover:opacity-90"
          >
            Crear Evento
          </button>
        </form>
      </div>
    </main>
  );
}
