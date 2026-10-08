import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Signout error:", err);
  }

  const url = new URL("/login", request.url);
  const response = NextResponse.redirect(url);
  response.cookies.set("dicatetin_session", "", { path: "/", maxAge: 0 });
  response.cookies.set("dicatetin_admin_session", "", { path: "/", maxAge: 0 });
  return response;
}
