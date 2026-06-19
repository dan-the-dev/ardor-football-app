export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function playerName(p: { nome: string; cognome: string } | null | undefined): string {
  if (!p) return "—";
  return `${p.nome} ${p.cognome}`;
}

export function truncateText(text: string | null | undefined, maxLength = 100): string | null {
  if (!text) return null;
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}
