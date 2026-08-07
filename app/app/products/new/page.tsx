"use client";

import { useSearchParams } from "next/navigation";
import { ProductForm } from "@/components/ProductForm";

export default function NewProductPage() {
  const searchParams = useSearchParams();
  const entityId = searchParams.get("entity") || "";

  return (
    <main className="p-6 fade-in">
      <h1 className="text-3xl font-bold mb-6">Nuevo Producto/Servicio</h1>
      <ProductForm entityId={entityId} />
    </main>
  );
}
