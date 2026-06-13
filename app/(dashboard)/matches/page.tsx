import { createClient } from "@/lib/supabase/server";
import { resolveSeason } from "@/lib/season";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import MatchesTable from "@/components/MatchesTable";
import type { Match } from "@/lib/types";

export default async function MatchesPage({
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
        <PageHeader title="Partite" />
        <Card>
          <p className="text-sm text-gray-400">Nessuna stagione disponibile.</p>
        </Card>
      </div>
    );
  }

  const { data } = await supabase
    .from("matches")
    .select("*")
    .eq("season_code", seasonCode)
    .order("data", { ascending: true });

  const matches = (data ?? []) as Match[];

  return (
    <div>
      <PageHeader title="Partite" description="Storico partite della stagione selezionata" />
      <Card>
        <MatchesTable matches={matches} seasonCode={seasonCode} />
      </Card>
    </div>
  );
}
