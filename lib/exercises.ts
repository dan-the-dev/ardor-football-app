export const CATEGORY_LABELS: Record<string, string> = {
  riscaldamento: "Riscaldamento",
  possesso: "Possesso",
  tattica: "Tattica",
  fisico: "Fisico",
  "calci-piazzati": "Calci piazzati",
  partitella: "Partitella",
};

export const CATEGORY_BADGE_CLASSES: Record<string, string> = {
  riscaldamento: "border-amber-500/30 bg-amber-500/15 text-amber-300",
  possesso: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
  tattica: "border-blue-500/30 bg-blue-500/15 text-blue-300",
  fisico: "border-rose-500/30 bg-rose-500/15 text-rose-300",
  "calci-piazzati": "border-violet-500/30 bg-violet-500/15 text-violet-300",
  partitella: "border-ardor-orange/30 bg-ardor-orange/15 text-ardor-orange",
};

export const ALL_CATEGORIES = "tutte";

export function formatCategoriaLabel(categoria: string): string {
  if (CATEGORY_LABELS[categoria]) return CATEGORY_LABELS[categoria];
  return categoria
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getCategoryBadgeClasses(categoria: string): string {
  return (
    CATEGORY_BADGE_CLASSES[categoria] ??
    "border-ardor-gray bg-ardor-black text-gray-300"
  );
}
