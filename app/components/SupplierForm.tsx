"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SupplierFormProps {
  initialData?: any;
  entityId: string;
  isEditing?: boolean;
}

export function SupplierForm({ initialData, entityId, isEditing = false }: SupplierFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    businessName: initialData?.businessName || "",
    taxId: initialData?.taxId || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    country: initialData?.country || "",
    supplierType: initialData?.supplierType || "individual",
    paymentTerms: initialData?.paymentTerms || "",
    bankAccount: initialData?.bankAccount || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEditing
        ? `/api/v1/suppliers/${initialData.id}`
        : "/api/v1/suppliers";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityId, ...formData }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al guardar");
      }

      router.push("/suppliers");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}

      <div>
        <label className="block text-sm font-medium mb-1">Nombre Completo *</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-border-soft rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Razón Social</label>
        <input
          type="text"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-border-soft rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">RUC/Cédula</label>
          <input
            type="text"
            name="taxId"
            value={formData.taxId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border-soft rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select
            name="supplierType"
            value={formData.supplierType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border-soft rounded"
          >
            <option value="individual">Individual</option>
            <option value="business">Empresa</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border-soft rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border-soft rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Dirección</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-border-soft rounded"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ciudad</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border-soft rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">País</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border-soft rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Términos de Pago</label>
        <input
          type="text"
          name="paymentTerms"
          value={formData.paymentTerms}
          onChange={handleChange}
          placeholder="ej: 30 días"
          className="w-full px-3 py-2 border border-border-soft rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Cuenta Bancaria</label>
        <textarea
          name="bankAccount"
          value={formData.bankAccount}
          onChange={handleChange}
          placeholder="Datos bancarios del proveedor"
          className="w-full px-3 py-2 border border-border-soft rounded"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-accent text-white px-6 py-2 rounded hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
}
