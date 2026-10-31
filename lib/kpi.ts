/** Assemble la valeur et l'unité d'un KPI saisi dans l'admin ("1.2" + "M", "+850" + " "). */
export function formatKpiValue(value: string, unit?: string | null): string {
  const cleanUnit = unit?.trim();
  if (!cleanUnit) return value;
  return `${value}${/^[^\w+]/.test(cleanUnit) ? "" : " "}${cleanUnit}`;
}
