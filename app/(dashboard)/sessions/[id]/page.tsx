import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { resolveSeason } from "@/lib/season";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle, StatCard } from "@/components/ui/Card";
import { formatDateLong } from "@/lib/format";
import type { Session, SessionExercise } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  riscaldamento: "Riscaldamento",
  possesso: "Possesso",
  tattica: "Tattica",
  fisico: "Fisico",
  "calci-piazzati": "Calci piazzati",
  partitella: "Partitella",
};

export default async function SessionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const seasonCode = await resolveSeason(sp);
  const supabase = await createClient();

  const [{ data: session }, { data: exercises }] = await Promise.all([
    supabase.from("sessions").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("session_exercises")
      .select("*")
      .eq("session_id", id)
      .order("exercise_slug", { ascending: true }),
  ]);

  if (!session) {
    return (
      <div>
        <PageHeader title="Sessione" />
        <Card>
          <p className="text-sm text-gray-400">Sessione non trovata.</p>
        </Card>
      </div>
    );
  }

  const s = session as Session;
  const sessionExercises = (exercises ?? []) as SessionExercise[];

  return (
    <div>
      <Link
        href={`/sessions?season=${seasonCode ?? s.season_code}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-ardor-orange"
      >
        <ArrowLeft size={16} /> Torna agli allenamenti
      </Link>

      <PageHeader title={formatDateLong(s.data)} description="Dettaglio sessione" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Durata" value={`${s.durata_minuti} min`} />
        <StatCard label="Score fisico" value={`${s.score_fisico} / 5`} />
        <StatCard label="Presenti" value={s.presenti_count} />
        <StatCard label="Assenti" value={s.assenti_count} />
      </div>

      {s.note && (
        <Card className="mt-6">
          <CardTitle>Note</CardTitle>
          <p className="text-sm text-gray-300">{s.note}</p>
        </Card>
      )}

      <Card className="mt-6">
        <CardTitle>Esercizi svolti</CardTitle>
        {sessionExercises.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-ardor-gray text-xs uppercase text-gray-500">
                  <th className="px-3 py-2">Esercizio</th>
                  <th className="px-3 py-2">Categoria</th>
                  <th className="px-3 py-2 text-right">Durata</th>
                  <th className="px-3 py-2 text-right">Score</th>
                  <th className="px-3 py-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {sessionExercises.map((ex) => (
                  <tr
                    key={`${ex.session_id}-${ex.exercise_slug}`}
                    className="border-b border-ardor-gray/50 last:border-0"
                  >
                    <td className="px-3 py-2 font-medium text-white">{ex.exercise_slug}</td>
                    <td className="px-3 py-2 text-gray-400">
                      {CATEGORY_LABELS[ex.categoria] ?? ex.categoria}
                    </td>
                    <td className="px-3 py-2 text-right text-gray-400">{ex.durata_minuti} min</td>
                    <td className="px-3 py-2 text-right text-gray-400">{ex.score} / 5</td>
                    <td className="px-3 py-2 text-gray-400">{ex.note ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Nessun esercizio registrato per questa sessione.</p>
        )}
      </Card>
    </div>
  );
}
