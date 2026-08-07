"use client";

import { useSearchParams } from "next/navigation";
import { InventoryForm } from "@/components/InventoryForm";

export default function NewInventoryPage() {
  const searchParams = useSearchParams();
  const entityId = searchParams.get("entity") || "";

  return (
    <main className="p-6 fade-in">
      <h1 className="text-3xl font-bold mb-6">Nuevo Item de Inventario</h1>
      <InventoryForm entityId={entityId} />
    </main>
  );
}
