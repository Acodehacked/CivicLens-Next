export const SEVERITY_STYLES: Record<string, { label: string; badgeClass: string }> = {
  low: { label: "Low", badgeClass: "bg-slate-50 text-slate-600 border-slate-200" },
  medium: { label: "Medium", badgeClass: "bg-amber-50 text-amber-700 border-amber-200" },
  high: { label: "High", badgeClass: "bg-orange-50 text-orange-700 border-orange-200" },
  critical: { label: "Critical", badgeClass: "bg-red-50 text-red-700 border-red-200" },
};

export function severityStyle(severity: string | null | undefined) {
  if (severity && SEVERITY_STYLES[severity]) return SEVERITY_STYLES[severity];
  return {
    label: severity ?? "Unknown",
    badgeClass: "bg-slate-50 text-slate-600 border-slate-200",
  };
}

export function formatIssueLabel(value: string | null | undefined) {
  if (!value) return "Unknown Issue";
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
