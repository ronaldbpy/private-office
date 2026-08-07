"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Customer {
  id: string;
  fullName: string;
  businessName?: string;
  email?: string;
  phone?: string;
  status: string;
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const entityId = searchParams.get("entity");

  useEffect(() => {
    fetch("/api/v1/customers")
      .then((r) => r.json())
      .then((d) => {
        setCustomers(d.customers || []);
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
        <h1 className="text-3xl font-bold">Clientes</h1>
        <Link
          href="/customers/new"
          className="bg-accent text-white px-4 py-2 rounded hover:opacity-90"
        >
          Agregar Cliente
        </Link>
      </div>

      {customers.length === 0 ? (
        <p className="text-text-secondary">No hay clientes registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-surface-2">
              <tr>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Teléfono</th>
                <th className="p-3 text-left">Estado</th>
                <th className="p-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-border-soft hover:bg-surface-2">
                  <td className="p-3">{customer.fullName}</td>
                  <td className="p-3">{customer.email || "-"}</td>
                  <td className="p-3">{customer.phone || "-"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      customer.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/customers/${customer.id}`}
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
