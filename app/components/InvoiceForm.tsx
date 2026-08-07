"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface InvoiceFormProps {
  initialData?: any;
  entityId: string;
  isEditing?: boolean;
}

export function InvoiceForm({ initialData, entityId, isEditing = false }: InvoiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [invoiceType, setInvoiceType] = useState(initialData?.invoiceType || "SALE");
  const [formData, setFormData] = useState({
    customerId: initialData?.customerId || "",
    supplierId: initialData?.supplierId || "",
    invoiceNumber: initialData?.invoiceNumber || "",
    invoiceType: initialData?.invoiceType || "SALE",
    subtotal: initialData?.subtotal || "",
    taxAmount: initialData?.taxAmount || "",
    total: initialData?.total || "",
    issueDate: initialData?.issueDate?.split("T")[0] || new Date().toISOString().split("T")[0],
    dueDate: initialData?.dueDate?.split("T")[0] || "",
    items: initialData?.items || [],
    notes: initialData?.notes || "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/v1/customers").then((r) => r.json()),
      fetch("/api/v1/suppliers").then((r) => r.json()),
      fetch("/api/v1/products").then((r) => r.json()),
    ])
      .then(([custData, suppData, prodData]) => {
        setCustomers(custData.customers || []);
        setSuppliers(suppData.suppliers || []);
        setProducts(prodData.products || []);
      })
      .catch((e) => console.error(e));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "invoiceType") {
      setInvoiceType(value);
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isEditing
        ? `/api/v1/invoices/${initialData.id}`
        : "/api/v1/invoices";
      const method = isEditing ? "PUT" : "POST";

      const payload = {
        entityId,
        ...formData,
        customerId: invoiceType === "SALE" ? formData.customerId : null,
        supplierId: invoiceType === "PURCHASE" ? formData.supplierId : null,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al guardar");
      }

      router.push("/invoices");
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
        <label className="block text-sm font-medium mb-1">Tipo de Factura *</label>
        <select
          name="invoiceType"
          value={invoiceType}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-border-soft rounded"
        >
          <option value="SALE">Venta (Cliente)</option>
          <option value="PURCHASE">Compra (Proveedor)</option>
        </select>
      </div>

      {invoiceType === "SALE" ? (
        <div>
          <label className="block text-sm font-medium mb-1">Cliente *</label>
          <select
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-border-soft rounded"
          >
            <option value="">Selecciona un cliente</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium mb-1">Proveedor *</label>
          <select
            name="supplierId"
            value={formData.supplierId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-border-soft rounded"
          >
            <option value="">Selecciona un proveedor</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Número de Factura *</label>
          <input
            type="text"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-border-soft rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fecha de Emisión *</label>
          <input
            type="date"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-border-soft rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Fecha de Vencimiento</label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-border-soft rounded"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Subtotal *</label>
          <input
            type="number"
            step="0.01"
            name="subtotal"
            value={formData.subtotal}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-border-soft rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">IVA *</label>
          <input
            type="number"
            step="0.01"
            name="taxAmount"
            value={formData.taxAmount}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-border-soft rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total *</label>
          <input
            type="number"
            step="0.01"
            name="total"
            value={formData.total}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-border-soft rounded"
          />
        </div>
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
