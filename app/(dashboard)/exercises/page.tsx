import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import ExercisesTable, { CATEGORY_LABELS } from "@/components/ExercisesTable";
import GoalsPieChart, { type GoalsPieDatum } from "@/components/charts/GoalsPieChart";
import type { Exercise, ExercisesByCategory } from "@/lib/types";

export default async function ExercisesPage() {
  const supabase = await createClient();

  const [{ data: exercises }, { data: byCategory }] = await Promise.all([
    supabase.from("exercises").select("*").order("nome", { ascending: true }),
    supabase.from("exercises_by_category").select("*"),
  ]);

  const exerciseRows = (exercises ?? []) as Exercise[];
  const categoryRows = (byCategory ?? []) as ExercisesByCategory[];

  const pieData: GoalsPieDatum[] = categoryRows
    .filter((c) => c.volte_usato_totale > 0)
    .map((c) => ({ name: CATEGORY_LABELS[c.categoria] ?? c.categoria, value: c.volte_usato_totale }));

  return (
    <div>
      <PageHeader title="Esercizi" description="Catalogo esercizi e statistiche di utilizzo, su tutte le stagioni" />

      <Card className="mb-6">
        <CardTitle>Catalogo esercizi</CardTitle>
        <ExercisesTable exercises={exerciseRows} />
      </Card>

      <Card className="mb-6">
        <CardTitle>Distribuzione utilizzo per categoria</CardTitle>
        {pieData.length > 0 ? (
          <GoalsPieChart data={pieData} />
        ) : (
          <p className="text-sm text-gray-500">Nessun dato di utilizzo disponibile.</p>
        )}
      </Card>

      <Card>
        <CardTitle>Statistiche per categoria squadra</CardTitle>
        {categoryRows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ardor-gray text-xs uppercase text-gray-500">
                  <th className="px-3 py-2">Categoria</th>
                  <th className="px-3 py-2 text-right">N. esercizi</th>
                  <th className="px-3 py-2 text-right">Volte usato (totale)</th>
                  <th className="px-3 py-2 text-right">Score medio</th>
                </tr>
              </thead>
              <tbody>
                {categoryRows.map((c) => (
                  <tr key={c.categoria} className="border-b border-ardor-gray/50 last:border-0">
                    <td className="px-3 py-2 font-medium text-white">
                      {CATEGORY_LABELS[c.categoria] ?? c.categoria}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-300">{c.numero_esercizi}</td>
                    <td className="px-3 py-2 text-right text-gray-300">{c.volte_usato_totale}</td>
                    <td className="px-3 py-2 text-right text-gray-300">
                      {c.score_medio != null ? c.score_medio.toFixed(1) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Nessun dato disponibile dalla vista exercises_by_category.</p>
        )}
      </Card>
    </div>
  );
}
