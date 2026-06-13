import type { Ruolo } from "@/lib/types";

export const RUOLO_ORDER: Ruolo[] = [
  "portiere",
  "difensore",
  "centrocampista",
  "attaccante",
];

export const ROLE_LABELS: Record<Ruolo, string> = {
  portiere: "Portiere",
  difensore: "Difensore",
  centrocampista: "Centrocampista",
  attaccante: "Attaccante",
};

export const ROLE_BADGE_CLASSES: Record<Ruolo, string> = {
  portiere: "border-violet-500/30 bg-violet-500/15 text-violet-300",
  difensore: "border-blue-500/30 bg-blue-500/15 text-blue-300",
  centrocampista: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
  attaccante: "border-ardor-orange/30 bg-ardor-orange/15 text-ardor-orange",
};

export const ROLE_CHART_COLORS: Record<Ruolo, string> = {
  portiere: "#a78bfa",
  difensore: "#60a5fa",
  centrocampista: "#34d399",
  attaccante: "#e87425",
};

export function roleSortIndex(ruolo: Ruolo | null | undefined): number {
  if (!ruolo) return RUOLO_ORDER.length;
  const idx = RUOLO_ORDER.indexOf(ruolo);
  return idx === -1 ? RUOLO_ORDER.length : idx;
}

export function comparePlayersByRoleAndName<
  T extends { ruolo: Ruolo | null; cognome: string; nome: string }
>(a: T, b: T): number {
  const roleDiff = roleSortIndex(a.ruolo) - roleSortIndex(b.ruolo);
  if (roleDiff !== 0) return roleDiff;

  const cognomeDiff = a.cognome.localeCompare(b.cognome, "it");
  if (cognomeDiff !== 0) return cognomeDiff;

  return a.nome.localeCompare(b.nome, "it");
}
