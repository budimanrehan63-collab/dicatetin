"use client";

import React, { useState, useEffect } from "react";
import { Sliders, Building2, MessageSquare, Shield, Check, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

const SETTINGS_KEY = "dicatetin_system_settings_v2";

export default function AdminSystemSettingsPage() {
  const [activationMode, setActivationMode] = useState<"manual" | "auto">("manual");
  const [registrationOpen, setRegistrationOpen] = useState(true);

  // Bank Info
  const [bankName, setBankName] = useState("Bank Central Asia (BCA)");
  const [accountNumber, setAccountNumber] = useState("8831294819");
  const [accountName, setAccountName] = useState("PT DICATETIN TEKNOLOGI INDONESIA");

  // Message templates
  const [reminderTemplate, setReminderTemplate] = useState(
    "Hai {name}, hari ini belum ada catatan nih. Ketik aja pengeluaranmu di sini, misalnya: makan siang 20rb."
  );
  const [welcomeTemplate, setWelcomeTemplate] = useState(
    "Selamat akun Dicatetin kamu sudah aktif! Mulai catat keuanganmu sekarang lewat dashboard atau bot Telegram."
  );

  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.activationMode) setActivationMode(parsed.activationMode);
          if (typeof parsed.registrationOpen === "boolean") setRegistrationOpen(parsed.registrationOpen);
          if (parsed.bankName) setBankName(parsed.bankName);
          if (parsed.accountNumber) setAccountNumber(parsed.accountNumber);
          if (parsed.accountName) setAccountName(parsed.accountName);
          if (parsed.reminderTemplate) setReminderTemplate(parsed.reminderTemplate);
          if (parsed.welcomeTemplate) setWelcomeTemplate(parsed.welcomeTemplate);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      activationMode,
      registrationOpen,
      bankName,
      accountNumber,
      accountName,
      reminderTemplate,
      welcomeTemplate,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload));
    }

    setTimeout(() => {
      setSaving(false);
      alert("Pengaturan sistem berhasil disimpan secara permanen!");
    }, 400);
  };

  if (!mounted) {
    return <div className="p-8 text-center text-xs text-text-secondary">Memuat pengaturan...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading tracking-tight text-text-primary">
          Pengaturan Sistem
        </h1>
        <p className="text-xs md:text-sm text-text-secondary mt-1">
          Atur mode aktivasi akun, status pendaftaran publik, rekening transfer, dan template pesan notifikasi.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Activation Mode & Public Registration */}
        <Card className="p-6 space-y-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Sliders className="w-5 h-5 text-primary" />
            <span>Mode Pendaftaran & Aktivasi Akun</span>
          </CardTitle>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Activation mode */}
            <div className="p-4 rounded-2xl bg-background border border-border space-y-3">
              <label className="text-xs font-bold text-text-primary block">
                Mode Aktivasi Pendaftar Baru
              </label>
              <div className="space-y-2">
                <label
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors text-xs",
                    activationMode === "manual"
                      ? "border-primary bg-primary/5 text-text-primary font-semibold"
                      : "border-border bg-surface text-text-secondary"
                  )}
                >
                  <input
                    type="radio"
                    name="activationMode"
                    value="manual"
                    checked={activationMode === "manual"}
                    onChange={() => setActivationMode("manual")}
                    className="mt-0.5 accent-primary"
                  />
                  <div>
                    <div className="font-bold text-text-primary">ACC Manual oleh Admin (Default)</div>
                    <div className="text-[11px] text-text-secondary mt-0.5">
                      Pendaftar masuk ke antrian pending sampai admin memeriksa bukti dan klik ACC.
                    </div>
                  </div>
                </label>

                <label
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors text-xs",
                    activationMode === "auto"
                      ? "border-primary bg-primary/5 text-text-primary font-semibold"
                      : "border-border bg-surface text-text-secondary"
                  )}
                >
                  <input
                    type="radio"
                    name="activationMode"
                    value="auto"
                    checked={activationMode === "auto"}
                    onChange={() => setActivationMode("auto")}
                    className="mt-0.5 accent-primary"
                  />
                  <div>
                    <div className="font-bold text-text-primary">Auto-Aktif Setelah Bayar (Midtrans)</div>
                    <div className="text-[11px] text-text-secondary mt-0.5">
                      Akun langsung aktif saat notifikasi webhook Midtrans sukses diterima.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Public registration status */}
            <div className="p-4 rounded-2xl bg-background border border-border space-y-3 flex flex-col justify-between">
              <div>
                <label className="text-xs font-bold text-text-primary block mb-1">
                  Status Pendaftaran Mandiri
                </label>
                <p className="text-xs text-text-secondary">
                  Jika dimatikan, pendaftaran dari landing page akan ditutup dan hanya bisa mendaftar lewat undangan admin.
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border">
                <span className="text-xs font-semibold text-text-primary">
                  {registrationOpen ? "Pendaftaran Terbuka (Publik)" : "Pendaftaran Ditutup (Private)"}
                </span>
                <input
                  type="checkbox"
                  checked={registrationOpen}
                  onChange={(e) => setRegistrationOpen(e.target.checked)}
                  aria-label="Toggle status pendaftaran mandiri"
                  className="w-5 h-5 rounded text-primary accent-primary cursor-pointer"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* 2. Official Bank Account for Manual Transfer */}
        <Card className="p-6 space-y-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <span>Informasi Rekening Transfer Manual</span>
          </CardTitle>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Nama Bank</label>
              <Input
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Contoh: Bank Central Asia (BCA)"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Nomor Rekening</label>
              <Input
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="8831294819"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Atas Nama Rekening</label>
              <Input
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="PT DICATETIN INDONESIA"
              />
            </div>
          </div>
        </Card>

        {/* 3. Message Templates */}
        <Card className="p-6 space-y-4">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span>Template Pesan Reminder & Notifikasi</span>
          </CardTitle>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-text-secondary">
                  Template Pengingat "Belum Mencatat" (Variabel: <code>{'{name}'}</code>)
                </label>
              </div>
              <textarea
                rows={2}
                value={reminderTemplate}
                onChange={(e) => setReminderTemplate(e.target.value)}
                className="w-full p-3 rounded-xl border border-border bg-background text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary">
                Template Sambutan Akun Diaktifkan (ACC)
              </label>
              <textarea
                rows={2}
                value={welcomeTemplate}
                onChange={(e) => setWelcomeTemplate(e.target.value)}
                className="w-full p-3 rounded-xl border border-border bg-background text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </Card>

        {/* Save button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={saving} className="gap-2 font-bold px-6">
            <Save className="w-4 h-4" />
            <span>{saving ? "Menyimpan..." : "Simpan Pengaturan Sistem"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
