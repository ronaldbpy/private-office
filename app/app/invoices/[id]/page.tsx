"use client";

import { useState, useEffect } from "react";
import { InvoiceForm } from "@/components/InvoiceForm";

export default function InvoiceEditPage({ params }: { params: Promise<{ id: string }> }) {
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
      fetch(`/api/v1/invoices/${p.id}`)
        .then((r) => r.json())
        .then((d) => {
          setInvoice(d.invoice);
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
          setLoading(false);
        });
    });
  }, [params]);

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!invoice) return <div className="p-6">Factura no encontrada</div>;

  return (
    <main className="p-6 fade-in">
      <h1 className="text-3xl font-bold mb-6">Editar Factura</h1>
      <InvoiceForm initialData={invoice} entityId={invoice.entityId} isEditing />
    </main>
  );
}
