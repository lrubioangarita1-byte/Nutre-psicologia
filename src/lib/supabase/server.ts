import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { env } from "../env";

/** Cliente de Supabase Auth con la sesión del navegador (panel de administración). */
export async function authClient() {
  const cookieStore = await cookies();
  return createServerClient(env.supabaseUrl(), env.supabaseAnonKey(), {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // En Server Components no se pueden escribir cookies; el proxy refresca la sesión.
        }
      },
    },
  });
}

export function isAdminEmail(email: string | null | undefined) {
  return Boolean(email && env.adminEmails().includes(email.toLowerCase()));
}

/** Devuelve el correo del admin autenticado o null. */
export async function currentAdmin(): Promise<string | null> {
  const supabase = await authClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email ?? null;
  return isAdminEmail(email) ? email : null;
}

/** Para páginas y acciones del panel: redirige al login si no hay admin. */
export async function requireAdmin(): Promise<string> {
  const email = await currentAdmin();
  if (!email) redirect("/admin/login");
  return email;
}
