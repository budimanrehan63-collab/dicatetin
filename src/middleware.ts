import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Static routes, assets, favicon, API routes pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. Read session cookies
  const allCookies = request.cookies.getAll();
  const sessionCookie = request.cookies.get("dicatetin_session")?.value;
  const adminSessionCookie = request.cookies.get("dicatetin_admin_session")?.value;

  const isAdmin =
    sessionCookie === "admin" ||
    sessionCookie === "superadmin" ||
    adminSessionCookie === "admin";

  const hasAnyAuth =
    isAdmin ||
    sessionCookie === "user" ||
    sessionCookie === "active" ||
    sessionCookie === "pending" ||
    !!sessionCookie ||
    allCookies.some(
      (c) =>
        c.name.startsWith("sb-") ||
        c.name.includes("auth") ||
        c.name.includes("session") ||
        c.name.includes("token")
    );

  // 3. Admin Dashboard routes (/admin and /admin/*) - strictly require admin
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!isAdmin && !hasAnyAuth) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 4. Auth pages (/login, /daftar) - if already authenticated, redirect to /admin or /app
  if ((pathname === "/login" || pathname === "/daftar") && hasAnyAuth) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    if (redirectParam && redirectParam !== "/login" && redirectParam !== "/daftar") {
      return NextResponse.redirect(new URL(redirectParam, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/login",
    "/daftar",
    "/menunggu-persetujuan",
  ],
};
