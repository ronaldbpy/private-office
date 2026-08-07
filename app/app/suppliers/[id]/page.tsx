"use client";

import { useState, useEffect } from "react";
import { SupplierForm } from "@/components/SupplierForm";

export default function SupplierEditPage({ params }: { params: Promise<{ id: string }> }) {
  const [supplier, setSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
      fetch(`/api/v1/suppliers/${p.id}`)
        .then((r) => r.json())
        .then((d) => {
          setSupplier(d.supplier);
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
          setLoading(false);
        });
    });
  }, [params]);

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!supplier) return <div className="p-6">Proveedor no encontrado</div>;

  return (
    <main className="p-6 fade-in">
      <h1 className="text-3xl font-bold mb-6">Editar Proveedor</h1>
      <SupplierForm initialData={supplier} entityId={supplier.entityId} isEditing />
    </main>
  );
}
