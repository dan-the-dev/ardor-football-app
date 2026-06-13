import { createClient } from "@/lib/supabase/server";
import { resolveSeason } from "@/lib/season";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import StatsTable, { type StatsRow } from "@/components/StatsTable";
import GoalsPieChart, { type GoalsPieDatum } from "@/components/charts/GoalsPieChart";
import FormationsChart, { type FormationsChartDatum } from "@/components/charts/FormationsChart";
import { ROLE_CHART_COLORS, ROLE_LABELS, RUOLO_ORDER } from "@/lib/roles";
import type { Formation, Player, PlayerStats, Ruolo } from "@/lib/types";

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const seasonCode = await resolveSeason(sp);
  const supabase = await createClient();

  if (!seasonCode) {
    return (
      <div>
        <PageHeader title="Statistiche" />
        <Card>
          <p className="text-sm text-gray-400">Nessuna stagione disponibile.</p>
        </Card>
      </div>
    );
  }

  const [{ data: players }, { data: stats }, { data: formations }] = await Promise.all([
    supabase.from("players").select("*").eq("season_code", seasonCode),
    supabase.from("player_stats").select("*").eq("season_code", seasonCode),
    supabase.from("formations").select("*").eq("season_code", seasonCode).order("volte_usato", { ascending: false }),
  ]);

  const playerRows = (players ?? []) as Player[];
  const statsRows = (stats ?? []) as PlayerStats[];
  const statsByPlayer = new Map(statsRows.map((s) => [s.player_id, s]));
  const formationRows = (formations ?? []) as Formation[];

  const rows: StatsRow[] = playerRows.map((p) => ({
    player: { id: p.id, nome: p.nome, cognome: p.cognome, ruolo: p.ruolo },
    stats: statsByPlayer.get(p.id) ?? null,
  }));

  const goalsByRole = new Map<Ruolo, number>();
  for (const row of rows) {
    if (!row.player.ruolo) continue;
    const current = goalsByRole.get(row.player.ruolo) ?? 0;
    goalsByRole.set(row.player.ruolo, current + (row.stats?.gol ?? 0));
  }

  const pieData: GoalsPieDatum[] = RUOLO_ORDER.filter((ruolo) => (goalsByRole.get(ruolo) ?? 0) > 0).map(
    (ruolo) => ({
      name: ROLE_LABELS[ruolo],
      value: goalsByRole.get(ruolo) ?? 0,
      color: ROLE_CHART_COLORS[ruolo],
    })
  );

  const formationsChartData: FormationsChartDatum[] = formationRows.map((f) => ({
    modulo: f.modulo,
    vittorie: f.vittorie,
    pareggi: f.pareggi,
    sconfitte: f.sconfitte,
  }));

  return (
    <div>
      <PageHeader title="Statistiche" description="Classifiche e tattiche della stagione selezionata" />

      <Card className="mb-6">
        <CardTitle>Classifiche</CardTitle>
        <StatsTable rows={rows} />
      </Card>

      <Card className="mb-6">
        <CardTitle>Distribuzione gol per ruolo</CardTitle>
        {pieData.length > 0 ? (
          <GoalsPieChart data={pieData} />
        ) : (
          <p className="text-sm text-gray-500">Nessun gol registrato per questa stagione.</p>
        )}
      </Card>

      <Card>
        <CardTitle>Tattiche di squadra</CardTitle>
        {formationRows.length > 0 ? (
          <>
            <FormationsChart data={formationsChartData} />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-ardor-gray text-xs uppercase text-gray-500">
                    <th className="px-3 py-2">Modulo</th>
                    <th className="px-3 py-2 text-right">Volte usato</th>
                    <th className="px-3 py-2 text-right">V</th>
                    <th className="px-3 py-2 text-right">N</th>
                    <th className="px-3 py-2 text-right">P</th>
                    <th className="px-3 py-2 text-right">Gol fatti</th>
                    <th className="px-3 py-2 text-right">Gol subiti</th>
                  </tr>
                </thead>
                <tbody>
                  {formationRows.map((f) => (
                    <tr key={f.modulo} className="border-b border-ardor-gray/50 last:border-0">
                      <td className="px-3 py-2 font-medium text-white">{f.modulo}</td>
                      <td className="px-3 py-2 text-right text-gray-300">{f.volte_usato}</td>
                      <td className="px-3 py-2 text-right text-gray-300">{f.vittorie}</td>
                      <td className="px-3 py-2 text-right text-gray-300">{f.pareggi}</td>
                      <td className="px-3 py-2 text-right text-gray-300">{f.sconfitte}</td>
                      <td className="px-3 py-2 text-right text-gray-300">{f.gol_fatti}</td>
                      <td className="px-3 py-2 text-right text-gray-300">{f.gol_subiti}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">Nessuna formazione registrata per questa stagione.</p>
        )}
      </Card>
    </div>
  );
}
