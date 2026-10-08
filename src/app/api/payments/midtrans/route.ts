import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyMidtransSignature } from "@/lib/payments/midtrans";
import { sendActivationEmail } from "@/lib/email/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = body;

    // Verify signature
    const isValidSignature = verifyMidtransSignature(
      order_id,
      status_code,
      gross_amount,
      signature_key
    );

    if (!isValidSignature && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Invalid Midtrans signature" }, { status: 403 });
    }

    const supabase = createAdminClient();

    // Check transaction status
    const isSuccess =
      transaction_status === "capture" ||
      transaction_status === "settlement";

    if (isSuccess && fraud_status !== "challenge") {
      // 1. Fetch system activation mode setting
      const { data: setting } = await supabase
        .from("app_settings")
        .select("value")
        .eq("key", "activation_mode")
        .maybeSingle();

      const activationMode = setting?.value || "manual";

      // 2. Find payment by midtrans order id
      const { data: payment } = await supabase
        .from("payments")
        .select("*, profiles(*), plans(*)")
        .eq("midtrans_order_id", order_id)
        .maybeSingle();

      if (payment) {
        // Mark payment as paid
        await supabase
          .from("payments")
          .update({
            status: "paid",
            reviewed_at: new Date().toISOString(),
          })
          .eq("id", payment.id);

        // If Auto-Activation is enabled
        if (activationMode === "auto") {
          const durationDays = payment.plans?.duration_days || 30;
          const endAt = new Date();
          endAt.setDate(endAt.getDate() + durationDays);

          // Activate profile
          await supabase
            .from("profiles")
            .update({
              status: "active",
              plan_id: payment.plan_id,
            })
            .eq("id", payment.user_id);

          // Create active subscription
          await supabase.from("subscriptions").insert({
            user_id: payment.user_id,
            plan_id: payment.plan_id,
            start_at: new Date().toISOString(),
            end_at: endAt.toISOString(),
            status: "active",
            source: "midtrans",
          });

          // Send welcome / activation email
          if (payment.profiles?.email) {
            await sendActivationEmail(
              payment.profiles.email,
              payment.profiles.full_name || "Member",
              payment.plans?.name || "Pro"
            );
          }
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (err: any) {
    console.error("Midtrans webhook error:", err);
    return NextResponse.json({ error: err?.message || "Internal server error" }, { status: 500 });
  }
}
