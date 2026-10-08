"use client";

import React, { useState } from "react";
import {
  User,
  Lock,
  Tag,
  Bell,
  Palette,
  CreditCard,
  Sparkles,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { formatIDR } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";

export default function UserSettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "profil" | "password" | "kategori" | "reminder" | "langganan"
  >("profil");

  // Profil Form State
  const [fullName, setFullName] = useState("Fauzy Pratama");
  const [email] = useState("fauzy@example.com");
  const [phoneWa, setPhoneWa] = useState("081298765432");

  // Password State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Custom Categories State
  const [customCategories, setCustomCategories] = useState([
    { id: "c-1", name: "Langganan SaaS", type: "expense", icon: "💻" },
    { id: "c-2", name: "Investasi Saham & Reksadana", type: "expense", icon: "📈" },
  ]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState<"expense" | "income">("expense");

  // Reminder State
  const [reminder1, setReminder1] = useState("12:30");
  const [reminder2, setReminder2] = useState("20:00");
  const [enableSummary, setEnableSummary] = useState(true);

  const [saving, setSaving] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Profil berhasil diperbarui!");
    }, 500);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;
    setCustomCategories([
      ...customCategories,
      {
        id: `c-${Date.now()}`,
        name: newCategoryName,
        type: newCategoryType,
        icon: "🏷️",
      },
    ]);
    setNewCategoryName("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading tracking-tight text-text-primary">
          Pengaturan Akun & Preferensi
        </h1>
        <p className="text-xs md:text-sm text-text-secondary mt-1">
          Kelola data diri, keamanan password, kategori kustom, dan jadwal notifikasi reminder.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto">
        {[
          { id: "profil", label: "Profil Saya", icon: User },
          { id: "password", label: "Keamanan Password", icon: Lock },
          { id: "kategori", label: "Kategori Custom", icon: Tag },
          { id: "reminder", label: "Jadwal Reminder", icon: Bell },
          { id: "langganan", label: "Paket Langganan", icon: Sparkles },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                isActive
                  ? "bg-primary text-primary-foreground shadow-subtle"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. PROFIL TAB */}
      {activeTab === "profil" && (
        <Card className="p-6 max-w-xl space-y-4">
          <CardTitle className="text-base font-bold">Informasi Pribadi</CardTitle>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Nama Lengkap</label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Email</label>
              <Input value={email} disabled className="opacity-70 bg-surface" />
              <p className="text-[10px] text-text-secondary">Email akun tidak dapat diubah langsung.</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Nomor WhatsApp</label>
              <Input
                value={phoneWa}
                onChange={(e) => setPhoneWa(e.target.value)}
                placeholder="081234567890"
              />
            </div>

            <Button type="submit" disabled={saving} className="gap-2 font-bold">
              <Save className="w-4 h-4" />
              <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
            </Button>
          </form>
        </Card>
      )}

      {/* 2. PASSWORD TAB */}
      {activeTab === "password" && (
        <Card className="p-6 max-w-xl space-y-4">
          <CardTitle className="text-base font-bold">Ganti Password Akun</CardTitle>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newPassword !== confirmPassword) {
                alert("Konfirmasi password tidak cocok!");
                return;
              }
              alert("Password berhasil diperbarui!");
              setOldPassword("");
              setNewPassword("");
              setConfirmPassword("");
            }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Password Lama</label>
              <div className="relative">
                <Input
                  type={showOldPassword ? "text" : "password"}
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  aria-label={showOldPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute right-3 top-2.5 p-1 text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                >
                  {showOldPassword ? (
                    <EyeOff className="w-4 h-4 text-primary" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Password Baru</label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={showNewPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute right-3 top-2.5 p-1 text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4 text-primary" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Ulangi Password Baru</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute right-3 top-2.5 p-1 text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-primary" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="gap-2 font-bold">
              <Lock className="w-4 h-4" />
              <span>Perbarui Password</span>
            </Button>
          </form>
        </Card>
      )}

      {/* 3. KATEGORI TAB */}
      {activeTab === "kategori" && (
        <div className="space-y-6 max-w-2xl">
          <Card className="p-6 space-y-4">
            <CardTitle className="text-base font-bold">Tambah Kategori Kustom</CardTitle>
            <form onSubmit={handleAddCategory} className="flex gap-2 items-center">
              <Input
                placeholder="Nama kategori baru..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1"
              />
              <select
                value={newCategoryType}
                onChange={(e) => setNewCategoryType(e.target.value as any)}
                className="h-10 px-3 rounded-xl border border-border bg-background text-xs font-semibold text-text-primary"
              >
                <option value="expense">Pengeluaran</option>
                <option value="income">Pemasukan</option>
              </select>
              <Button type="submit" className="gap-1 font-bold">
                <Plus className="w-4 h-4" />
                <span>Tambah</span>
              </Button>
            </form>
          </Card>

          <Card className="p-6 space-y-3">
            <CardTitle className="text-base font-bold">Kategori Kustom Anda</CardTitle>
            <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden bg-background">
              {customCategories.map((c) => (
                <div key={c.id} className="p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-text-primary">
                    <span>{c.icon}</span>
                    <span>{c.name}</span>
                    <Badge variant={c.type === "expense" ? "destructive" : "income"}>
                      {c.type === "expense" ? "Pengeluaran" : "Pemasukan"}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setCustomCategories(customCategories.filter((item) => item.id !== c.id))
                    }
                    className="h-7 text-expense p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* 4. REMINDER TAB */}
      {activeTab === "reminder" && (
        <Card className="p-6 max-w-xl space-y-4">
          <CardTitle className="text-base font-bold">Jadwal Reminder Pencatatan (WIB)</CardTitle>
          <p className="text-xs text-text-secondary leading-relaxed">
            Reminder hanya dikirimkan bila Anda belum mencatat transaksi apa pun pada hari tersebut, sehingga tidak terasa spam.
          </p>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">
                  Jam Pengingat 1 (Siang)
                </label>
                <Input
                  type="time"
                  value={reminder1}
                  onChange={(e) => setReminder1(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">
                  Jam Pengingat 2 (Malam)
                </label>
                <Input
                  type="time"
                  value={reminder2}
                  onChange={(e) => setReminder2(e.target.value)}
                />
              </div>
            </div>

            <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background cursor-pointer text-xs font-medium">
              <input
                type="checkbox"
                checked={enableSummary}
                onChange={(e) => setEnableSummary(e.target.checked)}
                className="w-4 h-4 rounded text-primary accent-primary"
              />
              <span>Kirimkan ringkasan keuangan harian setiap jam 21.00 WIB</span>
            </label>

            <Button
              onClick={() => alert("Jadwal reminder berhasil disimpan!")}
              className="font-bold gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Jadwal</span>
            </Button>
          </div>
        </Card>
      )}

      {/* 5. LANGGANAN TAB */}
      {activeTab === "langganan" && (
        <Card className="p-6 max-w-xl space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-base font-bold">Paket Langganan Saat Ini</CardTitle>
              <p className="text-xs text-text-secondary mt-0.5">Informasi masa aktif dan status akun</p>
            </div>
            <Badge variant="gold" className="text-xs font-bold py-1 px-3">
              PRO MEMBER
            </Badge>
          </div>

          <div className="p-4 rounded-2xl bg-background border border-border space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-text-secondary">Paket:</span>
              <strong className="text-text-primary font-heading text-sm">Dicatetin Pro</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Biaya:</span>
              <strong className="text-text-primary font-heading">
                {formatIDR(
                  (typeof window !== "undefined"
                    ? JSON.parse(localStorage.getItem("dicatetin_store_plans_v2") || "[]")
                    : []
                  ).find((p: any) => p.name.toLowerCase() === "pro")?.price || 99000
                )} / bulan
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Masa Aktif Berakhir:</span>
              <strong className="text-primary font-heading font-mono text-sm">05 November 2026</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Sisa Kuota AI Bulan Ini:</span>
              <strong className="text-gold font-bold">288 / 300 aksi</strong>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => alert("Membuka formulir perpanjangan langganan Midtrans Snap...")}
              className="flex-1 font-bold"
            >
              Perpanjang Langganan (Midtrans)
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
