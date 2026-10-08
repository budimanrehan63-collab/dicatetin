import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const secret = req.nextUrl.searchParams.get("secret");
    const configuredSecret = process.env.CRON_SECRET || "dicatetin_cron_secret_token_12345";

    if (secret !== configuredSecret && authHeader !== `Bearer ${configuredSecret}`) {
      return NextResponse.json({ error: "Unauthorized cron caller" }, { status: 401 });
    }

    const supabase = createAdminClient();
    const nowISO = new Date().toISOString();

    const { data: expiredSubs } = await supabase
      .from("subscriptions")
      .select("id, user_id, end_at")
      .eq("status", "active")
      .lt("end_at", nowISO);

    let expiredCount = 0;
    if (expiredSubs && expiredSubs.length > 0) {
      for (const sub of expiredSubs) {
        await supabase.from("subscriptions").update({ status: "expired" }).eq("id", sub.id);
        await supabase.from("profiles").update({ status: "expired" }).eq("id", sub.user_id);
        expiredCount++;
      }
    }

    return NextResponse.json({
      success: true,
      expiredCount,
      timestamp: nowISO,
    });
  } catch (err: any) {
    console.error("Subscription cron error:", err);
    return NextResponse.json({ error: err?.message || "Cron error" }, { status: 500 });
  }
}
