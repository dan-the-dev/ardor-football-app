import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { resolveSeason } from "@/lib/season";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle } from "@/components/ui/Card";
import { formatDateLong, playerName } from "@/lib/format";
import type { Match, MatchAssist, MatchCard, MatchLineup, MatchScorer } from "@/lib/types";

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

const LINEUP_STATUS_LABELS: Record<string, string> = {
  titolare: "Titolari",
  subentrato: "Subentrati",
  convocato: "Convocati (non entrati)",
};

const SCORER_TIPO_LABELS: Record<string, string> = {
  gol: "Gol",
  rigore: "Rigore",
  autogol: "Autogol",
};

interface PersonRef {
  nome: string;
  cognome: string;
}

export default async function MatchDetailPage({
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

  const [{ data: match }, { data: lineups }, { data: scorers }, { data: assists }, { data: cards }] =
    await Promise.all([
      supabase.from("matches").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("match_lineups")
        .select("*, players(nome, cognome)")
        .eq("match_id", id),
      supabase
        .from("match_scorers")
        .select("*, players(nome, cognome)")
        .eq("match_id", id)
        .order("minuto", { ascending: true }),
      supabase
        .from("match_assists")
        .select("*, players(nome, cognome)")
        .eq("match_id", id)
        .order("minuto", { ascending: true }),
      supabase
        .from("match_cards")
        .select("*, players(nome, cognome)")
        .eq("match_id", id)
        .order("minuto", { ascending: true }),
    ]);

  if (!match) {
    return (
      <div>
        <PageHeader title="Partita" />
        <Card>
          <p className="text-sm text-gray-400">Partita non trovata.</p>
        </Card>
      </div>
    );
  }

  const m = match as Match;
  const lineupRows = (lineups ?? []) as unknown as (MatchLineup & { players: PersonRef | null })[];
  const scorerRows = (scorers ?? []) as unknown as (MatchScorer & { players: PersonRef | null })[];
  const assistRows = (assists ?? []) as unknown as (MatchAssist & { players: PersonRef | null })[];
  const cardRows = (cards ?? []) as unknown as (MatchCard & { players: PersonRef | null })[];

  const titolari = lineupRows.filter((l) => l.status === "titolare");
  const subentrati = lineupRows.filter((l) => l.status === "subentrato");
  const convocati = lineupRows.filter((l) => l.status === "convocato");

  return (
    <div>
      <Link
        href={`/matches?season=${seasonCode ?? m.season_code}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-ardor-orange"
      >
        <ArrowLeft size={16} /> Torna alle partite
      </Link>

      <PageHeader
        title={`vs ${m.avversario}`}
        description={`${formatDateLong(m.data)} · ${COMPETIZIONE_LABELS[m.competizione]}${
          m.fase ? ` · ${FASE_LABELS[m.fase] ?? m.fase}` : ""
        } · ${m.casa_trasferta}`}
      />

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Risultato</p>
            <p className="text-3xl font-semibold text-white">
              {m.status === "played" ? `${m.gol_fatti} - ${m.gol_subiti}` : "Da giocare"}
            </p>
          </div>
        </div>
        {m.note && <p className="mt-3 text-sm text-gray-400">{m.note}</p>}
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Marcatori</CardTitle>
          {scorerRows.length > 0 ? (
            <ul className="space-y-2">
              {scorerRows.map((row, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-ardor-black px-3 py-2 text-sm"
                >
                  <span className="text-white">{playerName(row.players)}</span>
                  <span className="text-gray-400">
                    {row.minuto != null ? `${row.minuto}'` : "—"} ·{" "}
                    {SCORER_TIPO_LABELS[row.tipo] ?? row.tipo}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Nessun marcatore registrato.</p>
          )}
        </Card>

        <Card>
          <CardTitle>Assist</CardTitle>
          {assistRows.length > 0 ? (
            <ul className="space-y-2">
              {assistRows.map((row, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-ardor-black px-3 py-2 text-sm"
                >
                  <span className="text-white">{playerName(row.players)}</span>
                  <span className="text-gray-400">{row.minuto != null ? `${row.minuto}'` : "—"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Nessun assist registrato.</p>
          )}
        </Card>
      </div>

      <Card className="mt-6">
        <CardTitle>Formazione</CardTitle>
        {lineupRows.length > 0 ? (
          <div className="space-y-4">
            {[
              { key: "titolare", rows: titolari },
              { key: "subentrato", rows: subentrati },
              { key: "convocato", rows: convocati },
            ].map(({ key, rows }) =>
              rows.length > 0 ? (
                <div key={key}>
                  <p className="mb-2 text-xs font-semibold uppercase text-gray-500">
                    {LINEUP_STATUS_LABELS[key]}
                  </p>
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {rows.map((row, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between rounded-lg bg-ardor-black px-3 py-2 text-sm"
                      >
                        <span className="text-white">{playerName(row.players)}</span>
                        <span className="text-xs text-gray-500">
                          {row.posizione && <span className="mr-2">{row.posizione}</span>}
                          {row.minuto_in != null && <span>in {row.minuto_in}&apos;</span>}
                          {row.minuto_out != null && <span> · out {row.minuto_out}&apos;</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Formazione non disponibile per questa partita.</p>
        )}
      </Card>

      <Card className="mt-6">
        <CardTitle>Cartellini</CardTitle>
        {cardRows.length > 0 ? (
          <ul className="space-y-2">
            {cardRows.map((row, i) => (
              <li
                key={i}
                className="flex items-center justify-between rounded-lg bg-ardor-black px-3 py-2 text-sm"
              >
                <span className="text-white">{playerName(row.players)}</span>
                <span
                  className={`text-xs font-semibold ${
                    row.tipo === "rosso" ? "text-red-400" : "text-yellow-400"
                  }`}
                >
                  {row.tipo === "rosso" ? "Rosso" : "Giallo"} {row.minuto != null ? `· ${row.minuto}'` : ""}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Nessun cartellino registrato.</p>
        )}
      </Card>
    </div>
  );
}
