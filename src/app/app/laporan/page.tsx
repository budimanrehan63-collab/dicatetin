"use client";

import React, { useState } from "react";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoneyText } from "@/components/common/MoneyText";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { formatIDR } from "@/lib/utils/currency";
import { exportToExcel, exportToCSV } from "@/lib/export/excel";

const SAMPLE_6MONTHS_DATA = [
  { month: "Mei 2026", income: 8500000, expense: 4200000 },
  { month: "Jun 2026", income: 9000000, expense: 4800000 },
  { month: "Jul 2026", income: 11000000, expense: 5100000 },
  { month: "Agu 2026", income: 10500000, expense: 4900000 },
  { month: "Sep 2026", income: 12000000, expense: 5300000 },
  { month: "Okt 2026", income: 14500000, expense: 3250000 },
];

const SAMPLE_EXPORT_TRANSACTIONS = [
  {
    Tanggal: "2026-10-06 12:30",
    Jenis: "Pengeluaran",
    Kategori: "Makan & Minum",
    Wallet: "GoPay",
    Nominal: 45000,
    Catatan: "Makan Siang & Es Kopi",
    Sumber: "Telegram Teks",
  },
  {
    Tanggal: "2026-10-06 09:15",
    Jenis: "Pengeluaran",
    Kategori: "Belanja Harian",
    Wallet: "BCA",
    Nominal: 184500,
    Catatan: "Belanja Bulanan Indomaret",
    Sumber: "Scan Struk AI",
  },
  {
    Tanggal: "2026-10-05 17:40",
    Jenis: "Pengeluaran",
    Kategori: "Transportasi",
    Wallet: "Tunai",
    Nominal: 50000,
    Catatan: "Isi Bensin Pertamax",
    Sumber: "Voice Note AI",
  },
  {
    Tanggal: "2026-10-04 14:00",
    Jenis: "Pemasukan",
    Kategori: "Freelance",
    Wallet: "BCA",
    Nominal: 2500000,
    Catatan: "Freelance Desain UI",
    Sumber: "Web",
  },
];

const SAMPLE_CATEGORY_SUMMARY = [
  { Kategori: "Makan & Minum", Total_Pengeluaran: 1250000, Persentase: "38%" },
  { Kategori: "Belanja Harian", Total_Pengeluaran: 750000, Persentase: "23%" },
  { Kategori: "Transportasi", Total_Pengeluaran: 450000, Persentase: "14%" },
  { Kategori: "Tagihan & Pulsa", Total_Pengeluaran: 380000, Persentase: "12%" },
  { Kategori: "Hiburan", Total_Pengeluaran: 420000, Persentase: "13%" },
];

export default function UserReportsPage() {
  const [exporting, setExporting] = useState(false);

  const handleExcelExport = () => {
    setExporting(true);
    exportToExcel(SAMPLE_EXPORT_TRANSACTIONS, SAMPLE_CATEGORY_SUMMARY, "Dicatetin_Laporan_Oktober_2026");
    setExporting(false);
  };

  const handleCSVExport = () => {
    setExporting(true);
    exportToCSV(SAMPLE_EXPORT_TRANSACTIONS, "Dicatetin_Transaksi_Oktober_2026");
    setExporting(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-text-primary">
            Laporan Keuangan & Export Data
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            Analisis perbandingan bulan ke bulan dan unduh laporan ke format Excel & Google Sheets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleExcelExport}
            className="gap-2 font-bold text-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel (.XLSX)</span>
          </Button>
          <Button
            onClick={handleCSVExport}
            variant="outline"
            className="gap-2 font-bold text-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* 6-Month Comparison Chart */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <CardTitle className="text-base font-bold">
              Perbandingan Arus Kas 6 Bulan Terakhir
            </CardTitle>
            <p className="text-xs text-text-secondary">
              Pertumbuhan Pemasukan vs Pengeluaran per Bulan
            </p>
          </div>
          <Badge variant="gold">Tren Finansial</Badge>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={SAMPLE_6MONTHS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--text-secondary)" fontSize={12} />
              <YAxis
                stroke="var(--text-secondary)"
                fontSize={12}
                tickFormatter={(v) => `Rp${(v / 1000000).toFixed(0)}jt`}
              />
              <Tooltip
                formatter={(val: any) => [formatIDR(Number(val)), ""]}
                contentStyle={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  borderRadius: "12px",
                  color: "var(--text-primary)",
                }}
              />
              <Legend />
              <Bar name="Pemasukan" dataKey="income" fill="#16A34A" radius={[6, 6, 0, 0]} />
              <Bar name="Pengeluaran" dataKey="expense" fill="#DC2626" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Month-over-Month Growth Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 space-y-2">
          <span className="text-xs text-text-secondary font-medium">Rata-rata Pemasukan Bulanan</span>
          <div className="text-xl font-bold font-heading text-income">
            <MoneyText amount={10916666} size="xl" type="income" />
          </div>
          <p className="text-[11px] text-text-secondary">Kenaikan konsisten dalam 6 bulan terakhir</p>
        </Card>

        <Card className="p-5 space-y-2">
          <span className="text-xs text-text-secondary font-medium">Rata-rata Pengeluaran Bulanan</span>
          <div className="text-xl font-bold font-heading text-expense">
            <MoneyText amount={4616666} size="xl" type="expense" />
          </div>
          <p className="text-[11px] text-text-secondary">Rasio tabungan rata-rata 58%</p>
        </Card>

        <Card className="p-5 space-y-2">
          <span className="text-xs text-text-secondary font-medium">Total Akumulasi Surplus</span>
          <div className="text-xl font-bold font-heading text-primary">
            <MoneyText amount={37800000} size="xl" type="income" />
          </div>
          <p className="text-[11px] text-text-secondary">Total dana bersih tersimpan</p>
        </Card>
      </div>
    </div>
  );
}
