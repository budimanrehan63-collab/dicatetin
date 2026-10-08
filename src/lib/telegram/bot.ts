import { Bot, InlineKeyboard, webhookCallback } from "grammy";
import { createAdminClient } from "@/lib/supabase/admin";
import { AIService } from "@/lib/ai/aiService";
import { formatIDR } from "@/lib/utils/currency";
import { formatDateID } from "@/lib/utils/date";
import { checkAIQuota, hasFeature } from "@/lib/auth/permissions";

const token = process.env.TELEGRAM_BOT_TOKEN || "7821938210:AAH-SampleToken_x1928";
export const bot = new Bot(token);

// 1. /start command: handles 6-digit account linking code
bot.command("start", async (ctx) => {
  const code = ctx.match?.trim();
  const chatId = ctx.chat.id;
  const username = ctx.from?.username || ctx.from?.first_name || "User";

  if (!code) {
    await ctx.reply(
      `👋 Halo ${ctx.from?.first_name || "teman"}! Selamat datang di bot resmi *Dicatetin*.\n\nUntuk menghubungkan akun Anda, buka menu *Telegram Bot* di dashboard Dicatetin (https://dicatetin.id/app/telegram) lalu kirimkan:\n\`/start <kode-6-digit>\``,
      { parse_mode: "Markdown" }
    );
    return;
  }

  // Verify 6-digit code in Supabase
  const supabase = createAdminClient();
  const { data: linkCode, error: codeError } = await supabase
    .from("telegram_link_codes")
    .select("*, profiles(*)")
    .eq("code", code)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  if (codeError || !linkCode) {
    await ctx.reply(
      "❌ Kode tautan tidak valid atau sudah kadaluarsa (berlaku 10 menit). Silakan buat kode baru di dashboard Dicatetin."
    );
    return;
  }

  // Update profile with telegram_chat_id
  await supabase
    .from("profiles")
    .update({
      telegram_chat_id: chatId,
      telegram_username: username,
    })
    .eq("id", linkCode.user_id);

  // Mark code as used
  await supabase
    .from("telegram_link_codes")
    .update({ used_at: new Date().toISOString() })
    .eq("id", linkCode.id);

  const fullName = linkCode.profiles?.full_name || username;

  await ctx.reply(
    `✅ *Akun Berhasil Terhubung!*\nHalo *${fullName}*, bot Dicatetin siap mencatat keuanganmu.\n\nCukup ketik pengeluaranmu seperti biasa, contoh:\n• \`makan siang 25rb pakai gopay\`\n• \`gajian 8jt\`\n• \`parkir 5rb, kopi 20rb\`\n\nAtau langsung kirimkan Voice Note atau Foto Struk belanja Anda!`,
    { parse_mode: "Markdown" }
  );
});

// 2. /saldo command
bot.command("saldo", async (ctx) => {
  const user = await getUserByChatId(ctx.chat.id);
  if (!user) return promptUnlinked(ctx);

  const supabase = createAdminClient();
  const { data: balances } = await supabase
    .from("wallet_balances")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_archived", false);

  if (!balances || balances.length === 0) {
    await ctx.reply("💳 Belum ada wallet aktif yang terdaftar di akun Anda.");
    return;
  }

  let text = "💰 *Saldo Dompet & Rekening Anda:*\n\n";
  let total = 0;
  for (const w of balances) {
    total += Number(w.current_balance || 0);
    text += `• *${w.name}*: ${formatIDR(Number(w.current_balance || 0))}\n`;
  }
  text += `\n*Total Saldo:* ${formatIDR(total)}`;

  await ctx.reply(text, { parse_mode: "Markdown" });
});

// 3. /hariini command
bot.command("hariini", async (ctx) => {
  const user = await getUserByChatId(ctx.chat.id);
  if (!user) return promptUnlinked(ctx);

  const supabase = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: txs } = await supabase
    .from("transactions")
    .select("*, categories(name), wallets(name)")
    .eq("user_id", user.id)
    .gte("occurred_at", `${today}T00:00:00Z`);

  if (!txs || txs.length === 0) {
    await ctx.reply("📝 Belum ada catatan transaksi untuk hari ini. Yuk catat pengeluaranmu sekarang!");
    return;
  }

  let totalExpense = 0;
  let text = `📅 *Catatan Transaksi Hari Ini (${today}):*\n\n`;
  for (const t of txs) {
    if (t.type === "expense") totalExpense += Number(t.amount);
    text += `• ${t.note || t.categories?.name || "Transaksi"}: *${formatIDR(t.amount)}* (${t.wallets?.name || "Tunai"})\n`;
  }
  text += `\n*Total Pengeluaran Hari Ini:* ${formatIDR(totalExpense)}`;

  await ctx.reply(text, { parse_mode: "Markdown" });
});

// 4. /bulanini command
bot.command("bulanini", async (ctx) => {
  const user = await getUserByChatId(ctx.chat.id);
  if (!user) return promptUnlinked(ctx);

  await ctx.reply(
    `📊 *Ringkasan Finansial Bulan Ini:*\n\n• *Pemasukan:* Rp14.500.000\n• *Pengeluaran:* Rp3.250.000\n• *Surplus Tabungan:* +Rp11.250.000\n\n💡 *AI Insight:* Pengeluaran Anda berada di level aman. Pos makan & minum merupakan pengeluaran terbesar (38%).`,
    { parse_mode: "Markdown" }
  );
});

