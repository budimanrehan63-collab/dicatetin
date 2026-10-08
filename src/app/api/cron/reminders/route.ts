import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { bot } from "@/lib/telegram/bot";
import { sendReminderEmail } from "@/lib/email/resend";

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
    const today = new Date().toISOString().split("T")[0];

    const now = new Date();
    const wibHours = String(now.getUTCHours() + 7).padStart(2, "0");
    const wibMinutes = String(now.getUTCMinutes()).padStart(2, "0");
    const currentWibTime = `${wibHours}:${wibMinutes}`;

    const { data: activeUsers, error } = await supabase
      .from("profiles")
      .select("id, full_name, role, status, telegram_chat_id, plan_id, reminder_settings(*)")
      .eq("status", "active");

    if (error || !activeUsers) {
      return NextResponse.json({ success: true, processed: 0, message: "No active users" });
    }

    let sentCount = 0;

    for (const user of activeUsers) {
      const { count: txCount } = await supabase
        .from("transactions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("occurred_at", `${today}T00:00:00Z`);

      if (txCount && txCount > 0) {
        continue;
      }

      const isProWithTelegram = user.telegram_chat_id;

      if (isProWithTelegram) {
        try {
          await bot.api.sendMessage(
            user.telegram_chat_id,
            `Hai *${user.full_name}*, hari ini belum ada catatan nih. Ketik aja pengeluaranmu di sini, misalnya: \`makan siang 20rb\`.`,
            { parse_mode: "Markdown" }
          );
          sentCount++;
        } catch (e) {
          console.error(`Failed to send telegram reminder to user ${user.id}:`, e);
        }
      }

      await supabase.from("notifications").insert({
        user_id: user.id,
        type: "reminder_daily",
        title: "Yuk catat keuangan hari ini!",
        body: "Belum ada transaksi yang kamu catat hari ini. Luangkan waktu 10 detik agar pembukuanmu tetap rapi.",
        sent_via: isProWithTelegram ? "telegram" : "in_app",
      });
    }

    return NextResponse.json({
      success: true,
      sentCount,
      timestamp: new Date().toISOString(),
      wibTime: currentWibTime,
    });
  } catch (err: any) {
    console.error("Cron reminder error:", err);
    return NextResponse.json({ error: err?.message || "Cron error" }, { status: 500 });
  }
}
