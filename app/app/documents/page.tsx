"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Document {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
  entityLinks: Array<{
    entity: {
      id: string;
      name: string;
    };
  }>;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const res = await fetch("/api/v1/documents");
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando documentos");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload() {
    if (!selectedFile) {
      alert("Selecciona un archivo");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch("/api/vault/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      setSelectedFile(null);
      fetchDocuments();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error subiendo archivo");
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(docId: string, fileName: string) {
    try {
      const res = await fetch(`/api/vault/${docId}`);
      if (!res.ok) throw new Error(`Download failed`);

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error descargando");
    }
  }

  async function handleDeleteDocument() {
    if (!confirmDeleteId) return;

    setDeletingId(confirmDeleteId);
    try {
      const res = await fetch(`/api/v1/documents/${confirmDeleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      setConfirmDeleteId(null);
      fetchDocuments();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error eliminando documento");
    } finally {
      setDeletingId(null);
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (loading)
    return <p className="px-5 py-4 text-sm text-text-secondary">Cargando documentos...</p>;
  if (error)
    return <p className="px-5 py-4 text-sm text-red-500">Error: {error}</p>;

  const filteredDocuments = documents.filter(
    (d) =>
      searchQuery === "" ||
      d.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="px-5 py-6">
      <div className="mb-6">
        <h1 className="mb-4 text-2xl font-bold">Documentos</h1>
        <input
          type="text"
          placeholder="Buscar por nombre de archivo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 w-full rounded border border-border-soft bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary"
        />

        <div className="rounded border border-border-soft bg-bg-secondary p-4">
          <label className="mb-4 block">
            <span className="block text-xs text-text-secondary mb-2">Selecciona archivo para subir</span>
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-white hover:file:bg-accent/90"
            />
          </label>

          <div className="flex gap-2">
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="rounded bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Subiendo..." : "Subir"}
            </button>
            {selectedFile && (
              <p className="text-xs text-text-secondary pt-2">
                {selectedFile.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {filteredDocuments.length === 0 ? (
        <p className="text-sm text-text-secondary">
          {searchQuery
            ? "Sin documentos que coincidan con la búsqueda."
            : "Sin documentos aún. Sube uno para empezar."}
        </p>
      ) : (
        <>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold mb-4">{filteredDocuments.length} Documentos</h2>
            {paginatedDocuments.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between rounded border border-border-soft bg-bg-secondary p-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary truncate">
                  {doc.fileName}
                </p>
                <div className="flex gap-4 text-xs text-text-secondary mt-1">
                  <span>{formatFileSize(doc.fileSize)}</span>
                  {doc.entityLinks.length > 0 && (
                    <span>• {doc.entityLinks.map(l => l.entity.name).join(", ")}</span>
                  )}
                  <span>Subido: {new Date(doc.createdAt).toLocaleDateString("es-PY")}</span>
                </div>
              </div>

              <div className="ml-4 flex gap-2">
                <button
                  onClick={() => handleDownload(doc.id, doc.fileName)}
                  className="rounded bg-accent px-3 py-1 text-xs text-white hover:bg-accent/90 whitespace-nowrap"
                >
                  Descargar
                </button>
                <button
                  onClick={() => setConfirmDeleteId(doc.id)}
                  disabled={deletingId === doc.id}
                  className="rounded text-xs text-red-600 hover:text-red-700 disabled:opacity-50 whitespace-nowrap"
                >
                  {deletingId === doc.id ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded border border-border-soft px-3 py-1 text-sm hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>
              <span className="text-sm text-text-secondary">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="rounded border border-border-soft px-3 py-1 text-sm hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded border border-border-soft bg-bg-secondary p-6">
            <h3 className="mb-4 font-semibold text-text-primary">
              ¿Eliminar este documento?
            </h3>
            <p className="mb-6 text-sm text-text-secondary">
              Esta acción no puede ser revertida.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="rounded border border-border-soft px-4 py-2 text-sm hover:bg-bg-tertiary"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteDocument}
                className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
