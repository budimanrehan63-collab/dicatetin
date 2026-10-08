"use client";

import React, { useState } from "react";
import {
  Key,
  Bot,
  CreditCard,
  Mail,
  Zap,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  RefreshCw,
  Send,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

interface AIProvider {
  id: string;
  name: string;
  model: string;
  baseUrl?: string;
  apiKeyMasked: string;
  priority: number;
  isActive: boolean;
}

const INITIAL_PROVIDERS: AIProvider[] = [
  {
    id: "prov-1",
    name: "Google Gemini",
    model: "gemini-1.5-flash",
    baseUrl: "https://generativelanguage.googleapis.com",
    apiKeyMasked: "AIza••••••••98K2",
    priority: 1,
    isActive: true,
  },
  {
    id: "prov-2",
    name: "OpenAI",
    model: "gpt-4o-mini",
    baseUrl: "https://api.openai.com/v1",
    apiKeyMasked: "sk-p••••••••19Z3",
    priority: 2,
    isActive: true,
  },
  {
    id: "prov-3",
    name: "DeepSeek",
    model: "deepseek-chat",
    baseUrl: "https://api.deepseek.com/v1",
    apiKeyMasked: "sk-d••••••••88Q1",
    priority: 3,
    isActive: false,
  },
];

export default function AdminApiSettingsPage() {
  const [providers, setProviders] = useState<AIProvider[]>(INITIAL_PROVIDERS);
  const [aiMode, setAiMode] = useState<"failover" | "single">("failover");
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; msg: string } | null>(null);

  // Telegram settings
  const [botToken, setBotToken] = useState("7821938210:AAH-SampleToken_x1928");
  const [botUsername, setBotUsername] = useState("DicatetinBot");
  const [webhookStatus, setWebhookStatus] = useState<"active" | "inactive">("active");
  const [settingWebhook, setSettingWebhook] = useState(false);

  // Midtrans settings
  const [midtransServerKey, setMidtransServerKey] = useState("SB-Mid-server-x9128391823");
  const [midtransClientKey, setMidtransClientKey] = useState("SB-Mid-client-8819238912");
  const [isProductionMidtrans, setIsProductionMidtrans] = useState(false);

  // Resend settings
  const [resendApiKey, setResendApiKey] = useState("re_981293819238_sample");
  const [emailSender, setEmailSender] = useState("Dicatetin <notifikasi@dicatetin.id>");

  const handleTestConnection = (provId: string) => {
    setTestingId(provId);
    setTestResult(null);
    setTimeout(() => {
      setTestingId(null);
      setTestResult({
        id: provId,
        success: true,
        msg: "Koneksi berhasil! Latensi: 340ms. Model siap digunakan.",
      });
    }, 1200);
  };

  const handleSetWebhook = () => {
    setSettingWebhook(true);
    setTimeout(() => {
      setSettingWebhook(false);
      setWebhookStatus("active");
      alert("Webhook Telegram berhasil di-set ke: https://dicatetin.id/api/telegram/webhook");
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading tracking-tight text-text-primary">
          Pengaturan API & Integrasi Layanan
        </h1>
        <p className="text-xs md:text-sm text-text-secondary mt-1">
          Konfigurasi provider AI multi-failover terenkripsi, Bot Telegram, Payment Gateway, dan Email.
        </p>
      </div>

      {/* 1. AI Providers Section */}
      <Card className="p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gold/15 text-gold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">AI Multi-Provider & Failover Engine</CardTitle>
              <p className="text-xs text-text-secondary">
                Sistem otomatis mencoba provider prioritas 1; jika error/timeout &gt; 20 detik, otomatis beralih ke provider berikutnya.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary">Mode Eksekusi:</span>
            <select
              value={aiMode}
              onChange={(e) => setAiMode(e.target.value as any)}
              className="h-9 px-3 rounded-xl border border-border bg-background text-xs font-semibold text-text-primary"
            >
              <option value="failover">Failover Otomatis (Direkomendasikan)</option>
              <option value="single">Single Provider Saja</option>
            </select>
          </div>
        </div>

        {/* Provider List */}
        <div className="space-y-3">
          {providers.map((prov) => (
            <div
              key={prov.id}
              className={cn(
                "p-4 rounded-2xl border transition-all space-y-3",
                prov.isActive
                  ? "border-border bg-background"
                  : "border-border/50 bg-surface/30 opacity-60"
              )}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-surface border border-border flex items-center justify-center text-xs font-bold text-text-secondary">
                    {prov.priority}
                  </span>
                  <div>
                    <span className="font-heading font-bold text-sm text-text-primary">
                      {prov.name}
                    </span>
                    <span className="text-xs text-text-secondary ml-2">
                      ({prov.model})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={prov.isActive ? "income" : "secondary"}>
                    {prov.isActive ? "Aktif" : "Nonaktif"}
                  </Badge>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={testingId === prov.id}
                    onClick={() => handleTestConnection(prov.id)}
                    className="h-8 text-xs font-bold gap-1.5"
                  >
                    <RefreshCw
                      className={cn("w-3.5 h-3.5", testingId === prov.id && "animate-spin")}
                    />
                    <span>{testingId === prov.id ? "Mengetes..." : "Tes Koneksi"}</span>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-surface p-3 rounded-xl border border-border">
                <div>
                  <span className="text-text-secondary">API Key (Terenkripsi AES-256):</span>
                  <div className="font-mono font-bold text-text-primary mt-0.5">
                    {prov.apiKeyMasked}
                  </div>
                </div>
                <div>
                  <span className="text-text-secondary">Base URL Endpoint:</span>
                  <div className="font-mono text-text-secondary truncate mt-0.5">
                    {prov.baseUrl}
                  </div>
                </div>
              </div>

              {testResult?.id === prov.id && (
                <div className="p-3 rounded-xl bg-income/10 border border-income/20 text-income text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{testResult.msg}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* 2. Telegram Bot Configuration */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-border pb-4">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold">Bot Telegram Bersama</CardTitle>
            <p className="text-xs text-text-secondary">
              Satu bot bersama yang digunakan seluruh member Pro untuk mencatat transaksi.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              Telegram Bot Token (dari @BotFather)
            </label>
            <Input
              type="password"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              className="font-mono text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              Username Bot Telegram
            </label>
            <Input
              value={botUsername}
              onChange={(e) => setBotUsername(e.target.value)}
              className="text-xs"
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-background border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
              <span>Status Webhook:</span>
              <Badge variant="income">Aktif & Terhubung</Badge>
            </div>
            <p className="text-[11px] text-text-secondary font-mono">
              URL: https://dicatetin.id/api/telegram/webhook
            </p>
          </div>

          <Button
            onClick={handleSetWebhook}
            disabled={settingWebhook}
            className="text-xs font-bold gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{settingWebhook ? "Menghubungkan..." : "Set Ulang Webhook"}</span>
          </Button>
        </div>
      </Card>

      {/* 3. Midtrans & Resend Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Midtrans */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <CreditCard className="w-5 h-5 text-primary" />
            <CardTitle className="text-base font-bold">Midtrans Payment Gateway</CardTitle>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Server Key</label>
              <Input
                type="password"
                value={midtransServerKey}
                onChange={(e) => setMidtransServerKey(e.target.value)}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Client Key</label>
              <Input
                value={midtransClientKey}
                onChange={(e) => setMidtransClientKey(e.target.value)}
                className="font-mono text-xs"
              />
            </div>

            <label className="flex items-center gap-2.5 pt-1 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={isProductionMidtrans}
                onChange={(e) => setIsProductionMidtrans(e.target.checked)}
                className="w-4 h-4 rounded text-primary accent-primary"
              />
              <span className="font-medium text-text-primary">Mode Production (Live)</span>
            </label>
          </div>
        </Card>

        {/* Resend */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 border-b border-border pb-3">
            <Mail className="w-5 h-5 text-primary" />
            <CardTitle className="text-base font-bold">Resend Email Gateway</CardTitle>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Resend API Key</label>
              <Input
                type="password"
                value={resendApiKey}
                onChange={(e) => setResendApiKey(e.target.value)}
                className="font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Pengirim Resmi (From)</label>
              <Input
                value={emailSender}
                onChange={(e) => setEmailSender(e.target.value)}
                className="text-xs"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("Email uji coba berhasil dikirim via Resend!")}
              className="w-full text-xs font-bold gap-2 mt-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Email Percobaan</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
