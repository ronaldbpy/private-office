"use client";

import { useSearchParams } from "next/navigation";
import { InvoiceForm } from "@/components/InvoiceForm";

export default function NewInvoicePage() {
  const searchParams = useSearchParams();
  const entityId = searchParams.get("entity") || "";

  return (
    <main className="p-6 fade-in">
      <h1 className="text-3xl font-bold mb-6">Nueva Factura</h1>
      <InvoiceForm entityId={entityId} />
    </main>
  );
}
