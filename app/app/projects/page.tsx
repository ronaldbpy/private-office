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
  const [searchQuery, setSearchQuery] = useState("");
  const [filterEntity, setFilterEntity] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { errors, validate, clearAllErrors } = useFormValidation({
    entityId: { required: true },
    title: { required: true, minLength: 3, maxLength: 100 },
  });
  const [createData, setCreateData] = useState({
    entityId: "",
    title: "",
    description: "",
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

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

  async function handleDeleteProject() {
    if (!confirmDelete) return;

    setDeletingId(confirmDelete);
    try {
      const res = await fetch(`/api/v1/projects/${confirmDelete}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      setToast({ message: "Proyecto eliminado", type: "success" });
      setConfirmDelete(null);
      fetchProjects();
    } catch (err) {
      setToast({
        message: err instanceof Error ? err.message : "Error eliminando proyecto",
        type: "error",
      });
    } finally {
      setDeletingId(null);
    }
  }

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      searchQuery === "" ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEntity = filterEntity === "" || p.entity.id === filterEntity;
    return matchesSearch && matchesEntity;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const groupedByEntity = paginatedProjects.reduce(
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

  const allEntities = projects.reduce(
    (acc, p) => {
      if (!acc.find((e) => e.id === p.entity.id)) {
        acc.push(p.entity);
      }
      return acc;
    },
    [] as Project["entity"][]
  );

  const exportToCSV = () => {
    const headers = ["ID", "Título", "Descripción", "Estado", "Entity", "Tareas", "Progreso", "Fecha Creación"];
    const rows = filteredProjects.map((p) => {
      const completedTasks = p.tasks.filter((t) => t.status === "completed").length;
      const progress =
        p.tasks.length > 0
          ? Math.round((completedTasks / p.tasks.length) * 100)
          : 0;
      return [
        p.id,
        p.title,
        p.description || "",
        p.status,
        p.entity.name,
        p.tasks.length,
        `${progress}%`,
        new Date(p.createdAt).toLocaleDateString("es-PY"),
      ];
    });

    const csv =
      [headers, ...rows]
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `proyectos-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Proyectos</h1>
          <div className="flex gap-2">
            <button
              onClick={exportToCSV}
              disabled={filteredProjects.length === 0}
              className="rounded border border-border-soft px-4 py-2 text-sm hover:bg-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📥 Exportar CSV
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="rounded bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90"
            >
              {showCreateForm ? "Cancelar" : "+ Nuevo Proyecto"}
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Buscar por título o descripción..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 rounded border border-border-soft bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary"
          />
          <select
            value={filterEntity}
            onChange={(e) => {
              setFilterEntity(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded border border-border-soft bg-bg-tertiary px-3 py-2 text-sm text-text-primary"
          >
            <option value="">Todas las entities</option>
            {allEntities.map((entity) => (
              <option key={entity.id} value={entity.id}>
                {entity.name}
              </option>
            ))}
          </select>
        </div>
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
          {searchQuery || filterEntity
            ? "Sin proyectos que coincidan con los filtros."
            : "Sin proyectos aún. Creá uno para empezar."}
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
                  <div
                    key={p.id}
                    className="rounded border border-border-soft bg-bg-secondary p-4 transition hover:bg-bg-tertiary"
                  >
                    <Link href={`/projects/${p.id}`} className="block">
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

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => setConfirmDelete(p.id)}
                        disabled={deletingId === p.id}
                        className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                      >
                        {deletingId === p.id ? "Eliminando..." : "Eliminar"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      }

      {Object.keys(groupedByEntity).length > 0 && totalPages > 1 && (
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

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded border border-border-soft bg-bg-secondary p-6">
            <h3 className="mb-4 font-semibold text-text-primary">
              ¿Eliminar este proyecto?
            </h3>
            <p className="mb-6 text-sm text-text-secondary">
              Esta acción no puede ser revertida.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="rounded border border-border-soft px-4 py-2 text-sm hover:bg-bg-tertiary"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteProject}
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
