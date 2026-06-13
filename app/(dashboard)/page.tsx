import { createClient } from "@/lib/supabase/server";
import { resolveSeason } from "@/lib/season";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle, StatCard } from "@/components/ui/Card";
import GoalsBarChart, { type GoalsBarChartDatum } from "@/components/charts/GoalsBarChart";
import { formatDateLong, formatDateShort, playerName } from "@/lib/format";
import type { Match, PlayerStats, Season } from "@/lib/types";

interface PlayerStatsRow extends PlayerStats {
  players: { nome: string; cognome: string } | null;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const seasonCode = await resolveSeason(params);
  const supabase = await createClient();

  if (!seasonCode) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <Card>
          <p className="text-sm text-gray-400">
            Nessuna stagione trovata nel database. Esegui il sync di{" "}
            <code className="rounded bg-ardor-black px-1.5 py-0.5 text-xs">data.sql</code> per
            popolare i dati.
          </p>
        </Card>
      </div>
    );
  }

  const [{ data: season }, { data: playedMatches }, { data: scheduledMatches }, { data: topScorers }, { data: topAssists }] =
    await Promise.all([
      supabase.from("seasons").select("*").eq("code", seasonCode).maybeSingle(),
      supabase
        .from("matches")
        .select("*")
        .eq("season_code", seasonCode)
        .eq("status", "played")
        .order("data", { ascending: true }),
      supabase
        .from("matches")
        .select("*")
        .eq("season_code", seasonCode)
        .eq("status", "scheduled")
        .order("data", { ascending: true }),
      supabase
        .from("player_stats")
        .select("*, players(nome, cognome)")
        .eq("season_code", seasonCode)
        .order("gol", { ascending: false, nullsFirst: false })
        .limit(3),
      supabase
        .from("player_stats")
        .select("*, players(nome, cognome)")
        .eq("season_code", seasonCode)
        .order("assist", { ascending: false, nullsFirst: false })
        .limit(3),
    ]);

  const matches = (playedMatches ?? []) as Match[];
  const upcoming = (scheduledMatches ?? []) as Match[];
  const scorers = (topScorers ?? []) as unknown as PlayerStatsRow[];
  const assists = (topAssists ?? []) as unknown as PlayerStatsRow[];

  let vittorie = 0;
  let pareggi = 0;
  let sconfitte = 0;
  for (const m of matches) {
    if (m.gol_fatti == null || m.gol_subiti == null) continue;
    if (m.gol_fatti > m.gol_subiti) vittorie++;
    else if (m.gol_fatti === m.gol_subiti) pareggi++;
    else sconfitte++;
  }

  const chartData: GoalsBarChartDatum[] = matches.map((m) => ({
    label: `${formatDateShort(m.data)} ${m.avversario}`,
    gol_fatti: m.gol_fatti ?? 0,
    gol_subiti: m.gol_subiti ?? 0,
  }));

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={(season as Season | null)?.name ?? seasonCode}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Piazzamento" value={(season as Season | null)?.piazzamento ?? "—"} />
        <StatCard label="Partite giocate" value={matches.length} />
        <StatCard label="V / N / P" value={`${vittorie} / ${pareggi} / ${sconfitte}`} />
        <StatCard
          label="Gol fatti / subiti"
          value={`${matches.reduce((s, m) => s + (m.gol_fatti ?? 0), 0)} / ${matches.reduce(
            (s, m) => s + (m.gol_subiti ?? 0),
            0
          )}`}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>Gol fatti vs subiti per partita</CardTitle>
          {chartData.length > 0 ? (
            <GoalsBarChart data={chartData} />
          ) : (
            <p className="text-sm text-gray-500">Nessuna partita giocata per questa stagione.</p>
          )}
        </Card>

        <Card>
          <CardTitle>Prossimi impegni</CardTitle>
          {upcoming.length > 0 ? (
            <ul className="space-y-3">
              {upcoming.map((m) => (
                <li key={m.id} className="flex flex-col">
                  <span className="text-sm font-medium text-white">{m.avversario}</span>
                  <span className="text-xs text-gray-500">
                    {formatDateLong(m.data)} ·{" "}
                    {m.competizione === "campionato" ? "Campionato" : "Coppa Lombardia"} ·{" "}
                    {m.casa_trasferta}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Nessun impegno in programma.</p>
          )}
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Top marcatori</CardTitle>
          {scorers.length > 0 ? (
            <ol className="space-y-2">
              {scorers.map((row, i) => (
                <li
                  key={row.player_id}
                  className="flex items-center justify-between rounded-lg bg-ardor-black px-3 py-2"
                >
                  <span className="text-sm text-white">
                    <span className="mr-2 text-ardor-orange">#{i + 1}</span>
                    {playerName(row.players)}
                  </span>
                  <span className="text-sm font-semibold text-ardor-orange">{row.gol ?? 0}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-gray-500">Nessun dato disponibile.</p>
          )}
        </Card>

        <Card>
          <CardTitle>Top assist</CardTitle>
          {assists.some((row) => row.assist != null) ? (
            <ol className="space-y-2">
              {assists.map((row, i) => (
                <li
                  key={row.player_id}
                  className="flex items-center justify-between rounded-lg bg-ardor-black px-3 py-2"
                >
                  <span className="text-sm text-white">
                    <span className="mr-2 text-ardor-orange">#{i + 1}</span>
                    {playerName(row.players)}
                  </span>
                  <span className="text-sm font-semibold text-ardor-orange">{row.assist ?? 0}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-gray-500">
              Dati assist non disponibili per questa stagione.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
