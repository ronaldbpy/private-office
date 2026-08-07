"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  eventType: string;
  startDate: string;
  status: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/events")
      .then((r) => r.json())
      .then((d) => {
        setEvents(d.events || []);
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
        <h1 className="text-3xl font-bold">Eventos</h1>
        <Link
          href="/events/new"
          className="bg-accent text-white px-4 py-2 rounded hover:opacity-90"
        >
          Crear Evento
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-text-secondary">No hay eventos registrados.</p>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event.id} className="p-4 border border-border-soft rounded bg-surface-1">
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-text-secondary">
                {new Date(event.startDate).toLocaleString()} - {event.eventType}
              </p>
              <p className="text-sm text-text-secondary">Estado: {event.status}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
