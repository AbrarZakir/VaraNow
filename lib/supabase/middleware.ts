// Auth middleware — refresh Supabase session; protect /dashboard/*, redirect unauthenticated to /login
// @supabase/ssr 0.1.0 expects get/set/remove so session can be read and refreshed
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const LOGIN_PATH = "/login";
const SIGNUP_PATH = "/signup";
const DASHBOARD_PATH = "/dashboard";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown> = {}) {
          response.cookies.set(name, value, options as { path?: string; maxAge?: number; domain?: string; sameSite?: "lax" | "strict" | "none"; secure?: boolean; httpOnly?: boolean });
        },
        remove(name: string, options: Record<string, unknown> = {}) {
          response.cookies.set(name, "", { ...options, maxAge: 0 } as { path?: string; maxAge?: number });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAuthRoute = path === LOGIN_PATH || path === SIGNUP_PATH;
  const isDashboardRoute = path.startsWith(DASHBOARD_PATH);

  if (isDashboardRoute && !user) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url));
  }

  return response;
}
