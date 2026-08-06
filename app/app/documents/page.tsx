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

  return (
    <div className="px-5 py-6">
      <div className="mb-6">
        <h1 className="mb-4 text-2xl font-bold">Documentos</h1>

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

      {documents.length === 0 ? (
        <p className="text-sm text-text-secondary">
          Sin documentos aún. Sube uno para empezar.
        </p>
      ) : (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold mb-4">{documents.length} Documentos</h2>
          {documents.map((doc) => (
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

              <button
                onClick={() => handleDownload(doc.id, doc.fileName)}
                className="ml-4 rounded bg-accent px-3 py-1 text-xs text-white hover:bg-accent/90 whitespace-nowrap"
              >
                Descargar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
