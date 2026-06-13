"use client";

import { useState } from "react";
import type { Exercise } from "@/lib/types";

export const CATEGORY_LABELS: Record<string, string> = {
  riscaldamento: "Riscaldamento",
  possesso: "Possesso",
  tattica: "Tattica",
  fisico: "Fisico",
  "calci-piazzati": "Calci piazzati",
  partitella: "Partitella",
};

export default function ExercisesTable({ exercises }: { exercises: Exercise[] }) {
  const [filter, setFilter] = useState<string>("tutte");

  const categories = Array.from(new Set(exercises.map((e) => e.categoria)));
  const filtered = filter === "tutte" ? exercises : exercises.filter((e) => e.categoria === filter);

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm text-gray-400">Categoria:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-ardor-gray bg-ardor-black px-2 py-1 text-sm text-white outline-none focus:border-ardor-orange"
        >
          <option value="tutte">Tutte</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c] ?? c}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ardor-gray text-xs uppercase text-gray-500">
              <th className="px-3 py-2">Nome</th>
              <th className="px-3 py-2">Categoria</th>
              <th className="px-3 py-2 text-right">Volte usato</th>
              <th className="px-3 py-2 text-right">Score medio</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ex) => (
              <tr key={ex.slug} className="border-b border-ardor-gray/50 last:border-0 hover:bg-ardor-black">
                <td className="px-3 py-2 font-medium text-white">{ex.nome}</td>
                <td className="px-3 py-2 text-gray-400">{CATEGORY_LABELS[ex.categoria] ?? ex.categoria}</td>
                <td className="px-3 py-2 text-right text-gray-300">{ex.volte_usato}</td>
                <td className="px-3 py-2 text-right text-gray-300">
                  {ex.score_medio != null ? ex.score_medio.toFixed(1) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-500">Nessun esercizio trovato.</p>
        )}
      </div>
    </div>
  );
}
