// Reglas de vencimiento confirmadas (FS-017). Hoy solo hay 2 códigos con
// regla confirmada: 211 (IVA, día 8 mensual) y 700 (IRE, 8 de abril anual).
// El resto queda "pendiente de confirmar" — nunca se calcula, per AI-001.

export function nextDueDate(code: string, from: Date = new Date()): Date | null {
  const year = from.getFullYear();
  const month = from.getMonth(); // 0-indexed
  const day = from.getDate();

  if (code === "211") {
    // Día 8 de cada mes
    const thisMonth = new Date(year, month, 8);
    if (day <= 8) return thisMonth;
    return new Date(year, month + 1, 8);
  }

  if (code === "700") {
    // 8 de abril, anual
    const thisYear = new Date(year, 3, 8); // abril = mes 3
    if (from <= thisYear) return thisYear;
    return new Date(year + 1, 3, 8);
  }

  return null; // sin regla confirmada
}

export function daysUntil(date: Date, from: Date = new Date()): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

export function formatDatePY(date: Date): string {
  return date.toLocaleDateString("es-PY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
