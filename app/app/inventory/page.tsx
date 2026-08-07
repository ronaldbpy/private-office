"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface InventoryItem {
  id: string;
  product: {
    name: string;
    code: string;
  };
  quantity: number;
  location?: string;
  status: string;
  createdAt: string;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/inventory")
      .then((r) => r.json())
      .then((d) => {
        setInventory(d.inventory || []);
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
        <h1 className="text-3xl font-bold">Inventario</h1>
        <Link
          href="/inventory/new"
          className="bg-accent text-white px-4 py-2 rounded hover:opacity-90"
        >
          Agregar Item
        </Link>
      </div>

      {inventory.length === 0 ? (
        <p className="text-text-secondary">No hay items en inventario.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-surface-2">
              <tr>
                <th className="p-3 text-left">Producto</th>
                <th className="p-3 text-left">Código</th>
                <th className="p-3 text-left">Cantidad</th>
                <th className="p-3 text-left">Ubicación</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="border-b border-border-soft hover:bg-surface-2">
                  <td className="p-3">{item.product.name}</td>
                  <td className="p-3">{item.product.code}</td>
                  <td className="p-3 font-mono">{item.quantity}</td>
                  <td className="p-3">{item.location || "-"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      item.status === "available" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/inventory/${item.id}`}
                      className="text-accent hover:underline"
                    >
                      Ver
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