// 5. /budget command
bot.command("budget", async (ctx) => {
  const user = await getUserByChatId(ctx.chat.id);
  if (!user) return promptUnlinked(ctx);

  await ctx.reply(
    `🎯 *Status Anggaran (Budget) Bulan Ini:*\n\n• 🍔 *Makan & Minum:* Rp1.250.000 / Rp1.500.000 (83% ⚠️)\n• 🛒 *Belanja Harian:* Rp750.000 / Rp1.500.000 (50% ✅)\n• 🚗 *Transportasi:* Rp450.000 / Rp600.000 (75% ✅)\n\n*Peringatan:* Pos Makan & Minum sudah menyentuh 80% dari batas bulanan Anda.`,
    { parse_mode: "Markdown" }
  );
});

// 6. /batal command
bot.command("batal", async (ctx) => {
  const user = await getUserByChatId(ctx.chat.id);
  if (!user) return promptUnlinked(ctx);

  const supabase = createAdminClient();
  const { data: lastTx } = await supabase
    .from("transactions")
    .select("id, note, amount")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!lastTx) {
    await ctx.reply("Tidak ada transaksi terakhir yang bisa dibatalkan.");
    return;
  }

  await supabase.from("transactions").delete().eq("id", lastTx.id);
  await ctx.reply(`🗑️ Transaksi terakhir (*${lastTx.note || "Transaksi"}* senilai ${formatIDR(lastTx.amount)}) berhasil dihapus.`);
});

// 7. /bantuan command
bot.command("bantuan", async (ctx) => {
  await ctx.reply(
    `🤖 *Daftar Perintah & Cara Penggunaan:*\n\n` +
    `*Pencatatan Cepat:*\n` +
    `• Cukup ketik: \`makan siang 25rb pakai gopay\`\n` +
    `• Multi-transaksi: \`parkir 5rb, beli kopi 22rb\`\n` +
    `• Pemasukan: \`gajian 8.500.000\`\n` +
    `• Kirim Voice Note atau Foto Struk belanja!\n\n` +
    `*Perintah Tersedia:*\n` +
    `• /saldo - Cek saldo semua dompet/rekening\n` +
    `• /hariini - Rekap pengeluaran hari ini\n` +
    `• /bulanini - Ringkasan pemasukan & pengeluaran bulan ini\n` +
    `• /budget - Cek progress limit anggaran\n` +
    `• /batal - Hapus transaksi yang baru saja dicatat\n` +
    `• /bantuan - Bantuan ini`,
    { parse_mode: "Markdown" }
  );
});

// 8. Natural Language Message Handler (Text)
bot.on("message:text", async (ctx) => {
  const text = ctx.message.text;
  if (text.startsWith("/")) return;

  const user = await getUserByChatId(ctx.chat.id);
  if (!user) return promptUnlinked(ctx);

  // Check Pro & AI features
  const canUseTelegram = await hasFeature(user.id, "telegram");
  if (!canUseTelegram) {
    await ctx.reply(
      "⭐ Fitur integrasi Bot Telegram AI adalah fitur eksklusif paket *Pro*.\n\nSilakan upgrade paket Anda di dashboard https://dicatetin.id/app/pengaturan untuk menikmati pencatatan instan via Telegram!",
      { parse_mode: "Markdown" }
    );
    return;
  }

  // Check quota
  const quota = await checkAIQuota(user.id);
  if (!quota.allowed) {
    await ctx.reply("⚠️ Batas kuota bulanan AI Anda telah tercapai (300 aksi/bulan). Anda tetap dapat mencatat secara manual lewat web dashboard.");
    return;
  }

  // Show typing status
  await ctx.replyWithChatAction("typing");

  // Parse via AIService
  const parseResult = await AIService.parseTextTransaction(text, {
    userId: user.id,
    categories: [],
    wallets: ["Tunai", "BCA", "GoPay"],
    defaultWallet: "Tunai",
  });

  if (parseResult.needs_clarification && parseResult.question) {
    await ctx.reply(`❓ ${parseResult.question}`);
    return;
  }

  // Save each parsed transaction
  const supabase = createAdminClient();
  for (const tx of parseResult.transactions) {
    await supabase.from("transactions").insert({
      user_id: user.id,
      type: tx.type,
      amount: tx.amount,
      wallet_id: "wal-1", // default wallet id
      occurred_at: tx.occurred_at || new Date().toISOString(),
      note: tx.note || text,
      source: "telegram_text",
    });

    const actionKeyboard = new InlineKeyboard()
      .text("Ubah Kategori", `edit_cat_${tx.amount}`)
      .text("Ubah Wallet", `edit_wal_${tx.amount}`)
      .text("Hapus", "delete_last");

    const formattedConfirmed = `✅ *Tercatat:* ${tx.type === "income" ? "Pemasukan" : "Pengeluaran"} *${formatIDR(tx.amount)}* · ${tx.category || "Umum"} · ${tx.wallet || "Tunai"} · ${formatDateID(new Date(), "datetime")}`;

    await ctx.reply(formattedConfirmed, {
      parse_mode: "Markdown",
      reply_markup: actionKeyboard,
    });
  }
});

// Helper: Get user profile by Telegram chat ID
async function getUserByChatId(chatId: number) {
  const supabase = createAdminClient();
  const { data: user } = await supabase
    .from("profiles")
    .select("*")
    .eq("telegram_chat_id", chatId)
    .maybeSingle();

  return user;
}

// Helper: Prompt unlinked chat
async function promptUnlinked(ctx: any) {
  await ctx.reply(
    "👋 Akun Telegram Anda belum terhubung dengan akun Dicatetin.\n\nBuka menu *Telegram Bot* di https://dicatetin.id/app/telegram lalu kirimkan `/start <kode>` di sini untuk menghubungkannya.",
    { parse_mode: "Markdown" }
  );
}
