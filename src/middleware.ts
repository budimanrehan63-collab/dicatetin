import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Static routes, assets, favicon, API routes, and all internal Next.js RSC requests pass through
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. Identify RSC client-side navigation requests
  // NEVER redirect RSC internal requests because doing so breaks client SPA state and forces a hard logout
  const isRscRequest =
    request.headers.get("RSC") === "1" ||
    request.headers.has("next-router-state-tree") ||
    request.headers.has("next-router-prefetch") ||
    request.headers.get("accept")?.includes("text/x-component");

  if (isRscRequest) {
    return NextResponse.next();
  }

  // 3. Read session cookies directly
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

  // 4. Admin Dashboard routes (/admin and /admin/*)
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (!isAdmin && !hasAnyAuth) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 5. User Dashboard routes (/app and /app/*)
  // Only redirect on fresh direct browser address-bar access if absolutely no auth cookie is found
  if (pathname === "/app" || pathname.startsWith("/app/")) {
    if (!hasAnyAuth) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 6. Auth pages (/login, /daftar) - if already authenticated, redirect to app/admin
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
    "/app",
    "/app/:path*",
    "/admin",
    "/admin/:path*",
    "/login",
    "/daftar",
    "/menunggu-persetujuan",
  ],
};
