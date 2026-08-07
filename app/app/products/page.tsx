"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: string;
  code: string;
  name: string;
  productType: string;
  unitPrice: number;
  quantity: number;
  status: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/products")
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
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
        <h1 className="text-3xl font-bold">Productos y Servicios</h1>
        <Link
          href="/products/new"
          className="bg-accent text-white px-4 py-2 rounded hover:opacity-90"
        >
          Agregar Producto
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-text-secondary">No hay productos registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-surface-2">
              <tr>
                <th className="p-3 text-left">Código</th>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Precio</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-border-soft hover:bg-surface-2">
                  <td className="p-3">{product.code}</td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">
                    <span className="text-xs bg-surface-2 px-2 py-1 rounded">
                      {product.productType === "SERVICE" ? "Servicio" : "Producto"}
                    </span>
                  </td>
                  <td className="p-3">{product.unitPrice.toLocaleString()}</td>
                  <td className="p-3">{product.quantity}</td>
                  <td className="p-3">{product.status}</td>
                  <td className="p-3">
                    <Link
                      href={`/products/${product.id}`}
                      className="text-accent hover:underline"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
