"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface InventoryFormProps {
  initialData?: any;
  entityId: string;
  isEditing?: boolean;
}

export function InventoryForm({ initialData, entityId, isEditing = false }: InventoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    productId: initialData?.productId || "",
    quantity: initialData?.quantity || "",
    location: initialData?.location || "",
    status: initialData?.status || "available",
    notes: initialData?.notes || "",
  });

  useEffect(() => {
    fetch("/api/v1/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products || []))
      .catch((e) => console.error(e));
  }, []);

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
        ? `/api/v1/inventory/${initialData.id}`
        : "/api/v1/inventory";
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

      router.push("/inventory");
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
        <label className="block text-sm font-medium mb-1">Producto *</label>
        <select
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-border-soft rounded"
        >
          <option value="">Selecciona un producto</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({p.code})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Cantidad *</label>
          <input
            type="number"
            step="0.01"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-border-soft rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border-soft rounded"
          >
            <option value="available">Disponible</option>
            <option value="in_use">En Uso</option>
            <option value="damaged">Dañado</option>
            <option value="archived">Archivado</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Ubicación</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="ej: Almacén A, Mesa de catering"
          className="w-full px-3 py-2 border border-border-soft rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Notas</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
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
