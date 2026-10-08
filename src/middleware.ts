import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Static routes, assets, favicon, and all API endpoints pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. Read session cookies directly (0ms latency, zero external API dependencies)
  const sessionCookie = request.cookies.get("dicatetin_session")?.value;
  const adminSessionCookie = request.cookies.get("dicatetin_admin_session")?.value;

  const isAdmin =
    sessionCookie === "admin" ||
    sessionCookie === "superadmin" ||
    adminSessionCookie === "admin";

  const isAuthenticated =
    isAdmin ||
    sessionCookie === "user" ||
    sessionCookie === "active" ||
    sessionCookie === "pending" ||
    !!sessionCookie;

  // 3. User Dashboard routes (/app/*)
  // Accessible by all logged in users AND admins
  if (pathname.startsWith("/app")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 4. Admin Dashboard routes (/admin/*)
  // Strictly requires admin privileges
  if (pathname.startsWith("/admin")) {
    if (!isAdmin) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 5. Auth pages (/login, /daftar)
  if ((pathname === "/login" || pathname === "/daftar") && isAuthenticated) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    if (redirectParam && redirectParam !== "/login" && redirectParam !== "/daftar") {
      return NextResponse.redirect(new URL(redirectParam, request.url));
    }
  }

  return NextResponse.next();
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
