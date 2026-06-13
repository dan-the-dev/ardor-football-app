import { createClient } from "@/lib/supabase/server";
import { resolveSeason } from "@/lib/season";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import PlayersTable, { type PlayerRow } from "@/components/PlayersTable";
import type { Player, PlayerStats } from "@/lib/types";

export default async function PlayersPage({
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
        <PageHeader title="Rosa" />
        <Card>
          <p className="text-sm text-gray-400">Nessuna stagione disponibile.</p>
        </Card>
      </div>
    );
  }

  const [{ data: players }, { data: stats }] = await Promise.all([
    supabase.from("players").select("*").eq("season_code", seasonCode).order("cognome"),
    supabase.from("player_stats").select("*").eq("season_code", seasonCode),
  ]);

  const statsByPlayer = new Map<string, PlayerStats>(
    (stats ?? []).map((s) => [(s as PlayerStats).player_id, s as PlayerStats])
  );

  const rows: PlayerRow[] = (players ?? []).map((p) => ({
    ...(p as Player),
    stats: statsByPlayer.get((p as Player).id) ?? null,
  }));

  return (
    <div>
      <PageHeader title="Rosa" description="Giocatori e statistiche della stagione selezionata" />
      <Card>
        <PlayersTable players={rows} seasonCode={seasonCode} />
      </Card>
    </div>
  );
}
