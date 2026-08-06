// Formato de números para Paraguay

export function formatNumberPY(value: number): string {
  return new Intl.NumberFormat("es-PY", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrencyPY(value: number, currency = "PYG"): string {
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
