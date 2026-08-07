"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Invoice {
  id: string;
  invoiceNumber: string;
  invoiceType: string;
  total: number;
  status: string;
  issueDate: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/invoices")
      .then((r) => r.json())
      .then((d) => {
        setInvoices(d.invoices || []);
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
        <h1 className="text-3xl font-bold">Facturas</h1>
        <Link
          href="/invoices/new"
          className="bg-accent text-white px-4 py-2 rounded hover:opacity-90"
        >
          Nueva Factura
        </Link>
      </div>

      {invoices.length === 0 ? (
        <p className="text-text-secondary">No hay facturas registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-surface-2">
              <tr>
                <th className="p-3 text-left">Número</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-border-soft hover:bg-surface-2">
                  <td className="p-3">{invoice.invoiceNumber}</td>
                  <td className="p-3">{invoice.invoiceType}</td>
                  <td className="p-3">{invoice.total.toLocaleString()}</td>
                  <td className="p-3">{invoice.status}</td>
                  <td className="p-3">{new Date(invoice.issueDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
