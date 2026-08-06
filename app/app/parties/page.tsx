"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Party {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  relationshipType: string;
  status: string;
  createdAt: string;
}

const relationshipLabels: Record<string, string> = {
  SUPPLIER: "Proveedor",
  CLIENT: "Cliente",
  EXTERNAL_PARTNER: "Socio Externo",
  ATTORNEY: "Abogado",
  BANK: "Banco",
  FAMILY_MEMBER: "Familia",
  OTHER: "Otro",
};

export default function PartiesPage() {
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [createData, setCreateData] = useState({
    fullName: "",
    email: "",
    phone: "",
    relationshipType: "OTHER",
  });

  useEffect(() => {
    fetchParties();
  }, []);

  async function fetchParties() {
    try {
      const res = await fetch("/api/v1/parties");
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setParties(data.parties || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando contactos");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateParty() {
    if (!createData.fullName) {
      alert("Nombre requerido");
      return;
    }

    try {
      const res = await fetch("/api/v1/parties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: createData.fullName,
          email: createData.email || null,
          phone: createData.phone || null,
          relationshipType: createData.relationshipType,
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      setCreateData({ fullName: "", email: "", phone: "", relationshipType: "OTHER" });
      setShowCreateForm(false);
      fetchParties();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error creando contacto");
    }
  }

  if (loading)
    return <p className="px-5 py-4 text-sm text-text-secondary">Cargando contactos...</p>;
  if (error)
    return <p className="px-5 py-4 text-sm text-red-500">Error: {error}</p>;

  const filteredParties = parties.filter(
    (p) =>
      searchQuery === "" ||
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone?.includes(searchQuery)
  );

  const byRelationship = filteredParties.reduce(
    (acc, p) => {
      if (!acc[p.relationshipType]) {
        acc[p.relationshipType] = [];
      }
      acc[p.relationshipType].push(p);
      return acc;
    },
    {} as Record<string, Party[]>
  );

  return (
    <div className="px-5 py-6">
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Contactos</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="rounded bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90"
          >
            {showCreateForm ? "Cancelar" : "+ Nuevo Contacto"}
          </button>
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre, email o teléfono..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded border border-border-soft bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary"
        />
      </div>

      {showCreateForm && (
        <div className="mb-6 rounded border border-border-soft bg-bg-secondary p-4">
          <div className="mb-4">
            <label className="block text-xs text-text-secondary">Nombre</label>
            <input
              type="text"
              value={createData.fullName}
              onChange={(e) =>
                setCreateData({ ...createData, fullName: e.target.value })
              }
              placeholder="Nombre completo"
              className="w-full rounded border border-border-soft bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary"
            />
          </div>

          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-text-secondary">Email</label>
              <input
                type="email"
                value={createData.email}
                onChange={(e) =>
                  setCreateData({ ...createData, email: e.target.value })
                }
                placeholder="email@example.com"
                className="w-full rounded border border-border-soft bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary"
              />
            </div>

            <div>
              <label className="block text-xs text-text-secondary">Teléfono</label>
              <input
                type="tel"
                value={createData.phone}
                onChange={(e) =>
                  setCreateData({ ...createData, phone: e.target.value })
                }
                placeholder="+595 987 654321"
                className="w-full rounded border border-border-soft bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs text-text-secondary">Tipo de Relación</label>
            <select
              value={createData.relationshipType}
              onChange={(e) =>
                setCreateData({ ...createData, relationshipType: e.target.value })
              }
              className="w-full rounded border border-border-soft bg-bg-tertiary px-3 py-2 text-sm text-text-primary"
            >
              {Object.entries(relationshipLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCreateParty}
            className="rounded bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90"
          >
            Crear Contacto
          </button>
        </div>
      )}

      {Object.keys(byRelationship).length === 0 ? (
        <p className="text-sm text-text-secondary">
          {searchQuery
            ? "Sin contactos que coincidan con la búsqueda."
            : "Sin contactos aún. Creá uno para empezar."}
        </p>
      ) : (
        Object.entries(byRelationship).map(([type, items]) => (
          <div key={type} className="mb-8">
            <h2 className="mb-4 text-lg font-semibold">
              {relationshipLabels[type] || type} ({items.length})
            </h2>

            <div className="grid gap-2">
              {items.map((p) => (
                <Link
                  key={p.id}
                  href={`/parties/${p.id}`}
                  className="rounded border border-border-soft bg-bg-secondary p-4 transition hover:bg-bg-tertiary"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <h3 className="font-medium text-text-primary">
                      {p.fullName}
                    </h3>
                    <span
                      className={`rounded px-2 py-1 text-xs font-semibold ${
                        p.status === "active"
                          ? "bg-green-500/20 text-green-600"
                          : "bg-gray-500/20 text-gray-600"
                      }`}
                    >
                      {p.status === "active" ? "Activo" : "Archivado"}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-text-secondary">
                    {p.email && <p>📧 {p.email}</p>}
                    {p.phone && <p>📱 {p.phone}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
