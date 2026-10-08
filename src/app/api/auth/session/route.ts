import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({ role: "admin" }));
    const { role = "admin" } = body;

    const response = NextResponse.json({ success: true, role });

    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax" as const,
      secure: isProd,
    };

    if (role === "admin" || role === "superadmin") {
      response.cookies.set("dicatetin_session", "admin", cookieOptions);
      response.cookies.set("dicatetin_admin_session", "admin", cookieOptions);
    } else {
      response.cookies.set("dicatetin_session", role, cookieOptions);
    }

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to set session" },
      { status: 500 }
    );
  }
}
