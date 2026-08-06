"use client";

import { useState } from "react";

export default function APITestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endpoints = [
    { name: "Entities", path: "/api/v1/entities" },
    { name: "Accounts", path: "/api/v1/accounts" },
    { name: "Obligations", path: "/api/v1/obligations" },
    { name: "Documents", path: "/api/v1/documents" },
  ];

  const testEndpoint = async (path: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(path);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setResult({ path, data });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-6 text-3xl font-bold">FS-007 API Testing</h1>

      <div className="mb-8 grid grid-cols-2 gap-4">
        {endpoints.map((ep) => (
          <button
            key={ep.path}
            onClick={() => testEndpoint(ep.path)}
            disabled={loading}
            className="rounded-lg bg-accent px-4 py-3 text-white hover:opacity-90 disabled:opacity-50"
          >
            {ep.name}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-warning bg-warning-soft p-4 text-warning">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="rounded-lg border border-border bg-surface-1 p-4">
          <p className="mb-2 text-sm text-text-secondary">{result.path}</p>
          <pre className="overflow-x-auto rounded bg-surface-2 p-4 text-xs text-text-primary">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
