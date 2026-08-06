"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDatePY } from "@/lib/dueDates";
import { Toast } from "@/components/Toast";
import { SkeletonGrid } from "@/components/Skeleton";
import { useFormValidation } from "@/lib/useFormValidation";

interface Project {
  id: string;
  entityId: string;
  title: string;
  description?: string;
  status: string;
  createdAt: Date;
  entity: {
    id: string;
    name: string;
    colorToken?: string | null;
  };
  tasks: Array<{
    id: string;
    title: string;
    status: string;
  }>;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const { errors, validate, clearAllErrors } = useFormValidation({
    entityId: { required: true },
    title: { required: true, minLength: 3, maxLength: 100 },
  });
  const [createData, setCreateData] = useState({
    entityId: "",
    title: "",
    description: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/v1/projects");
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando proyectos");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateProject() {
    if (!validate(createData)) {
      setToast({
        message: Object.values(errors)[0] || "Completa los campos requeridos",
        type: "error"
      });
      return;
    }

    try {
      const res = await fetch("/api/v1/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityId: createData.entityId,
          title: createData.title,
          description: createData.description || null,
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      setCreateData({ entityId: "", title: "", description: "" });
      setShowCreateForm(false);
      setToast({ message: "Proyecto creado", type: "success" });
      fetchProjects();
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Error creando proyecto",
        type: "error",
      });
    }
  }

  const groupedByEntity = projects.reduce(
    (acc, p) => {
      if (!acc[p.entity.id]) {
        acc[p.entity.id] = {
          entity: p.entity,
          projects: [],
        };
      }
      acc[p.entity.id].projects.push(p);
      return acc;
    },
    {} as Record<string, { entity: Project["entity"]; projects: Project[] }>
  );

  if (loading)
    return (
      <div className="px-5 py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Proyectos</h1>
          <div className="h-10 w-32 animate-pulse rounded bg-text-secondary/20" />
        </div>
        <SkeletonGrid count={4} />
      </div>
    );
  if (error)
    return <p className="px-5 py-4 text-sm text-red-500">Error: {error}</p>;

  return (
    <div className="px-5 py-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Proyectos</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="rounded bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90"
        >
          {showCreateForm ? "Cancelar" : "+ Nuevo Proyecto"}
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 rounded border border-border-soft bg-bg-secondary p-4">
          <div className="mb-4">
            <label className="block text-xs text-text-secondary">Entity</label>
            <select
              value={createData.entityId}
              onChange={(e) =>
                setCreateData({ ...createData, entityId: e.target.value })
              }
              className={`w-full rounded border px-3 py-2 text-sm text-text-primary bg-bg-tertiary ${
                errors.entityId ? "border-red-500/50" : "border-border-soft"
              }`}
            >
              <option value="">Seleccionar entity...</option>
              {Object.values(groupedByEntity).map(({ entity }) => (
                <option key={entity.id} value={entity.id}>
                  {entity.name}
                </option>
              ))}
            </select>
            {errors.entityId && <p className="mt-1 text-xs text-red-500">{errors.entityId}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-xs text-text-secondary">Título</label>
            <input
              type="text"
              value={createData.title}
              onChange={(e) =>
                setCreateData({ ...createData, title: e.target.value })
              }
              placeholder="Título del proyecto"
              className={`w-full rounded border px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary bg-bg-tertiary ${
                errors.title ? "border-red-500/50" : "border-border-soft"
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-xs text-text-secondary">Descripción</label>
            <textarea
              value={createData.description}
              onChange={(e) =>
                setCreateData({ ...createData, description: e.target.value })
              }
              placeholder="Descripción (opcional)"
              rows={3}
              className="w-full rounded border border-border-soft bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary"
            />
          </div>

          <button
            onClick={handleCreateProject}
            className="rounded bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90"
          >
            Crear Proyecto
          </button>
        </div>
      )}

      {Object.keys(groupedByEntity).length === 0 ? (
        <p className="text-sm text-text-secondary">
          Sin proyectos aún. Creá uno para empezar.
        </p>
      ) : (
        Object.entries(groupedByEntity).map(([entityId, { entity, projects: pjts }]) => (
          <div key={entityId} className="mb-8">
            <h2
              className="mb-4 text-lg font-semibold"
              style={
                entity.colorToken
                  ? { color: `var(--color-${entity.colorToken})` }
                  : {}
              }
            >
              {entity.name}
            </h2>

            <div className="grid gap-4">
              {pjts.map((p) => {
                const completedTasks = p.tasks.filter(
                  (t) => t.status === "completed"
                ).length;
                const progress =
                  p.tasks.length > 0
                    ? Math.round((completedTasks / p.tasks.length) * 100)
                    : 0;

                return (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    className="rounded border border-border-soft bg-bg-secondary p-4 transition hover:bg-bg-tertiary"
                  >
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="font-medium text-text-primary">
                        {p.title}
                      </h3>
                      <span
                        className={`rounded px-2 py-1 text-xs font-semibold ${
                          p.status === "completed"
                            ? "bg-green-500/20 text-green-600"
                            : p.status === "archived"
                              ? "bg-gray-500/20 text-gray-600"
                              : "bg-blue-500/20 text-blue-600"
                        }`}
                      >
                        {p.status === "active"
                          ? "Activo"
                          : p.status === "completed"
                            ? "Completado"
                            : "Archivado"}
                      </span>
                    </div>

                    {p.description && (
                      <p className="mb-3 text-sm text-text-secondary">
                        {p.description}
                      </p>
                    )}

                    <div className="mb-3 flex items-center justify-between text-xs text-text-tertiary">
                      <span>
                        {p.tasks.length} tarea{p.tasks.length !== 1 ? "s" : ""}
                      </span>
                      <span>Creado: {formatDatePY(new Date(p.createdAt))}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 rounded-full bg-border-soft py-1">
                        <div
                          className="h-full rounded-full bg-accent transition"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-text-secondary">
                        {progress}%
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
