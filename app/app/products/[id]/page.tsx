"use client";

import { useState, useEffect } from "react";
import { ProductForm } from "@/components/ProductForm";

export default function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");

  useEffect(() => {
    params.then((p) => {
      setId(p.id);
      fetch(`/api/v1/products/${p.id}`)
        .then((r) => r.json())
        .then((d) => {
          setProduct(d.product);
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
          setLoading(false);
        });
    });
  }, [params]);

  if (loading) return <div className="p-6">Cargando...</div>;
  if (!product) return <div className="p-6">Producto no encontrado</div>;

  return (
    <main className="p-6 fade-in">
      <h1 className="text-3xl font-bold mb-6">Editar Producto/Servicio</h1>
      <ProductForm initialData={product} entityId={product.entityId} isEditing />
    </main>
  );
}
