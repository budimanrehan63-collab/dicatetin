"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Wallet,
  Bell,
  Bot,
  ArrowRight,
  CheckCircle2,
  Banknote,
  Send,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatIDR } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";

export default function UserOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1: Wallet
  const [walletName, setWalletName] = useState("Dompet Tunai");
  const [initialBalance, setInitialBalance] = useState(500000);

  // Step 2: Reminder
  const [reminderTime, setReminderTime] = useState("20:00");

  // Step 3: Telegram (Pro)
  const isPro = true;

  const handleFinish = () => {
    alert("Onboarding selesai! Selamat datang di Dicatetin.");
    router.push("/app");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6">
      <Card className="max-w-lg w-full p-6 md:p-8 space-y-6 shadow-2xl border-border">
        {/* Progress indicator */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2 font-heading font-bold text-sm text-text-primary">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>Setup Awal Akun ({step}/3)</span>
          </div>

          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "w-6 h-1.5 rounded-full transition-all",
                  step === s
                    ? "bg-primary w-8"
                    : step > s
                    ? "bg-income"
                    : "bg-border"
                )}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: WALLET */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold font-heading text-text-primary">
                1. Buat Wallet Pertama Anda
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Tentukan nama dompet atau rekening utama dan saldo awal Anda saat ini.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">
                  Nama Dompet / Rekening
                </label>
                <Input
                  value={walletName}
                  onChange={(e) => setWalletName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">
                  Saldo Awal Saat Ini (IDR)
                </label>
                <Input
                  type="number"
                  min={0}
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(Number(e.target.value))}
                />
                <div className="text-xs text-primary font-bold pt-1">
                  Saldo: {formatIDR(initialBalance)}
                </div>
              </div>
            </div>

            <Button
              onClick={() => setStep(2)}
              className="w-full font-bold gap-2 mt-4"
            >
              <span>Lanjut ke Jadwal Pengingat</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* STEP 2: REMINDER */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <h2 className="text-xl font-bold font-heading text-text-primary">
                2. Pilih Jam Pengingat Harian
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Dicatetin akan mengingatkan Anda hanya jika belum ada transaksi yang tercatat hari itu.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">
                  Waktu Pengingat Utama (WIB)
                </label>
                <Input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="h-12 text-center text-lg font-bold"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-surface border border-border text-xs text-text-secondary">
                Pengingat akan dikirimkan pada pukul <strong>{reminderTime} WIB</strong> lewat notifikasi in-app dan email.
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Kembali
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1 font-bold gap-2">
                <span>Lanjut</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: TELEGRAM CONNECTION (PRO) */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-heading text-text-primary">
                  3. Hubungkan Bot Telegram
                </h2>
                <Badge variant="gold">PRO</Badge>
              </div>
              <p className="text-xs text-text-secondary mt-1">
                Catat pengeluaran cukup dengan mengirim chat, voice note, atau foto struk ke bot Telegram kami.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <Bot className="w-4 h-4" />
                <span>Kode Tautan 6 Digit Anda:</span>
              </div>
              <div className="p-3 rounded-xl bg-background border border-border text-center font-heading font-extrabold text-2xl tracking-widest text-text-primary">
                849 201
              </div>
              <p className="text-[11px] text-text-secondary text-center">
                Berlaku 10 menit. Buka bot @DicatetinBot di Telegram lalu kirim <code>/start 849201</code>.
              </p>
            </div>

            <Button
              onClick={handleFinish}
              className="w-full font-bold gap-2 mt-4"
            >
              <span>Selesai & Masuk ke Beranda</span>
              <CheckCircle2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
