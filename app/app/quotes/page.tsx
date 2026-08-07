"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Quote {
  id: string;
  quoteNumber: string;
  total: number;
  status: string;
  issueDate: string;
  expiryDate: string;
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/quotes")
      .then((r) => r.json())
      .then((d) => {
        setQuotes(d.quotes || []);
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
        <h1 className="text-3xl font-bold">Cotizaciones</h1>
        <Link
          href="/quotes/new"
          className="bg-accent text-white px-4 py-2 rounded hover:opacity-90"
        >
          Nueva Cotización
        </Link>
      </div>

      {quotes.length === 0 ? (
        <p className="text-text-secondary">No hay cotizaciones registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-surface-2">
              <tr>
                <th className="p-3 text-left">Número</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Vencimiento</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => (
                <tr key={quote.id} className="border-b border-border-soft hover:bg-surface-2">
                  <td className="p-3">{quote.quoteNumber}</td>
                  <td className="p-3">{quote.total.toLocaleString()}</td>
                  <td className="p-3">{quote.status}</td>
                  <td className="p-3">{new Date(quote.expiryDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
