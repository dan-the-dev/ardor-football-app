import { createClient } from "@/lib/supabase/server";
import type { Season } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Risolve un season_code da season_access al corrispondente seasons.code.
 * Gestisce il formato legacy "{seasons.code}-{category}" (es. 01-2025-26-juniores).
 */
export function resolveSeasonCodeFromAccess(
  accessCode: string,
  seasons: Pick<Season, "code" | "category">[]
): string | null {
  const exact = seasons.find((s) => s.code === accessCode);
  if (exact) return exact.code;

  const bySuffix = seasons.find(
    (s) =>
      accessCode === `${s.code}-${s.category.toLowerCase()}` ||
      accessCode.startsWith(`${s.code}-`)
  );
  return bySuffix?.code ?? null;
}

/**
 * Codici seasons.code a cui l'utente corrente ha accesso.
 */
export async function getAccessibleSeasonCodes(
  supabase?: SupabaseClient
): Promise<string[]> {
  const client = supabase ?? (await createClient());
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return [];

  const [{ data: accessRows }, { data: seasons }] = await Promise.all([
    client.from("season_access").select("season_code").eq("user_id", user.id),
    client.from("seasons").select("code, category"),
  ]);

  const seasonList = (seasons ?? []) as Pick<Season, "code" | "category">[];
  const codes = new Set<string>();

  for (const row of accessRows ?? []) {
    const resolved = resolveSeasonCodeFromAccess(row.season_code as string, seasonList);
    if (resolved) codes.add(resolved);
  }

  // Fallback: season_access.user_id può puntare a staff_users.id diverso da auth.uid()
  if (codes.size === 0 && user.email) {
    const { data: staffRow } = await client
      .from("staff_users")
      .select("id")
      .eq("email", user.email)
      .maybeSingle();

    if (staffRow?.id && staffRow.id !== user.id) {
      const { data: staffAccess } = await client
        .from("season_access")
        .select("season_code")
        .eq("user_id", staffRow.id);

      for (const row of staffAccess ?? []) {
        const resolved = resolveSeasonCodeFromAccess(row.season_code as string, seasonList);
        if (resolved) codes.add(resolved);
      }
    }
  }

  return [...codes].sort((a, b) => b.localeCompare(a));
}

/**
 * Stagioni accessibili per la sidebar.
 */
export async function getAccessibleSeasons(
  supabase?: SupabaseClient
): Promise<Season[]> {
  const client = supabase ?? (await createClient());
  const codes = await getAccessibleSeasonCodes(client);
  if (codes.length === 0) return [];

  const { data: seasons } = await client.from("seasons").select("*").in("code", codes);
  const byCode = new Map((seasons ?? []).map((s) => [(s as Season).code, s as Season]));

  return codes
    .map((code) => byCode.get(code))
    .filter((s): s is Season => s != null);
}

/**
 * Risolve la stagione selezionata dal query param o default (più recente accessibile).
 */
export async function resolveSeason(
  searchParams: Record<string, string | string[] | undefined>,
  supabase?: SupabaseClient
): Promise<string | null> {
  const client = supabase ?? (await createClient());
  const accessible = await getAccessibleSeasonCodes(client);

  const fromParam = searchParams.season;
  if (typeof fromParam === "string" && fromParam.length > 0) {
    if (accessible.includes(fromParam)) {
      return fromParam;
    }
  }

  return accessible[0] ?? null;
}

/**
 * Metadati stagione per un seasons.code.
 */
export async function getSeasonMetadata(
  seasonCode: string,
  supabase?: SupabaseClient
): Promise<Season | null> {
  const client = supabase ?? (await createClient());
  const { data } = await client
    .from("seasons")
    .select("*")
    .eq("code", seasonCode)
    .maybeSingle();

  return (data as Season | null) ?? null;
}
