/**
 * Tipi TypeScript per lo schema Supabase descritto in
 * dan-the-dev-second-brain/football/CLAUDE.md (sezione "Database Schema (sync)").
 */

export type Ruolo = "portiere" | "difensore" | "centrocampista" | "attaccante";

export type Competizione = "campionato" | "coppa-lombardia";

export type FaseCoppa =
  | "girone"
  | "trentaduesimi"
  | "sedicesimi"
  | "ottavi"
  | "quarti"
  | "semifinale"
  | "finale";

export type MatchStatus = "played" | "scheduled";

export type CasaTrasferta = "casa" | "trasferta";

export type ScorerTipo = "gol" | "rigore" | "autogol";

export type LineupStatus = "titolare" | "subentrato" | "convocato";

export type CardTipo = "giallo" | "rosso";

export type ObjectiveStatus = "in corso" | "raggiunto" | "non raggiunto";

export type ExerciseCategoria =
  | "riscaldamento"
  | "possesso"
  | "tattica"
  | "fisico"
  | "calci-piazzati"
  | "partitella";

export interface Season {
  code: string;
  name: string;
  category: string;
  competition: string;
  girone: string | null;
  delegazione: string | null;
  year_start: number;
  year_end: number;
  piazzamento: string | null;
}

export interface Player {
  id: string;
  season_code: string;
  nome: string;
  cognome: string;
  anno_nascita: number;
  ruolo: Ruolo | null;
  fuoriquota: boolean;
  note: string | null;
}

export interface PlayerStats {
  player_id: string;
  season_code: string;
  presenze_allenamenti: number | null;
  totale_allenamenti: number | null;
  presenze_partite: number | null;
  minuti_giocati: number | null;
  gol: number | null;
  assist: number | null;
}

export interface PlayerAttributes {
  id: string;
  player_id: string;
  season_code: string;
  piede: string | null;
  ruolo_preferito: string | null;
  ruoli_alternativi: string | null;
  punti_forza: string | null;
  aree_crescita: string | null;
  note: string | null;
}

export interface PlayerInjury {
  id: string;
  player_id: string;
  season_code: string;
  data_inizio: string;
  data_fine: string | null;
  tipo: string;
  note: string | null;
}

export interface Session {
  id: string;
  season_code: string;
  data: string;
  durata_minuti: number;
  score_fisico: number;
  presenti_count: number;
  assenti_count: number;
  note: string | null;
}

export interface SessionExercise {
  session_id: string;
  exercise_slug: string;
  categoria: ExerciseCategoria;
  durata_minuti: number;
  score: number;
  note: string | null;
}

export interface SessionAttendance {
  session_id: string;
  player_id: string;
  presente: boolean;
}

export interface Match {
  id: string;
  season_code: string;
  data: string;
  avversario: string;
  competizione: Competizione;
  fase: FaseCoppa | null;
  casa_trasferta: CasaTrasferta;
  gol_fatti: number | null;
  gol_subiti: number | null;
  status: MatchStatus;
  note: string | null;
}

export interface MatchScorer {
  match_id: string;
  player_id: string;
  minuto: number | null;
  tipo: ScorerTipo;
}

export interface MatchAssist {
  match_id: string;
  player_id: string;
  minuto: number | null;
}

export interface MatchLineup {
  match_id: string;
  player_id: string;
  status: LineupStatus;
  minuto_in: number | null;
  minuto_out: number | null;
  posizione: string | null;
}

export interface MatchCard {
  match_id: string;
  player_id: string;
  tipo: CardTipo;
  minuto: number | null;
}

export interface Formation {
  season_code: string;
  modulo: string;
  volte_usato: number;
  vittorie: number;
  pareggi: number;
  sconfitte: number;
  gol_fatti: number;
  gol_subiti: number;
}

export interface Opponent {
  season_code: string;
  nome: string;
  gol_fatti: number;
  gol_subiti: number;
  note: string | null;
}

export interface SeasonObjective {
  season_code: string;
  obiettivo: string;
  status: ObjectiveStatus;
}

export interface Exercise {
  slug: string;
  nome: string;
  categoria: ExerciseCategoria;
  descrizione: string | null;
  score_medio: number | null;
  volte_usato: number;
  stagioni_usato: string[];
}

/**
 * Viste Supabase pre-esistenti (non generate da Claude).
 * I campi sono best-effort sulla base della descrizione in football/CLAUDE.md:
 * adattare se la definizione reale della vista differisce.
 */
export interface ExercisesByCategory {
  categoria: ExerciseCategoria;
  numero_esercizi: number;
  volte_usato_totale: number;
  score_medio: number | null;
}

export interface FormationsByCategory {
  categoria: string;
  modulo: string;
  volte_usato: number;
  vittorie: number;
  pareggi: number;
  sconfitte: number;
  gol_fatti: number;
  gol_subiti: number;
}

/** Helper: giocatore con statistiche stagione unite. */
export interface PlayerWithStats extends Player {
  player_stats?: PlayerStats | null;
}
