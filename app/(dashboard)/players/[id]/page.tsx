import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { resolveSeason } from "@/lib/season";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardTitle, StatCard } from "@/components/ui/Card";
import AttendanceChart, { type AttendanceDatum } from "@/components/charts/AttendanceChart";
import { formatDateLong, formatDateShort } from "@/lib/format";
import type {
  Player,
  PlayerAttributes,
  PlayerInjury,
  PlayerStats,
  SessionAttendance,
} from "@/lib/types";

const ROLE_LABELS: Record<string, string> = {
  portiere: "Portiere",
  difensore: "Difensore",
  centrocampista: "Centrocampista",
  attaccante: "Attaccante",
};

export default async function PlayerDetailPage({
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

  if (!seasonCode) {
    return (
      <div>
        <PageHeader title="Giocatore" />
        <Card>
          <p className="text-sm text-gray-400">Nessuna stagione disponibile.</p>
        </Card>
      </div>
    );
  }

  const [{ data: player }, { data: stats }, { data: attributes }, { data: injuries }, { data: attendance }] =
    await Promise.all([
      supabase
        .from("players")
        .select("*")
        .eq("id", id)
        .eq("season_code", seasonCode)
        .maybeSingle(),
      supabase
        .from("player_stats")
        .select("*")
        .eq("player_id", id)
        .eq("season_code", seasonCode)
        .maybeSingle(),
      supabase
        .from("player_attributes")
        .select("*")
        .eq("player_id", id)
        .eq("season_code", seasonCode)
        .maybeSingle(),
      supabase
        .from("player_injuries")
        .select("*")
        .eq("player_id", id)
        .eq("season_code", seasonCode)
        .order("data_inizio", { ascending: false }),
      supabase
        .from("session_attendance")
        .select("presente, sessions!inner(data, season_code)")
        .eq("player_id", id)
        .eq("sessions.season_code", seasonCode)
        .order("data", { referencedTable: "sessions", ascending: true }),
    ]);

  if (!player) {
    return (
      <div>
        <PageHeader title="Giocatore" />
        <Card>
          <p className="text-sm text-gray-400">Giocatore non trovato per questa stagione.</p>
        </Card>
      </div>
    );
  }

  const p = player as Player;
  const s = stats as PlayerStats | null;
  const attr = attributes as PlayerAttributes | null;
  const inj = (injuries ?? []) as PlayerInjury[];

  const attendanceData: AttendanceDatum[] = (
    (attendance ?? []) as unknown as (SessionAttendance & { sessions: { data: string } })[]
  ).map((row) => ({
    label: formatDateShort(row.sessions.data),
    presente: row.presente ? 1 : 0,
  }));

  return (
    <div>
      <Link
        href={`/players?season=${seasonCode}`}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-ardor-orange"
      >
        <ArrowLeft size={16} /> Torna alla rosa
      </Link>

      <PageHeader
        title={`${p.nome} ${p.cognome}`}
        description={`${p.ruolo ? ROLE_LABELS[p.ruolo] : "Ruolo non specificato"} · Classe ${p.anno_nascita}${
          p.fuoriquota ? " · Fuoriquota" : ""
        }`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Presenze" value={s?.presenze_partite ?? "—"} />
        <StatCard label="Minuti giocati" value={s?.minuti_giocati ?? "—"} />
        <StatCard label="Gol" value={s?.gol ?? 0} />
        <StatCard label="Assist" value={s?.assist ?? "—"} />
      </div>

      {p.note && (
        <Card className="mt-6">
          <CardTitle>Note</CardTitle>
          <p className="text-sm text-gray-300">{p.note}</p>
        </Card>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardTitle>Attributi</CardTitle>
          {attr ? (
            <dl className="space-y-2 text-sm">
              <Row label="Piede" value={attr.piede} />
              <Row label="Ruolo preferito" value={attr.ruolo_preferito} />
              <Row label="Ruoli alternativi" value={attr.ruoli_alternativi} />
              <Row label="Punti di forza" value={attr.punti_forza} />
              <Row label="Aree di crescita" value={attr.aree_crescita} />
              <Row label="Note" value={attr.note} />
            </dl>
          ) : (
            <p className="text-sm text-gray-500">Profilo non ancora compilato.</p>
          )}
        </Card>

        <Card>
          <CardTitle>Storico infortuni</CardTitle>
          {inj.length > 0 ? (
            <ul className="space-y-2">
              {inj.map((row) => (
                <li key={row.id} className="rounded-lg bg-ardor-black px-3 py-2">
                  <p className="text-sm font-medium text-white">{row.tipo}</p>
                  <p className="text-xs text-gray-500">
                    {formatDateLong(row.data_inizio)}
                    {row.data_fine ? ` → ${formatDateLong(row.data_fine)}` : " (in corso)"}
                  </p>
                  {row.note && <p className="mt-1 text-xs text-gray-400">{row.note}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">Nessun infortunio registrato.</p>
          )}
        </Card>
      </div>

      <Card className="mt-6">
        <CardTitle>Presenze agli allenamenti</CardTitle>
        {attendanceData.length > 0 ? (
          <AttendanceChart data={attendanceData} />
        ) : (
          <p className="text-sm text-gray-500">Nessun dato di presenza disponibile.</p>
        )}
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex justify-between gap-4 border-b border-ardor-gray/50 pb-2 last:border-0 last:pb-0">
      <dt className="text-gray-400">{label}</dt>
      <dd className="text-right text-white">{value || "—"}</dd>
    </div>
  );
}
