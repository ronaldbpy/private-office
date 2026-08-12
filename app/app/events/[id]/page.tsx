"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Event {
  id: string;
  entityId: string;
  title: string;
  description: string;
  startDate: string;
  location: string;
  status: string;
  entity: { id: string; name: string };
}

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/events/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setEvent(d.event);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!event) return <div className="p-6">Evento no encontrado.</div>;

  return (
    <main className="p-6 fade-in">
      <Link href="/events" className="text-accent hover:underline mb-4 inline-block">
        ← Volver a eventos
      </Link>

      <div className="bg-surface-1 border border-border rounded-2xl p-6">
        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
        <p className="text-text-secondary mb-4">{event.entity.name}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-text-tertiary">Fecha</p>
            <p className="text-lg font-semibold">{new Date(event.startDate).toLocaleDateString()}</p>
          </div>

          <div>
            <p className="text-xs text-text-tertiary">Ubicación</p>
            <p className="text-lg font-semibold">{event.location || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-text-tertiary">Estado</p>
            <span className="text-xs bg-surface-2 px-2 py-1 rounded capitalize">{event.status}</span>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p>{event.description}</p>
        </div>
      </div>
    </main>
  );
}
