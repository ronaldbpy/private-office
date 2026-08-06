"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatDatePY } from "@/lib/dueDates";

interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  entity: {
    id: string;
    name: string;
    colorToken?: string | null;
  };
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  assignedTo?: string;
  createdAt: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [createTaskData, setCreateTaskData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [confirmDeleteTaskId, setConfirmDeleteTaskId] = useState<string | null>(null);
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
  const [bulkUpdateStatus, setBulkUpdateStatus] = useState("");

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  async function fetchProject() {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        fetch(`/api/v1/projects/${projectId}`),
        fetch(`/api/v1/tasks?projectId=${projectId}`),
      ]);

      if (!projectRes.ok) throw new Error(`Project not found`);
      const projectData = await projectRes.json();
      setProject(projectData.project);

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.tasks || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando proyecto");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask() {
    if (!createTaskData.title) {
      alert("Título requerido");
      return;
    }

    try {
      const res = await fetch("/api/v1/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          title: createTaskData.title,
          description: createTaskData.description || null,
          priority: createTaskData.priority,
          dueDate: createTaskData.dueDate
            ? new Date(createTaskData.dueDate).toISOString()
            : null,
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      setCreateTaskData({ title: "", description: "", priority: "medium", dueDate: "" });
      setShowCreateTask(false);
      fetchProject();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error creando tarea");
    }
  }

  async function handleUpdateTask(taskId: string, status: string) {
    try {
      const res = await fetch(`/api/v1/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      fetchProject();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error actualizando tarea");
    }
  }

  async function handleDeleteTask() {
    if (!confirmDeleteTaskId) return;

    setDeletingTaskId(confirmDeleteTaskId);
    try {
      const res = await fetch(`/api/v1/tasks/${confirmDeleteTaskId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      setConfirmDeleteTaskId(null);
      fetchProject();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error eliminando tarea");
    } finally {
      setDeletingTaskId(null);
    }
  }

  async function handleBulkUpdate() {
    if (selectedTaskIds.size === 0 || !bulkUpdateStatus) {
      alert("Selecciona tareas y un estado");
      return;
    }

    try {
      await Promise.all(
        Array.from(selectedTaskIds).map((id) =>
          fetch(`/api/v1/tasks/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: bulkUpdateStatus }),
          })
        )
      );
      setSelectedTaskIds(new Set());
      setBulkUpdateStatus("");
      fetchProject();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error actualizando tareas");
    }
  }

  if (loading)
    return <p className="px-5 py-4 text-sm text-text-secondary">Cargando...</p>;
  if (error)
    return <p className="px-5 py-4 text-sm text-red-500">Error: {error}</p>;
  if (!project)
    return <p className="px-5 py-4 text-sm text-text-secondary">Proyecto no encontrado</p>;

  const tasksByStatus = {
    open: tasks.filter((t) => t.status === "open"),
    in_progress: tasks.filter((t) => t.status === "in_progress"),
    completed: tasks.filter((t) => t.status === "completed"),
    closed: tasks.filter((t) => t.status === "closed"),
  };

  const priorityColor = {
    low: "bg-blue-500/20 text-blue-600",
    medium: "bg-yellow-500/20 text-yellow-600",
    high: "bg-orange-500/20 text-orange-600",
    urgent: "bg-red-500/20 text-red-600",
  } as Record<string, string>;

  const priorityLabel = {
    low: "Baja",
    medium: "Media",
    high: "Alta",
    urgent: "Urgente",
  } as Record<string, string>;

  return (
    <div className="px-5 py-6">
      <Link href="/projects" className="mb-6 inline text-sm text-accent hover:underline">
        ← Volver a Proyectos
      </Link>

      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <span
            className={`rounded px-2 py-1 text-xs font-semibold ${
              project.status === "completed"
                ? "bg-green-500/20 text-green-600"
                : project.status === "archived"
                  ? "bg-gray-500/20 text-gray-600"
                  : "bg-blue-500/20 text-blue-600"
            }`}
          >
            {project.status === "active"
              ? "Activo"
              : project.status === "completed"
                ? "Completado"
                : "Archivado"}
          </span>
        </div>
        {project.description && (
          <p className="text-sm text-text-secondary">{project.description}</p>
        )}
        <p
          className="mt-2 text-sm font-medium"
          style={
            project.entity.colorToken
              ? { color: `var(--color-${project.entity.colorToken})` }
              : {}
          }
        >
          {project.entity.name}
        </p>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tareas ({tasks.length})</h2>
        <button
          onClick={() => setShowCreateTask(!showCreateTask)}
          className="rounded bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90"
        >
          {showCreateTask ? "Cancelar" : "+ Nueva Tarea"}
        </button>
      </div>

      {showCreateTask && (
        <div className="mb-6 rounded border border-border-soft bg-bg-secondary p-4">
          <div className="mb-4">
            <label className="block text-xs text-text-secondary">Título</label>
            <input
              type="text"
              value={createTaskData.title}
              onChange={(e) =>
                setCreateTaskData({ ...createTaskData, title: e.target.value })
              }
              placeholder="Título de la tarea"
              className="w-full rounded border border-border-soft bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs text-text-secondary">Descripción</label>
            <textarea
              value={createTaskData.description}
              onChange={(e) =>
                setCreateTaskData({ ...createTaskData, description: e.target.value })
              }
              placeholder="Descripción (opcional)"
              rows={2}
              className="w-full rounded border border-border-soft bg-bg-tertiary px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary"
            />
          </div>

          <div className="mb-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-text-secondary">Prioridad</label>
              <select
                value={createTaskData.priority}
                onChange={(e) =>
                  setCreateTaskData({ ...createTaskData, priority: e.target.value })
                }
                className="w-full rounded border border-border-soft bg-bg-tertiary px-3 py-2 text-sm text-text-primary"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-text-secondary">Vencimiento</label>
              <input
                type="date"
                value={createTaskData.dueDate}
                onChange={(e) =>
                  setCreateTaskData({ ...createTaskData, dueDate: e.target.value })
                }
                className="w-full rounded border border-border-soft bg-bg-tertiary px-3 py-2 text-sm text-text-primary"
              />
            </div>
          </div>

          <button
            onClick={handleCreateTask}
            className="rounded bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90"
          >
            Crear Tarea
          </button>
        </div>
      )}

      {tasks.length === 0 ? (
        <p className="text-sm text-text-secondary">
          Sin tareas en este proyecto. Creá una para empezar.
        </p>
      ) : (
        <>
          {selectedTaskIds.size > 0 && (
            <div className="mb-6 rounded border border-accent bg-accent/10 p-4">
              <div className="mb-3 text-sm font-semibold text-text-primary">
                {selectedTaskIds.size} tarea{selectedTaskIds.size !== 1 ? "s" : ""} seleccionada{selectedTaskIds.size !== 1 ? "s" : ""}
              </div>
              <div className="flex gap-2">
                <select
                  value={bulkUpdateStatus}
                  onChange={(e) => setBulkUpdateStatus(e.target.value)}
                  className="rounded border border-border-soft bg-bg-tertiary px-3 py-2 text-sm text-text-primary"
                >
                  <option value="">Cambiar estado a...</option>
                  <option value="open">Por Hacer</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="completed">Completada</option>
                  <option value="closed">Cerrada</option>
                </select>
                <button
                  onClick={handleBulkUpdate}
                  disabled={!bulkUpdateStatus}
                  className="rounded bg-accent px-4 py-2 text-sm text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Actualizar
                </button>
                <button
                  onClick={() => setSelectedTaskIds(new Set())}
                  className="rounded border border-border-soft px-4 py-2 text-sm hover:bg-bg-tertiary"
                >
                  Deseleccionar
                </button>
              </div>
            </div>
          )}
          <div className="grid gap-6">
          {[
            { key: "open", label: "Por Hacer", status: "open" },
            { key: "in_progress", label: "En Progreso", status: "in_progress" },
            { key: "completed", label: "Completadas", status: "completed" },
            { key: "closed", label: "Cerradas", status: "closed" },
          ].map(({ key, label, status }) => {
            const col = tasksByStatus[key as keyof typeof tasksByStatus];
            if (col.length === 0) return null;

            return (
              <div key={key}>
                <h3 className="mb-3 font-medium text-text-primary">
                  {label} ({col.length})
                </h3>
                <div className="space-y-2">
                  {col.map((task) => (
                    <div
                      key={task.id}
                      className={`rounded border p-3 transition ${
                        selectedTaskIds.has(task.id)
                          ? "border-accent bg-accent/10"
                          : "border-border-soft bg-bg-secondary"
                      }`}
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={selectedTaskIds.has(task.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedTaskIds);
                              if (e.target.checked) {
                                newSelected.add(task.id);
                              } else {
                                newSelected.delete(task.id);
                              }
                              setSelectedTaskIds(newSelected);
                            }}
                            className="mt-1 cursor-pointer"
                          />
                          <Link
                            href={`/projects/${projectId}/tasks/${task.id}`}
                            className="font-medium text-accent hover:underline"
                          >
                            {task.title}
                          </Link>
                        </div>
                        <div className="flex gap-2">
                          <span
                            className={`rounded px-2 py-1 text-xs font-semibold ${
                              priorityColor[task.priority] ||
                              "bg-gray-500/20 text-gray-600"
                            }`}
                          >
                            {priorityLabel[task.priority] || task.priority}
                          </span>
                        </div>
                      </div>

                      {task.description && (
                        <p className="mb-2 text-xs text-text-secondary">
                          {task.description}
                        </p>
                      )}

                      <div className="mb-3 flex items-center gap-2 text-xs text-text-tertiary">
                        {task.dueDate && (
                          <span>Vence: {formatDatePY(new Date(task.dueDate))}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <div className="flex gap-2">
                          {task.status !== "completed" && (
                            <button
                              onClick={() => handleUpdateTask(task.id, "completed")}
                              className="rounded bg-green-500/20 px-2 py-1 text-xs text-green-600 hover:bg-green-500/30"
                            >
                              Completar
                            </button>
                          )}
                          {task.status !== "closed" && task.status === "completed" && (
                            <button
                              onClick={() => handleUpdateTask(task.id, "closed")}
                              className="rounded bg-gray-500/20 px-2 py-1 text-xs text-gray-600 hover:bg-gray-500/30"
                            >
                              Cerrar
                            </button>
                          )}
                          {task.status === "open" && (
                            <button
                              onClick={() => handleUpdateTask(task.id, "in_progress")}
                              className="rounded bg-blue-500/20 px-2 py-1 text-xs text-blue-600 hover:bg-blue-500/30"
                            >
                              En Progreso
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => setConfirmDeleteTaskId(task.id)}
                          disabled={deletingTaskId === task.id}
                          className="text-xs text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          {deletingTaskId === task.id ? "Eliminando..." : "Eliminar"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          </div>
        </>
      )}

      {confirmDeleteTaskId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded border border-border-soft bg-bg-secondary p-6">
            <h3 className="mb-4 font-semibold text-text-primary">
              ¿Eliminar esta tarea?
            </h3>
            <p className="mb-6 text-sm text-text-secondary">
              Esta acción no puede ser revertida.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteTaskId(null)}
                className="rounded border border-border-soft px-4 py-2 text-sm hover:bg-bg-tertiary"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteTask}
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
