"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductFormProps {
  initialData?: any;
  entityId: string;
  isEditing?: boolean;
}

export function ProductForm({ initialData, entityId, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    code: initialData?.code || "",
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    productType: initialData?.productType || "PRODUCT",
    unitPrice: initialData?.unitPrice || "",
    cost: initialData?.cost || "",
    quantity: initialData?.quantity || "0",
    unit: initialData?.unit || "unidad",
    taxRate: initialData?.taxRate || "10",
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
        ? `/api/v1/products/${initialData.id}`
        : "/api/v1/products";
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

      router.push("/products");
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Código *</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-border-soft rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tipo *</label>
          <select
            name="productType"
            value={formData.productType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border-soft rounded"
          >
            <option value="PRODUCT">Producto</option>
            <option value="SERVICE">Servicio</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Nombre *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-border-soft rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-border-soft rounded"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Categoría</label>
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-border-soft rounded"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Precio Unitario *</label>
          <input
            type="number"
            step="0.01"
            name="unitPrice"
            value={formData.unitPrice}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-border-soft rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Costo</label>
          <input
            type="number"
            step="0.01"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border-soft rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">IVA %</label>
          <input
            type="number"
            step="0.01"
            name="taxRate"
            value={formData.taxRate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border-soft rounded"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Cantidad</label>
          <input
            type="number"
            step="0.01"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border-soft rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Unidad</label>
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border-soft rounded"
          />
        </div>
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
