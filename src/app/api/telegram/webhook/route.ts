import { NextRequest, NextResponse } from "next/server";
import { bot } from "@/lib/telegram/bot";
import { webhookCallback } from "grammy";

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-telegram-bot-api-secret-token");
    const configuredSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

    // Verify secret token if configured
    if (configuredSecret && secret !== configuredSecret) {
      return NextResponse.json({ error: "Unauthorized webhook caller" }, { status: 401 });
    }

    const handler = webhookCallback(bot, "std/http");
    return await handler(req as any);
  } catch (err: any) {
    console.error("Telegram webhook processing error:", err);
    return NextResponse.json({ error: err?.message || "Webhook error" }, { status: 500 });
  }
}
