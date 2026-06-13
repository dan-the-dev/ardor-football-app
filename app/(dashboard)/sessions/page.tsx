import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { resolveSeason } from "@/lib/season";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import ScoreLineChart, { type ScoreDatum } from "@/components/charts/ScoreLineChart";
import { formatDateLong, formatDateShort } from "@/lib/format";
import type { Session } from "@/lib/types";

export default async function SessionsPage({
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
        <PageHeader title="Allenamenti" />
        <Card>
          <p className="text-sm text-gray-400">Nessuna stagione disponibile.</p>
        </Card>
      </div>
    );
  }

  const { data } = await supabase
    .from("sessions")
    .select("*")
    .eq("season_code", seasonCode)
    .order("data", { ascending: true });

  const sessions = (data ?? []) as Session[];

  const chartData: ScoreDatum[] = sessions.map((s) => ({
    label: formatDateShort(s.data),
    score: s.score_fisico,
  }));

  return (
    <div>
      <PageHeader title="Allenamenti" description="Storico sessioni della stagione selezionata" />

      <Card className="mb-6">
        <CardTitle>Andamento score fisico</CardTitle>
        {chartData.length > 0 ? (
          <ScoreLineChart data={chartData} />
        ) : (
          <p className="text-sm text-gray-500">Nessuna sessione registrata.</p>
        )}
      </Card>

      <Card>
        <CardTitle>Sessioni</CardTitle>
        {sessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ardor-gray text-xs uppercase text-gray-500">
                  <th className="px-3 py-2">Data</th>
                  <th className="px-3 py-2 text-right">Durata</th>
                  <th className="px-3 py-2 text-right">Score fisico</th>
                  <th className="px-3 py-2 text-right">Presenti</th>
                  <th className="px-3 py-2 text-right">Assenti</th>
                </tr>
              </thead>
              <tbody>
                {sessions
                  .slice()
                  .reverse()
                  .map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-ardor-gray/50 last:border-0 hover:bg-ardor-black"
                    >
                      <td className="px-3 py-2">
                        <Link
                          href={`/sessions/${s.id}?season=${seasonCode}`}
                          className="font-medium text-white hover:text-ardor-orange"
                        >
                          {formatDateLong(s.data)}
                        </Link>
                      </td>
                      <td className="px-3 py-2 text-right text-gray-400">
                        {s.durata_minuti} min
                      </td>
                      <td className="px-3 py-2 text-right text-gray-400">{s.score_fisico} / 5</td>
                      <td className="px-3 py-2 text-right text-gray-400">{s.presenti_count}</td>
                      <td className="px-3 py-2 text-right text-gray-400">{s.assenti_count}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Nessuna sessione registrata per questa stagione.</p>
        )}
      </Card>
    </div>
  );
}
