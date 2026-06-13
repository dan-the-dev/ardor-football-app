"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Player, PlayerStats, Ruolo } from "@/lib/types";

export interface PlayerRow extends Player {
  stats: PlayerStats | null;
}

const ROLE_LABELS: Record<Ruolo, string> = {
  portiere: "Portiere",
  difensore: "Difensore",
  centrocampista: "Centrocampista",
  attaccante: "Attaccante",
};

export default function PlayersTable({
  players,
  seasonCode,
}: {
  players: PlayerRow[];
  seasonCode: string;
}) {
  const [roleFilter, setRoleFilter] = useState<string>("tutti");

  const roles = useMemo(() => {
    const set = new Set<string>();
    players.forEach((p) => p.ruolo && set.add(p.ruolo));
    return Array.from(set);
  }, [players]);

  const filtered =
    roleFilter === "tutti" ? players : players.filter((p) => p.ruolo === roleFilter);

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm text-gray-400">Ruolo:</label>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-ardor-gray bg-ardor-black px-2 py-1 text-sm text-white outline-none focus:border-ardor-orange"
        >
          <option value="tutti">Tutti</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABELS[r as Ruolo] ?? r}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ardor-gray text-xs uppercase text-gray-500">
              <th className="px-3 py-2">Nome</th>
              <th className="px-3 py-2">Anno</th>
              <th className="px-3 py-2">Ruolo</th>
              <th className="px-3 py-2 text-right">Presenze</th>
              <th className="px-3 py-2 text-right">Minuti</th>
              <th className="px-3 py-2 text-right">Gol</th>
              <th className="px-3 py-2 text-right">Assist</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="border-b border-ardor-gray/50 last:border-0 hover:bg-ardor-black"
              >
                <td className="px-3 py-2">
                  <Link
                    href={`/players/${p.id}?season=${seasonCode}`}
                    className="font-medium text-white hover:text-ardor-orange"
                  >
                    {p.nome} {p.cognome}
                  </Link>
                  {p.fuoriquota && (
                    <span className="ml-2 rounded bg-ardor-orange/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-ardor-orange">
                      FQ
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-gray-400">{p.anno_nascita}</td>
                <td className="px-3 py-2 text-gray-400">
                  {p.ruolo ? ROLE_LABELS[p.ruolo] : "—"}
                </td>
                <td className="px-3 py-2 text-right text-gray-400">
                  {p.stats?.presenze_partite ?? "—"}
                </td>
                <td className="px-3 py-2 text-right text-gray-400">
                  {p.stats?.minuti_giocati ?? "—"}
                </td>
                <td className="px-3 py-2 text-right text-gray-400">{p.stats?.gol ?? 0}</td>
                <td className="px-3 py-2 text-right text-gray-400">
                  {p.stats?.assist ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-500">Nessun giocatore trovato.</p>
        )}
      </div>
    </div>
  );
}
