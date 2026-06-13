"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import RoleBadge from "@/components/RoleBadge";
import { comparePlayersByRoleAndName, ROLE_LABELS, RUOLO_ORDER } from "@/lib/roles";
import type { Player, PlayerStats } from "@/lib/types";

export interface PlayerRow extends Player {
  stats: PlayerStats | null;
}

const selectClassName =
  "rounded-lg border border-ardor-gray bg-ardor-black px-2 py-1.5 text-sm text-white outline-none focus:border-ardor-orange";

export default function PlayersTable({
  players,
  seasonCode,
}: {
  players: PlayerRow[];
  seasonCode: string;
}) {
  const [roleFilter, setRoleFilter] = useState<string>("tutti");
  const [yearFilter, setYearFilter] = useState<string>("tutti");

  const sorted = useMemo(
    () => [...players].sort(comparePlayersByRoleAndName),
    [players]
  );

  const years = useMemo(() => {
    const set = new Set<number>();
    players.forEach((p) => set.add(p.anno_nascita));
    return Array.from(set).sort((a, b) => b - a);
  }, [players]);

  const filtered = useMemo(() => {
    return sorted.filter((p) => {
      if (roleFilter !== "tutti" && p.ruolo !== roleFilter) return false;
      if (yearFilter !== "tutti" && String(p.anno_nascita) !== yearFilter) return false;
      return true;
    });
  }, [sorted, roleFilter, yearFilter]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="role-filter" className="text-sm text-gray-400">
            Ruolo
          </label>
          <select
            id="role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className={selectClassName}
          >
            <option value="tutti">Tutti</option>
            {RUOLO_ORDER.filter((r) => players.some((p) => p.ruolo === r)).map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="year-filter" className="text-sm text-gray-400">
            Anno
          </label>
          <select
            id="year-filter"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className={selectClassName}
          >
            <option value="tutti">Tutti</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-gray-500">
          {filtered.length} di {players.length} giocatori
        </span>
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
                <td className="px-3 py-2">
                  <RoleBadge ruolo={p.ruolo} />
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
