"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Supplier {
  id: string;
  fullName: string;
  businessName?: string;
  email?: string;
  phone?: string;
  status: string;
  paymentTerms?: string;
  createdAt: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/suppliers")
      .then((r) => r.json())
      .then((d) => {
        setSuppliers(d.suppliers || []);
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
        <h1 className="text-3xl font-bold">Proveedores</h1>
        <Link
          href="/suppliers/new"
          className="bg-accent text-white px-4 py-2 rounded hover:opacity-90"
        >
          Agregar Proveedor
        </Link>
      </div>

      {suppliers.length === 0 ? (
        <p className="text-text-secondary">No hay proveedores registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-surface-2">
              <tr>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Teléfono</th>
                <th className="p-3 text-left">Términos Pago</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="border-b border-border-soft hover:bg-surface-2">
                  <td className="p-3">{supplier.fullName}</td>
                  <td className="p-3">{supplier.email || "-"}</td>
                  <td className="p-3">{supplier.phone || "-"}</td>
                  <td className="p-3">{supplier.paymentTerms || "-"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      supplier.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/suppliers/${supplier.id}`}
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
