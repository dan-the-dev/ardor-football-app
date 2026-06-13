import { createClient } from "@/lib/supabase/server";
import type { Season } from "@/lib/types";

/**
 * Risolve la stagione selezionata: usa il query param `season` se presente,
 * altrimenti la stagione più recente disponibile (default).
 */
export async function resolveSeason(
  searchParams: Record<string, string | string[] | undefined>
): Promise<string | null> {
  const fromParam = searchParams.season;
  if (typeof fromParam === "string" && fromParam.length > 0) {
    return fromParam;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("seasons")
    .select("code")
    .order("code", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (data as Pick<Season, "code"> | null)?.code ?? null;
}
