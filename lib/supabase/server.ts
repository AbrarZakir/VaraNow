// Server client — createServerClient() with cookies; used in Server Actions and API routes
// @supabase/ssr 0.1.0 expects get/set/remove (not getAll/setAll); session was never persisted otherwise
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown> = {}) {
          try {
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2]);
          } catch {
            // Called from a Server Component — cookie writes are ignored, sessions still work
          }
        },
        remove(name: string, options: Record<string, unknown> = {}) {
          try {
            cookieStore.set(name, "", { ...options, maxAge: 0 } as Parameters<typeof cookieStore.set>[2]);
          } catch {
            // Called from a Server Component — cookie writes are ignored, sessions still work
          }
        },
      },
    }
  );
}
