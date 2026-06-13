import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Verifica accesso alla sezione Tattiche (tabella global_tactics_access).
 */
export async function hasGlobalTacticsAccess(
  supabase?: SupabaseClient
): Promise<boolean> {
  const client = supabase ?? (await createClient());
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return false;

  const { data: byAuth } = await client
    .from("global_tactics_access")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (byAuth) return true;

  if (user.email) {
    const { data: staff } = await client
      .from("staff_users")
      .select("id")
      .eq("email", user.email)
      .maybeSingle();

    if (staff?.id) {
      const { data: byStaff } = await client
        .from("global_tactics_access")
        .select("user_id")
        .eq("user_id", staff.id)
        .maybeSingle();

      if (byStaff) return true;
    }
  }

  return false;
}
