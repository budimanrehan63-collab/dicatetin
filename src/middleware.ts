import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy-dicatetin.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "dummy_anon_key";

  // Check if session cookies are present
  const sessionCookie = request.cookies.get("dicatetin_session")?.value;
  const adminSessionCookie = request.cookies.get("dicatetin_admin_session")?.value;

  // Create SSR client to read session from cookies
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options });
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const pathname = request.nextUrl.pathname;

  // Static routes and assets pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/telegram") ||
    pathname.startsWith("/api/payments") ||
    pathname.startsWith("/api/cron") ||
    pathname.includes(".")
  ) {
    return response;
  }

  // Get current user from supabase auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdmin =
    sessionCookie === "admin" ||
    sessionCookie === "superadmin" ||
    adminSessionCookie === "admin" ||
    (user && (user.email === "fauzymnf29@gmail.com" || user.user_metadata?.role === "superadmin" || user.user_metadata?.role === "admin"));

  const isAuthenticated = !!user || !!sessionCookie || !!adminSessionCookie || isAdmin;

  // Route protection rules:
  // 1. /app/* routes require logged in user or admin
  if (pathname.startsWith("/app")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. /admin/* routes require admin
  if (pathname.startsWith("/admin")) {
    if (!isAdmin) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Prevent logged in users from /login and /daftar (unless expressly accessing)
  if ((pathname === "/login" || pathname === "/daftar") && isAuthenticated) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    if (redirectParam) {
      return NextResponse.redirect(new URL(redirectParam, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/app/:path*",
    "/admin/:path*",
    "/login",
    "/daftar",
    "/menunggu-persetujuan",
  ],
};
