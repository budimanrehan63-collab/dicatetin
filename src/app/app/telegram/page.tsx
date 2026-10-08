"use client";

import React, { useState } from "react";
import {
  Send,
  Bot,
  Sparkles,
  CheckCircle2,
  Unlink,
  ExternalLink,
  Copy,
  Clock,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

export default function UserTelegramPage() {
  const isPro = true; // In real app, from user.plan_name === 'Pro'

  const [connected, setConnected] = useState(true);
  const [telegramUsername, setTelegramUsername] = useState("fauzy_dev");
  const [linkingCode, setLinkingCode] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerateCode = () => {
    setGenerating(true);
    setTimeout(() => {
      // 6-digit random code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setLinkingCode(code);
      setGenerating(false);
    }, 600);
  };

  const handleDisconnect = () => {
    if (confirm("Apakah Anda yakin ingin memutuskan sambungan bot Telegram?")) {
      setConnected(false);
      setTelegramUsername("");
      setLinkingCode(null);
    }
  };

  if (!isPro) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-gold/15 text-gold flex items-center justify-center mx-auto shadow-subtle">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-heading text-text-primary">
            Integrasi Bot Telegram Khusus Member Pro
          </h2>
          <p className="text-xs md:text-sm text-text-secondary max-w-md mx-auto mt-2">
            Catat pengeluaran semudah kirim chat, voice note, atau foto struk langsung ke bot Telegram kami.
          </p>
        </div>

        <Button asChild size="lg" variant="gold" className="gap-2 font-bold">
          <a href="/app/pengaturan">
            <Sparkles className="w-5 h-5" />
            <span>Upgrade ke Paket Pro (Rp99rb/bln)</span>
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold font-heading tracking-tight text-text-primary">
            Integrasi Bot Telegram AI
          </h1>
          <Badge variant="gold">PRO FITUR</Badge>
        </div>
        <p className="text-xs md:text-sm text-text-secondary mt-1">
          Hubungkan akun Telegram Anda untuk mencatat pemasukan & pengeluaran secepat mengirim pesan obrolan.
        </p>
      </div>

      {connected ? (
        /* Connected State */
        <Card className="p-6 space-y-5 border-income/30 bg-income/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-income/20 text-income flex items-center justify-center shadow-subtle">
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-bold text-base text-text-primary">
                    Akun Telegram Terhubung
                  </h3>
                  <Badge variant="income">AKTIF</Badge>
                </div>
                <p className="text-xs text-text-secondary font-mono mt-0.5">
                  @{telegramUsername}
                </p>
              </div>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={handleDisconnect}
              className="text-xs font-bold gap-1.5 self-start sm:self-auto"
            >
              <Unlink className="w-3.5 h-3.5" />
              <span>Putuskan Hubungan</span>
            </Button>
          </div>

          <div className="p-4 rounded-2xl bg-background border border-border space-y-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-text-primary">
              <Sparkles className="w-4 h-4 text-gold" />
              <span>Cara Mencatat Lewat Telegram:</span>
            </div>
            <ul className="space-y-2 text-text-secondary pl-5 list-disc">
              <li>
                <strong>Teks Cepat:</strong> Ketik <code>makan siang 25rb pakai gopay</code> atau <code>gajian 8.5jt</code>.
              </li>
              <li>
                <strong>Voice Note:</strong> Rekam suara Anda, misal: <em>"Tadi beli bensin lima puluh ribu pakai tunai"</em>.
              </li>
              <li>
                <strong>Foto Struk:</strong> Kirim foto struk belanjaan minimarket/kafe, AI akan merinci item belanjaan Anda otomatis.
              </li>
              <li>
                <strong>Cek Saldo:</strong> Kirim perintah <code>/saldo</code> atau <code>/hariini</code>.
              </li>
            </ul>
          </div>

          <div className="pt-2 flex justify-end">
            <Button asChild className="gap-2 font-bold text-xs" variant="default">
              <a
                href="https://t.me/DicatetinBot"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Buka Bot di Telegram</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Button>
          </div>
        </Card>
      ) : (
        /* Disconnected State -> Generate Code */
        <Card className="p-6 md:p-8 space-y-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-subtle">
            <Bot className="w-8 h-8" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-heading font-bold text-lg text-text-primary">
              Hubungkan Bot Telegram Anda
            </h3>
            <p className="text-xs text-text-secondary">
              Klik tombol di bawah untuk menghasilkan kode 6 digit yang berlaku selama 10 menit.
            </p>
          </div>

          {linkingCode ? (
            <div className="p-6 rounded-3xl bg-surface border border-border max-w-sm mx-auto space-y-4 animate-in fade-in">
              <div className="text-xs text-text-secondary font-medium">
                Kode Tautan 6 Digit Anda:
              </div>
              <div className="text-4xl font-extrabold font-heading tracking-widest text-primary font-mono py-2 bg-background rounded-2xl border border-border">
                {linkingCode}
              </div>
              <div className="text-[11px] text-budgetWarning flex items-center justify-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Berlaku selama 10 menit</span>
              </div>

              <div className="space-y-2 pt-2">
                <Button asChild className="w-full font-bold gap-2">
                  <a
                    href={`https://t.me/DicatetinBot?start=${linkingCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Buka Bot & Hubungkan Otomatis</span>
                  </a>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setConnected(true);
                    setTelegramUsername("fauzy_dev");
                  }}
                  className="w-full text-xs"
                >
                  Saya Sudah Kirim Kode
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleGenerateCode}
              disabled={generating}
              size="lg"
              className="gap-2 font-bold px-8 shadow-subtle"
            >
              <Sparkles className="w-4 h-4" />
              <span>{generating ? "Membuat Kode..." : "Buat Kode Tautan 6 Digit"}</span>
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
