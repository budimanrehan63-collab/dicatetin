"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MoneyText } from "@/components/common/MoneyText";
import { formatIDR } from "@/lib/utils/currency";
import { AdminStore, PlanItem, FeatureItem } from "@/lib/data/adminStore";
import {
  ArrowRight,
  Bot,
  Sparkles,
  Receipt,
  ScanLine,
  Mic,
  PieChart,
  Wallet,
  FileSpreadsheet,
  Check,
  X,
  ChevronDown,
  ShieldCheck,
  Clock,
  Flame,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Smartphone,
  Star,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [demoStep, setDemoStep] = useState(1);

  // Dynamic Plans State from AdminStore
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [allFeatures, setAllFeatures] = useState<FeatureItem[]>([]);

  useEffect(() => {
    const loadPlans = () => {
      setPlans(AdminStore.getPlans().filter((p) => p.isActive));
      setAllFeatures(AdminStore.getFeatures());
    };
    loadPlans();
    window.addEventListener("dicatetin_store_updated", loadPlans);
    return () => window.removeEventListener("dicatetin_store_updated", loadPlans);
  }, []);

  // Interactive preview state for demo
  const [dummyBalance, setDummyBalance] = useState(14850000);
  const [dummyExpense, setDummyExpense] = useState(3250000);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const handleSimulateChat = () => {
    setDummyExpense((prev) => prev + 25000);
    setDummyBalance((prev) => prev - 25000);
  };

  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-primary/20 selection:text-primary">
      <LandingNavbar />

      {/* 1. ATTENTION — HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          {/* Hero Titles */}
          <div className="text-center space-y-5 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-semibold animate-in fade-in slide-in-from-top-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Untuk kamu yang gajian tiap bulan</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-heading text-text-primary leading-[1.15]">
              Gaji Masuk, Dua Minggu Habis.{" "}
              <span className="text-primary underline decoration-gold/50 underline-offset-8">
                Ke Mana Perginya?
              </span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              Catat pengeluaran cukup lewat chat teks, voice note, atau foto struk ke bot Telegram. Dicatetin merapikannya jadi laporan dan grafik yang jelas seketika.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button asChild size="lg" className="w-full sm:w-auto font-bold gap-2 text-base shadow-lg shadow-primary/20">
                <Link href="/daftar">
                  <span>Mulai Tahu Ke Mana Uangmu Pergi</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto font-semibold">
                <a href="#cara-kerja">Lihat Cara Kerjanya</a>
              </Button>
            </div>
          </div>

          {/* Dual Visual Mockup: Telegram Chat + Dashboard Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-6 max-w-5xl mx-auto">
            {/* Left Mockup: Telegram Bot Chat */}
            <div className="lg:col-span-5 rounded-3xl border border-border bg-surface p-5 shadow-card space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border">
                <div className="w-10 h-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-subtle">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-heading font-bold text-sm text-text-primary flex items-center gap-1.5">
                    <span>Dicatetin Bot</span>
                    <Badge variant="gold" className="text-[9px] px-1 py-0">BOT</Badge>
                  </div>
                  <span className="text-[11px] text-income font-medium">Online & siap mencatat</span>
                </div>
              </div>

              {/* Chat bubbles */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-end">
                  <div className="p-3 rounded-2xl rounded-tr-none bg-primary text-primary-foreground max-w-[80%] shadow-subtle">
                    makan siang 25rb pakai gopay
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl rounded-tl-none bg-background border border-border text-text-primary max-w-[90%] space-y-1.5 shadow-subtle">
                    <p className="font-semibold text-text-primary">
                      ✅ <strong>Tercatat:</strong> Pengeluaran <strong>Rp25.000</strong> &middot; Makan & Minum &middot; GoPay
                    </p>
                    <div className="flex gap-1.5 pt-1">
                      <span className="px-2 py-0.5 rounded-md bg-surface text-[10px] text-text-secondary border border-border">Ubah Pos</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface text-[10px] text-text-secondary border border-border">Ubah Wallet</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSimulateChat}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-primary/40 text-primary text-xs font-bold hover:bg-primary/5 transition-colors text-center"
              >
                + Coba Klik Simulasi Chat (+Rp25.000)
              </button>
            </div>

            {/* Right Mockup: Live Dashboard Card */}
            <div className="lg:col-span-7 rounded-3xl border border-border bg-surface p-6 shadow-card space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">
                    Total Saldo Terhitung
                  </span>
                  <div className="text-3xl font-extrabold font-heading text-text-primary mt-0.5 tabular-nums">
                    {formatIDR(dummyBalance)}
                  </div>
                </div>
                <Badge variant="income" className="py-1 px-3 text-xs">
                  Surplus +{formatIDR(14500000 - dummyExpense)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-background border border-border space-y-1">
                  <span className="text-[11px] text-text-secondary">Pemasukan Bulan Ini</span>
                  <div className="font-heading font-bold text-base text-income">
                    +Rp14.500.000
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-background border border-border space-y-1">
                  <span className="text-[11px] text-text-secondary">Pengeluaran Bulan Ini</span>
                  <div className="font-heading font-bold text-base text-expense tabular-nums">
                    -{formatIDR(dummyExpense)}
                  </div>
                </div>
              </div>

              {/* Top expense alert */}
              <div className="p-3 rounded-xl bg-gold/10 border border-gold/20 text-xs text-text-primary flex items-center justify-between">
                <span>💡 Pos Terbesar: <strong>Makan & Minum (38%)</strong></span>
                <span className="text-gold font-bold">Limit 83%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTEREST — MASALAH & SOLUSI */}
      <section id="fitur" className="py-20 border-t border-border bg-surface/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary">
              Kenapa Banyak Orang Gagal Mengatur Keuangan?
            </h2>
            <p className="text-sm text-text-secondary">
              Bukan karena penghasilan kurang, tetapi karena metode pencatatan yang terlalu rumit dan melelahkan.
            </p>
          </div>

          {/* 3 Problem Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 space-y-3 bg-background border-border">
              <div className="w-10 h-10 rounded-2xl bg-expense/10 text-expense flex items-center justify-center font-bold text-base">
                1
              </div>
              <h3 className="font-heading font-bold text-base text-text-primary">
                Malas Buka Aplikasi / Sheet
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Harus membuka template spreadsheet atau aplikasi rumit dengan puluhan menu setiap kali beli kopi 15 ribu bikin orang cepat menyerah.
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-background border-border">
              <div className="w-10 h-10 rounded-2xl bg-expense/10 text-expense flex items-center justify-center font-bold text-base">
                2
              </div>
              <h3 className="font-heading font-bold text-base text-text-primary">
                Struk Belanja Tercecer & Hilang
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Struk belanja supermarket menumpuk di dompet sampai tintanya pudar tanpa pernah dimasukkan ke dalam pembukuan keuangan bulanan.
              </p>
            </Card>

            <Card className="p-6 space-y-3 bg-background border-border">
              <div className="w-10 h-10 rounded-2xl bg-expense/10 text-expense flex items-center justify-center font-bold text-base">
                3
              </div>
              <h3 className="font-heading font-bold text-base text-text-primary">
                Tidak Tahu Pos Paling Boros
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Tahu-tahu saldo rekening ludes di pertengahan bulan tanpa tahu kategori apa yang menguras tabungan Anda paling banyak.
              </p>
            </Card>
          </div>

          {/* 3-Step Demo Animation Box */}
          <div className="p-8 md:p-12 rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/5 to-surface space-y-8">
            <div className="text-center space-y-2">
              <Badge variant="gold">DEMO 3 LANGKAH</Badge>
              <h3 className="text-2xl md:text-3xl font-bold font-heading text-text-primary">
                Dari Foto Struk Langsung Jadi Laporan Rapi
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-background border border-border space-y-3">
                <span className="text-xs font-bold text-primary font-heading">LANGKAH 1</span>
                <h4 className="font-bold text-sm text-text-primary">1. Foto Struk Belanja</h4>
                <p className="text-xs text-text-secondary">
                  Cukup jepret nota Indomaret, Alfamart, kafe, atau SPBU lewat bot Telegram atau web.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-background border border-border space-y-3">
                <span className="text-xs font-bold text-gold font-heading">LANGKAH 2</span>
                <h4 className="font-bold text-sm text-text-primary">2. AI Membaca Otomatis</h4>
                <p className="text-xs text-text-secondary">
                  AI Multimodal mengekstrak nama toko, tanggal, item rincian, dan total nominal seketika.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-background border border-border space-y-3">
                <span className="text-xs font-bold text-income font-heading">LANGKAH 3</span>
                <h4 className="font-bold text-sm text-text-primary">3. Dashboard Terupdate</h4>
                <p className="text-xs text-text-secondary">
                  Saldo wallet berkurang otomatis, grafik pos pengeluaran langsung terbentuk tanpa rumus.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="cara-kerja" className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="default">MUDAH & CEPAT</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary">
              Mulai Dalam 3 Langkah Sederhana
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-primary/10 text-primary flex items-center justify-center font-heading font-extrabold text-xl mx-auto shadow-subtle">
                1
              </div>
              <h3 className="font-heading font-bold text-base text-text-primary">
                1. Daftar & Pilih Paket
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">
                Pilih paket Basic atau Pro sesuai kebutuhan Anda. Bayar via QRIS otomatis atau transfer BCA.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-primary/10 text-primary flex items-center justify-center font-heading font-extrabold text-xl mx-auto shadow-subtle">
                2
              </div>
              <h3 className="font-heading font-bold text-base text-text-primary">
                2. Hubungkan Bot Telegram
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">
                Dapatkan kode 6 digit dari dashboard dan kirim ke bot bersama untuk menghubungkan akun secara aman.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-3xl bg-primary/10 text-primary flex items-center justify-center font-heading font-extrabold text-xl mx-auto shadow-subtle">
                3
              </div>
              <h3 className="font-heading font-bold text-base text-text-primary">
                3. Mulai Catat & Pantau Arus Kas
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">
                Ketik chat, kirim VN, atau upload struk. Lihat grafik pos pengeluaran dan export laporan kapan saja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPARISON TABLE */}
      <section id="perbandingan" className="py-20 border-t border-border bg-surface/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold font-heading text-text-primary">
              Bandingkan: Catatan Manual vs Template Sheet vs Dicatetin
            </h2>
            <p className="text-xs md:text-sm text-text-secondary">
              Lihat mengapa Dicatetin jauh lebih cepat dan konsisten digunakan setiap hari.
            </p>
          </div>

          <Card className="overflow-hidden border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-surface text-text-secondary font-semibold">
                    <th className="p-4">Fitur / Pengalaman</th>
                    <th className="p-4">Buku Catatan Manual</th>
                    <th className="p-4">Template Spreadsheet</th>
                    <th className="p-4 bg-primary/10 text-primary font-bold">Dicatetin SaaS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-4 font-semibold text-text-primary">Kecepatan Input Transaksi</td>
                    <td className="p-4 text-text-secondary">Lambat (Tulis tangan)</td>
                    <td className="p-4 text-text-secondary">Sedang (Buka laptop/app)</td>
                    <td className="p-4 bg-primary/5 font-bold text-primary">5 Detik (Chat Telegram / VN)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-text-primary">Scan Struk Belanja</td>
                    <td className="p-4 text-text-secondary">Tidak ada</td>
                    <td className="p-4 text-text-secondary">Ketik manual per baris</td>
                    <td className="p-4 bg-primary/5 font-bold text-primary">Otomatis (AI Vision Multimodal)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-text-primary">Pengingat (Reminder)</td>
                    <td className="p-4 text-text-secondary">Tidak ada</td>
                    <td className="p-4 text-text-secondary">Tidak ada</td>
                    <td className="p-4 bg-primary/5 font-bold text-primary">Pintar (Hanya jika belum catat)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-text-primary">Peringatan Budget 80%/100%</td>
                    <td className="p-4 text-text-secondary">Hitung manual</td>
                    <td className="p-4 text-text-secondary">Perlu rumus conditional format</td>
                    <td className="p-4 bg-primary/5 font-bold text-primary">Notifikasi Telegram & In-App Realtime</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-text-primary">Export Excel & Google Sheets</td>
                    <td className="p-4 text-text-secondary">Tidak bisa</td>
                    <td className="p-4 text-text-secondary">Bawaan sheet</td>
                    <td className="p-4 bg-primary/5 font-bold text-primary">1-Klik (.XLSX & .CSV Siap Impor)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. PRICING SECTION */}
      <section id="harga" className="py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <Badge variant="gold">PAKET LANGGANAN</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary">
              Investasi Terbaik untuk Mengontrol Pengeluaranmu
            </h2>
            <p className="text-xs md:text-sm text-text-secondary">
              Pilih paket langganan bulanan tanpa komitmen jangka panjang. Berhenti kapan saja.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
            {plans.map((plan) => {
              const isPro = plan.name.toLowerCase() === "pro";
              return (
                <Card
                  key={plan.id}
                  className={cn(
                    "p-8 space-y-6 relative flex flex-col justify-between shadow-card transition-all",
                    isPro
                      ? "bg-surface border-primary ring-2 ring-primary/30"
                      : "bg-surface border-border"
                  )}
                >
                  {isPro && (
                    <div className="absolute -top-3 right-6">
                      <Badge variant="gold" className="text-xs font-extrabold px-3 py-1 shadow-md">
                        PALING POPULER
                      </Badge>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold font-heading text-text-primary flex items-center gap-1.5">
                        <span>{plan.name}</span>
                        {isPro && <Sparkles className="w-4 h-4 text-gold" />}
                      </h3>
                      <p className="text-xs text-text-secondary mt-1">
                        {plan.subtitle || plan.description}
                      </p>
                    </div>

                    <div className="text-3xl font-extrabold font-heading text-primary">
                      {formatIDR(plan.price)}
                      <span className="text-xs font-normal text-text-secondary">
                        /{plan.durationDays} hari
                      </span>
                    </div>

                    {plan.aiQuotaMonthly > 0 && (
                      <div className="text-xs font-bold text-gold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Kuota AI: {plan.aiQuotaMonthly} aksi per bulan</span>
                      </div>
                    )}

                    <ul className="space-y-2.5 text-xs text-text-primary pt-4 border-t border-border">
                      {allFeatures.map((feat) => {
                        const hasFeat = plan.features.includes(feat.code);
                        return (
                          <li
                            key={feat.code}
                            className={cn(
                              "flex items-center gap-2",
                              hasFeat
                                ? isPro
                                  ? "font-semibold text-text-primary"
                                  : "text-text-primary"
                                : "text-text-secondary/50 line-through"
                            )}
                          >
                            {hasFeat ? (
                              <Check className="w-4 h-4 text-primary shrink-0" />
                            ) : (
                              <X className="w-4 h-4 shrink-0 text-text-secondary/40" />
                            )}
                            <span>{feat.label}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <Button
                    asChild
                    variant={isPro ? "default" : "outline"}
                    size={isPro ? "lg" : "default"}
                    className="w-full font-bold gap-2"
                  >
                    <Link href={`/daftar?plan=${plan.name.toLowerCase()}`}>
                      <span>{plan.ctaText || `Pilih Paket ${plan.name}`}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. FAQ ACCORDION */}
      <section id="faq" className="py-20 border-t border-border bg-surface/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold font-heading text-text-primary">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p className="text-xs md:text-sm text-text-secondary">
              Informasi lengkap seputar privasi, bot Telegram, pembayaran, dan aktivasi.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Apakah data transaksi dan keuangan saya aman?",
                a: "Sangat aman. Database Dicatetin dilindungi dengan PostgreSQL Row Level Security (RLS) di Supabase. Setiap user hanya dapat mengakses datanya sendiri. Kami tidak pernah membagikan atau menjual data Anda kepada pihak ketiga.",
              },
              {
                q: "Apakah saya perlu membuat bot Telegram sendiri?",
                a: "Tidak perlu. Anda menggunakan 1 bot resmi bersama (@DicatetinBot). Cukup masukkan kode 6 digit dari dashboard untuk menghubungkan akun Anda.",
              },
              {
                q: "Bagaimana cara pembayarannya?",
                a: "Anda dapat membayar melalui QRIS / E-Wallet (otomatis via Midtrans) atau transfer manual ke rekening BCA kami dengan mengunggah bukti transfer.",
              },
              {
                q: "Mengapa ada status menunggu persetujuan (ACC)?",
                a: "Untuk pembayaran transfer manual, admin memverifikasi keabsahan bukti mutasi rekening sebelum mengaktifkan akun demi keamanan bersama.",
              },
              {
                q: "Apakah data saya hilang jika langganan habis?",
                a: "Data Anda tidak akan pernah dihapus. Saat langganan berakhir (expired), Anda tetap dapat melihat riwayat dan mengunduh seluruh data dalam format Excel/CSV.",
              },
            ].map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-surface overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-sm text-text-primary"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-text-secondary transition-transform shrink-0",
                        isOpen && "rotate-180 text-primary"
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-xs text-text-secondary leading-relaxed border-t border-border/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. CLOSING CTA BANNER */}
      <section className="py-20 border-t border-border bg-gradient-to-b from-primary/10 to-transparent">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-text-primary">
            Mulai Tahu Ke Mana Uangmu Pergi
          </h2>
          <p className="text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
            Bergabunglah dengan ratusan pengguna cerdas yang telah mengontrol pengeluaran mereka tanpa ribet bersama Dicatetin.
          </p>
          <div className="pt-2">
            <Button asChild size="lg" className="font-bold gap-2 text-base px-8 shadow-lg shadow-primary/25">
              <Link href="/daftar">
                <span>Daftar Dicatetin Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
