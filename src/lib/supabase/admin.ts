import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "../env";

let client: SupabaseClient | null = null;

/**
 * Cliente con service role: salta RLS. Solo se usa en el servidor.
 * Las tablas tienen RLS activado sin políticas públicas, así que nadie
 * puede leerlas con la llave anónima.
 */
export function db(): SupabaseClient {
  if (!client) {
    client = createClient(env.supabaseUrl(), env.supabaseServiceKey(), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
