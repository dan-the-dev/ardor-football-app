"use client";

import { useState } from "react";
import { ArrowDown } from "lucide-react";
import { playerName } from "@/lib/format";
import type { Player, PlayerStats } from "@/lib/types";

export interface StatsRow {
  player: Pick<Player, "id" | "nome" | "cognome" | "ruolo">;
  stats: PlayerStats | null;
}

type SortKey = "presenze" | "minuti" | "gol" | "assist";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "presenze", label: "Presenze" },
  { key: "minuti", label: "Minuti" },
  { key: "gol", label: "Gol" },
  { key: "assist", label: "Assist" },
];

function value(row: StatsRow, key: SortKey): number {
  switch (key) {
    case "presenze":
      return row.stats?.presenze_partite ?? 0;
    case "minuti":
      return row.stats?.minuti_giocati ?? 0;
    case "gol":
      return row.stats?.gol ?? 0;
    case "assist":
      return row.stats?.assist ?? 0;
  }
}

export default function StatsTable({ rows }: { rows: StatsRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("gol");

  const sorted = [...rows].sort((a, b) => value(b, sortKey) - value(a, sortKey));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-ardor-gray text-xs uppercase text-gray-500">
            <th className="px-3 py-2">Giocatore</th>
            {COLUMNS.map((col) => (
              <th key={col.key} className="px-3 py-2 text-right">
                <button
                  onClick={() => setSortKey(col.key)}
                  className={`inline-flex items-center gap-1 hover:text-ardor-orange ${
                    sortKey === col.key ? "text-ardor-orange" : ""
                  }`}
                >
                  {col.label}
                  {sortKey === col.key && <ArrowDown size={12} />}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr
              key={row.player.id}
              className="border-b border-ardor-gray/50 last:border-0 hover:bg-ardor-black"
            >
              <td className="px-3 py-2 font-medium text-white">{playerName(row.player)}</td>
              <td className="px-3 py-2 text-right text-gray-300">{row.stats?.presenze_partite ?? 0}</td>
              <td className="px-3 py-2 text-right text-gray-300">{row.stats?.minuti_giocati ?? 0}</td>
              <td className="px-3 py-2 text-right text-gray-300">{row.stats?.gol ?? 0}</td>
              <td className="px-3 py-2 text-right text-gray-300">{row.stats?.assist ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {sorted.length === 0 && (
        <p className="py-6 text-center text-sm text-gray-500">Nessuna statistica disponibile.</p>
      )}
    </div>
  );
}
