import { NextRequest, NextResponse } from "next/server";
import { AIService } from "@/lib/ai/aiService";
import { getCurrentUser } from "@/lib/auth/session";
import { hasFeature, checkAIQuota } from "@/lib/auth/permissions";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const canScan = await hasFeature(user.id, "ai_scan");
    if (!canScan) {
      return NextResponse.json(
        { error: "Fitur Scan Struk AI hanya tersedia untuk paket Pro." },
        { status: 403 }
      );
    }

    const quota = await checkAIQuota(user.id);
    if (!quota.allowed) {
      return NextResponse.json(
        { error: "Batas kuota bulanan AI Anda telah tercapai (300 aksi/bulan)." },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("receipt") as File;

    if (!file) {
      return NextResponse.json({ error: "File struk tidak ditemukan." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const parsedResult = await AIService.parseReceipt(buffer, file.type, {
      userId: user.id,
      categories: [],
      wallets: ["Tunai", "BCA", "GoPay"],
      defaultWallet: "Tunai",
    });

    return NextResponse.json({
      success: true,
      data: parsedResult,
    });
  } catch (err: any) {
    console.error("Scan receipt error:", err);
    return NextResponse.json(
      { error: err?.message || "Gagal memproses struk belanja." },
      { status: 500 }
    );
  }
}
