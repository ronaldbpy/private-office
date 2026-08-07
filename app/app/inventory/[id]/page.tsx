"use client";

import { useState, useEffect } from "react";
import { InventoryForm } from "@/components/InventoryForm";

export default function InventoryEditPage({ params }: { params: Promise<{ id: string }> }) {
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
      fetch(`/api/v1/inventory/${p.id}`)
        .then((r) => r.json())
        .then((d) => {
          setItem(d.item);
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
          setLoading(false);
        });
    });
  }, [params]);

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!item) return <div className="p-6">Item no encontrado</div>;

  return (
    <main className="p-6 fade-in">
      <h1 className="text-3xl font-bold mb-6">Editar Inventario</h1>
      <InventoryForm initialData={item} entityId={item.entityId} isEditing />
    </main>
  );
}
