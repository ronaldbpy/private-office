"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Party {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  relationshipType: string;
  status: string;
  bankingDetails?: {
    bankName?: string;
    accountNumber?: string;
    accountType?: string;
  };
  entityLinks: Array<{
    entity: {
      id: string;
      name: string;
      colorToken?: string | null;
    };
  }>;
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

export default function PartyDetailPage() {
  const params = useParams();
  const partyId = params.id as string;

  const [party, setParty] = useState<Party | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchParty();
  }, [partyId]);

  async function fetchParty() {
    try {
      const res = await fetch(`/api/v1/parties/${partyId}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setParty(data.party);
      setEditData({
        fullName: data.party.fullName,
        email: data.party.email || "",
        phone: data.party.phone || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando contacto");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      const res = await fetch(`/api/v1/parties/${partyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: editData.fullName,
          email: editData.email || null,
          phone: editData.phone || null,
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      setEditMode(false);
      fetchParty();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error actualizando contacto");
    }
  }

  if (loading)
    return <p className="px-5 py-4 text-sm text-text-secondary">Cargando...</p>;
  if (error)
    return <p className="px-5 py-4 text-sm text-red-500">Error: {error}</p>;
  if (!party)
    return <p className="px-5 py-4 text-sm text-text-secondary">Contacto no encontrado</p>;

  return (
    <div className="px-5 py-6 max-w-2xl mx-auto">
      <Link href="/parties" className="mb-6 inline text-sm text-accent hover:underline">
        ← Volver a Contactos
      </Link>

      <div className="mb-6 rounded border border-border-soft bg-bg-secondary p-6">
        {editMode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-text-secondary">Nombre</label>
              <input
                type="text"
                value={editData.fullName}
                onChange={(e) =>
                  setEditData({ ...editData, fullName: e.target.value })
                }
                className="w-full rounded border border-border-soft bg-bg-tertiary px-3 py-2 text-sm text-text-primary"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-text-secondary">Email</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  className="w-full rounded border border-border-soft bg-bg-tertiary px-3 py-2 text-sm text-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs text-text-secondary">Teléfono</label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) =>
                    setEditData({ ...editData, phone: e.target.value })
                  }
                  className="w-full rounded border border-border-soft bg-bg-tertiary px-3 py-2 text-sm text-text-primary"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="rounded bg-green-500/20 px-4 py-2 text-sm text-green-600 hover:bg-green-500/30"
              >
                Guardar
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="rounded bg-gray-500/20 px-4 py-2 text-sm text-gray-600 hover:bg-gray-500/30"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-text-primary">
                  {party.fullName}
                </h1>
                <p className="mt-1 text-sm text-text-secondary">
                  {relationshipLabels[party.relationshipType] || party.relationshipType}
                </p>
              </div>
              <span
                className={`rounded px-2 py-1 text-xs font-semibold ${
                  party.status === "active"
                    ? "bg-green-500/20 text-green-600"
                    : "bg-gray-500/20 text-gray-600"
                }`}
              >
                {party.status === "active" ? "Activo" : "Archivado"}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              {party.email && (
                <p className="text-text-secondary">
                  📧 <span className="text-text-primary">{party.email}</span>
                </p>
              )}
              {party.phone && (
                <p className="text-text-secondary">
                  📱 <span className="text-text-primary">{party.phone}</span>
                </p>
              )}
            </div>

            {party.bankingDetails && (
              <div className="mt-4 border-t border-border-soft pt-4">
                <h3 className="mb-2 font-medium">Datos Bancarios</h3>
                <div className="space-y-1 text-sm text-text-secondary">
                  {party.bankingDetails.bankName && (
                    <p>Banco: {party.bankingDetails.bankName}</p>
                  )}
                  {party.bankingDetails.accountType && (
                    <p>Tipo: {party.bankingDetails.accountType}</p>
                  )}
                  {party.bankingDetails.accountNumber && (
                    <p>Cuenta: {party.bankingDetails.accountNumber}</p>
                  )}
                </div>
              </div>
            )}

            {party.entityLinks.length > 0 && (
              <div className="mt-4 border-t border-border-soft pt-4">
                <h3 className="mb-3 font-medium">Entidades Vinculadas</h3>
                <div className="space-y-2">
                  {party.entityLinks.map((link) => (
                    <Link
                      key={link.entity.id}
                      href={`/entities/${link.entity.id}`}
                      className="block rounded border border-border-soft bg-bg-tertiary p-2 text-sm text-accent hover:underline"
                    >
                      {link.entity.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setEditMode(true)}
              className="mt-6 rounded bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90"
            >
              Editar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
