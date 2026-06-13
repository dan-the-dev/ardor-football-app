import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getProjectRef(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
  return new URL(url).hostname.split(".")[0];
}

/**
 * Client Supabase per Server Components, Server Actions e Route Handlers.
 * Legge/scrive i cookie di sessione tramite next/headers.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const projectRef = getProjectRef();
  const authCookiePrefix = `sb-${projectRef}-auth-token`;

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // Evita conflitti se nel browser restano cookie di altri progetti Supabase.
          return cookieStore
            .getAll()
            .filter((c) => c.name === authCookiePrefix || c.name.startsWith(`${authCookiePrefix}.`));
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll può essere chiamato da un Server Component: ignorabile
            // se c'è un middleware che mantiene aggiornata la sessione.
          }
        },
      },
    }
  );
}
