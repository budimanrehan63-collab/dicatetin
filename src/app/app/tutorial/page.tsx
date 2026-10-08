"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  PlayCircle,
  Receipt,
  Bot,
  ScanLine,
  PieChart,
  FileSpreadsheet,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

const TUTORIAL_STEPS = [
  {
    id: "step-1",
    title: "1. Mulai Mencatat Manual di Web",
    desc: "Gunakan tombol '+' di sudut layar untuk membuka keypad nominal besar. Pilih kategori, wallet, dan simpan dalam 5 detik.",
    icon: Receipt,
    badge: "Dasar",
    illustration: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60",
    tips: "Nominal dapat diketik cepat dengan tombol '000' pada keypad.",
  },
  {
    id: "step-2",
    title: "2. Menghubungkan Bot Telegram (Pro)",
    desc: "Buka menu Telegram Bot, klik tombol 'Hubungkan' untuk mendapatkan kode 6 digit. Kirim /start <kode> ke bot Telegram.",
    icon: Bot,
    badge: "Fitur Pro",
    illustration: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60",
    tips: "Satu bot bersama mengenali akun Anda langsung dari Telegram ID Anda.",
  },
  {
    id: "step-3",
    title: "3. Scan Struk & Nota Belanja AI (Pro)",
    desc: "Cukup foto struk belanja minimarket atau restoran dari menu Scan Struk atau kirim foto ke bot Telegram. AI akan membaca toko, tanggal, item rincian, dan nominal total secara otomatis.",
    icon: ScanLine,
    badge: "Fitur Pro",
    illustration: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=60",
    tips: "Pastikan foto struk cukup terang dan tidak terlipat agar AI membaca dengan akurasi maksimal.",
  },
  {
    id: "step-4",
    title: "4. Mengatur Limit Budget & Peringatan",
    desc: "Tentukan batas pengeluaran bulanan per kategori. Dicatetin akan memberi notifikasi saat anggaran Anda menyentuh 80% dan 100%.",
    icon: PieChart,
    badge: "Keuangan Sehat",
    illustration: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=60",
    tips: "Fokus batasi pos pengeluaran terbesar seperti Makan & Minum atau Hiburan.",
  },
  {
    id: "step-5",
    title: "5. Export Laporan ke Excel & Google Sheets",
    desc: "Unduh pembukuan lengkap Anda kapan saja dalam format .xlsx (dengan sheet transaksi & sheet ringkasan) atau format .csv.",
    icon: FileSpreadsheet,
    badge: "Export",
    illustration: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60",
    tips: "File .csv dapat langsung diimpor ke template Google Sheets pribadi Anda.",
  },
];

export default function UserTutorialPage() {
  const [selectedStep, setSelectedStep] = useState(0);
  const current = TUTORIAL_STEPS[selectedStep];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading tracking-tight text-text-primary">
          Tutorial & Panduan Penggunaan
        </h1>
        <p className="text-xs md:text-sm text-text-secondary mt-1">
          Pelajari cara memaksimalkan seluruh fitur Dicatetin untuk mengelola keuangan pribadi secara efisien.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step List on Left */}
        <div className="space-y-2">
          {TUTORIAL_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = selectedStep === idx;
            return (
              <button
                key={step.id}
                onClick={() => setSelectedStep(idx)}
                className={cn(
                  "w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-subtle text-primary"
                    : "border-border bg-surface hover:bg-background text-text-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-background border border-border text-text-secondary"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-xs">{step.title}</h4>
                    <span className="text-[10px] text-text-secondary">{step.badge}</span>
                  </div>
                </div>
                <ChevronRight className={cn("w-4 h-4", isSelected ? "text-primary" : "text-text-secondary/40")} />
              </button>
            );
          })}
        </div>

        {/* Selected Step Detail on Right */}
        <Card className="lg:col-span-2 p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="gold" className="text-[10px] mb-1">{current.badge}</Badge>
              <h2 className="text-xl font-bold font-heading text-text-primary">{current.title}</h2>
            </div>
          </div>

          <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
            {current.desc}
          </p>

          <div className="rounded-2xl overflow-hidden border border-border bg-surface h-56 flex items-center justify-center relative shadow-subtle">
            <img
              src={current.illustration}
              alt={current.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
              <div className="text-white text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-income" />
                <span>Tips: {current.tips}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={selectedStep === 0}
              onClick={() => setSelectedStep(selectedStep - 1)}
            >
              Sebelumnya
            </Button>

            <span className="text-xs text-text-secondary font-mono">
              Langkah {selectedStep + 1} dari {TUTORIAL_STEPS.length}
            </span>

            <Button
              size="sm"
              disabled={selectedStep === TUTORIAL_STEPS.length - 1}
              onClick={() => setSelectedStep(selectedStep + 1)}
            >
              Berikutnya
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
