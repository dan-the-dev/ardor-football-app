"use client";

import { useState } from "react";
import Link from "next/link";
import type { Match } from "@/lib/types";
import { formatDateLong } from "@/lib/format";

const COMPETIZIONE_LABELS: Record<string, string> = {
  campionato: "Campionato",
  "coppa-lombardia": "Coppa Lombardia",
};

const FASE_LABELS: Record<string, string> = {
  girone: "Girone",
  trentaduesimi: "Trentaduesimi",
  sedicesimi: "Sedicesimi",
  ottavi: "Ottavi",
  quarti: "Quarti",
  semifinale: "Semifinale",
  finale: "Finale",
};

function esito(m: Match): "V" | "N" | "P" | null {
  if (m.gol_fatti == null || m.gol_subiti == null) return null;
  if (m.gol_fatti > m.gol_subiti) return "V";
  if (m.gol_fatti === m.gol_subiti) return "N";
  return "P";
}

const ESITO_STYLES: Record<string, string> = {
  V: "bg-green-500/10 text-green-400",
  N: "bg-gray-500/10 text-gray-300",
  P: "bg-red-500/10 text-red-400",
};

export default function MatchesTable({
  matches,
  seasonCode,
}: {
  matches: Match[];
  seasonCode: string;
}) {
  const [filter, setFilter] = useState<"tutte" | "campionato" | "coppa-lombardia">("tutte");

  const filtered =
    filter === "tutte" ? matches : matches.filter((m) => m.competizione === filter);

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm text-gray-400">Competizione:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="rounded-lg border border-ardor-gray bg-ardor-black px-2 py-1 text-sm text-white outline-none focus:border-ardor-orange"
        >
          <option value="tutte">Tutte</option>
          <option value="campionato">Campionato</option>
          <option value="coppa-lombardia">Coppa Lombardia</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ardor-gray text-xs uppercase text-gray-500">
              <th className="px-3 py-2">Data</th>
              <th className="px-3 py-2">Avversario</th>
              <th className="px-3 py-2">Competizione</th>
              <th className="px-3 py-2 text-right">Risultato</th>
              <th className="px-3 py-2 text-center">Esito</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => {
              const e = esito(m);
              return (
                <tr
                  key={m.id}
                  className="border-b border-ardor-gray/50 last:border-0 hover:bg-ardor-black"
                >
                  <td className="px-3 py-2">
                    <Link
                      href={`/matches/${m.id}?season=${seasonCode}`}
                      className="font-medium text-white hover:text-ardor-orange"
                    >
                      {formatDateLong(m.data)}
                    </Link>
                  </td>
                  <td className="px-3 py-2 text-gray-300">
                    {m.avversario}
                    <span className="ml-2 text-xs text-gray-500">({m.casa_trasferta})</span>
                  </td>
                  <td className="px-3 py-2 text-gray-400">
                    {COMPETIZIONE_LABELS[m.competizione]}
                    {m.fase && <span className="ml-1 text-xs text-gray-500">· {FASE_LABELS[m.fase] ?? m.fase}</span>}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-300">
                    {m.status === "played" ? `${m.gol_fatti} - ${m.gol_subiti}` : "—"}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {e ? (
                      <span
                        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${ESITO_STYLES[e]}`}
                      >
                        {e}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">da giocare</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-500">Nessuna partita trovata.</p>
        )}
      </div>
    </div>
  );
}
