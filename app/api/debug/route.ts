import { createClient } from "@/lib/supabase/server";
import { getAccessibleSeasonCodes } from "@/lib/season";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Route di debug temporanea per diagnosticare auth + RLS lato server.
 * GET /api/debug  (richiede login)
 */
export async function GET() {
  const cookieStore = await cookies();
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  const accessibleCodes = await getAccessibleSeasonCodes(supabase);

  const { data: staffUser } = user?.email
    ? await supabase.from("staff_users").select("id, email").eq("email", user.email).maybeSingle()
    : { data: null };

  const { data: seasonAccessByAuth, error: seasonAccessAuthError } = user
    ? await supabase.from("season_access").select("*").eq("user_id", user.id)
    : { data: [], error: null };

  const { data: seasonAccessByStaff, error: seasonAccessStaffError } = staffUser
    ? await supabase.from("season_access").select("*").eq("user_id", staffUser.id)
    : { data: [], error: null };

  const { data: players, error: playersError } = await supabase
    .from("players")
    .select("id, season_code, cognome")
    .limit(5);

  const { data: seasons, error: seasonsError } = await supabase
    .from("seasons")
    .select("code, name, category");

  const primarySeasonCode = accessibleCodes[0] ?? seasons?.[0]?.code ?? null;

  const { data: playersForSeason, error: playersSeasonError } = primarySeasonCode
    ? await supabase
        .from("players")
        .select("id, season_code, cognome")
        .eq("season_code", primarySeasonCode)
        .limit(5)
    : { data: [], error: null };

  const authCookieNames = cookieStore
    .getAll()
    .map((c) => c.name)
    .filter((n) => n.startsWith("sb-"));

  const authIdMatchesStaffId = user?.id === staffUser?.id;
  const seasonCodesFromAccess = [
    ...(seasonAccessByAuth ?? []),
    ...(seasonAccessByStaff ?? []),
  ].map((s) => s.season_code);
  const seasonCodesFromSeasons = (seasons ?? []).map((s) => s.code);

  const staleProjectCookies = cookieStore
    .getAll()
    .map((c) => c.name)
    .filter((n) => n.startsWith("sb-") && !n.startsWith(`sb-${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!).hostname.split(".")[0]}-`));

  const debug = {
    timestamp: new Date().toISOString(),
    context: "server (Route Handler)",
    cookies: {
      supabaseCookieNames: authCookieNames,
      count: authCookieNames.length,
      stale_other_project_cookies: staleProjectCookies,
    },
    auth: {
      getUser: {
        user: user ? { id: user.id, email: user.email } : null,
        error: userError?.message ?? null,
      },
      getSession: {
        hasSession: !!session,
        userId: session?.user?.id ?? null,
        expiresAt: session?.expires_at ?? null,
        error: sessionError?.message ?? null,
      },
      staff_users: staffUser,
      auth_id_matches_staff_id: authIdMatchesStaffId,
    },
    seasonCodes: {
      from_seasons_table: seasonCodesFromSeasons,
      from_season_access_raw: [...new Set(seasonCodesFromAccess)],
      resolved_for_queries: accessibleCodes,
      primary_season_used: primarySeasonCode,
      diagnosis:
        !user
          ? "Utente non autenticato."
          : accessibleCodes.length === 0
            ? "Nessuna stagione risolta: controlla season_access (user_id e season_code)."
            : (players?.length ?? 0) === 0
              ? "RLS blocca players: verifica che season_access.season_code = seasons.code (es. 01-2025-26)."
              : "OK — dati accessibili.",
    },
    queries: {
      players_unfiltered: {
        count: players?.length ?? 0,
        sample: players ?? [],
        error: playersError?.message ?? null,
      },
      players_for_resolved_season: {
        season_code: primarySeasonCode,
        count: playersForSeason?.length ?? 0,
        sample: playersForSeason ?? [],
        error: playersSeasonError?.message ?? null,
      },
      season_access_by_auth_uid: {
        count: seasonAccessByAuth?.length ?? 0,
        rows: seasonAccessByAuth ?? [],
        error: seasonAccessAuthError?.message ?? null,
      },
      season_access_by_staff_id: {
        count: seasonAccessByStaff?.length ?? 0,
        rows: seasonAccessByStaff ?? [],
        error: seasonAccessStaffError?.message ?? null,
      },
      seasons: {
        count: seasons?.length ?? 0,
        rows: seasons ?? [],
        error: seasonsError?.message ?? null,
      },
    },
  };

  console.log("[/api/debug]", JSON.stringify(debug, null, 2));

  return NextResponse.json(debug);
}
