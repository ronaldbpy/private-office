"use client";

import { useSearchParams } from "next/navigation";
import { SupplierForm } from "@/components/SupplierForm";

export default function NewSupplierPage() {
  const searchParams = useSearchParams();
  const entityId = searchParams.get("entity") || "";

  return (
    <main className="p-6 fade-in">
      <h1 className="text-3xl font-bold mb-6">Nuevo Proveedor</h1>
      <SupplierForm entityId={entityId} />
    </main>
  );
}
