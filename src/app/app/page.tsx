"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Sparkles,
  Receipt,
  Calendar,
  ChevronRight,
  Filter,
  Flame,
  ArrowUpRight,
  ArrowDownLeft,
  Bot,
  ScanLine,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { StatCard } from "@/components/common/StatCard";
import { MoneyText } from "@/components/common/MoneyText";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { formatIDR } from "@/lib/utils/currency";
import { formatDateID } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";

const SAMPLE_CASHFLOW_30DAYS = [
  { day: "1 Okt", income: 0, expense: 75000 },
  { day: "5 Okt", income: 5000000, expense: 250000 },
  { day: "10 Okt", income: 0, expense: 120000 },
  { day: "15 Okt", income: 1500000, expense: 450000 },
  { day: "20 Okt", income: 0, expense: 300000 },
  { day: "25 Okt", income: 8000000, expense: 650000 },
  { day: "30 Okt", income: 0, expense: 180000 },
];

const SAMPLE_CATEGORY_EXPENSES = [
  { name: "Makan & Minum", value: 1250000, color: "#DC2626", percentage: 38 },
  { name: "Belanja Harian", value: 750000, color: "#D97706", percentage: 23 },
  { name: "Transportasi", value: 450000, color: "#EA580C", percentage: 14 },
  { name: "Tagihan & Pulsa", value: 380000, color: "#0891B2", percentage: 12 },
  { name: "Hiburan & Lainnya", value: 420000, color: "#9333EA", percentage: 13 },
];

const SAMPLE_RECENT_TRANSACTIONS = [
  {
    id: "tx-1",
    type: "expense",
    name: "Makan Siang & Es Kopi",
    category: "Makan & Minum",
    wallet: "GoPay",
    amount: 45000,
    occurredAt: "2026-10-06 12:30",
    source: "telegram_text",
  },
  {
    id: "tx-2",
    type: "expense",
    name: "Belanja Bulanan Indomaret",
    category: "Belanja Harian",
    wallet: "BCA",
    amount: 184500,
    occurredAt: "2026-10-06 09:15",
    source: "receipt",
  },
  {
    id: "tx-3",
    type: "expense",
    name: "Isi Bensin Motor",
    category: "Transportasi",
    wallet: "Tunai",
    amount: 50000,
    occurredAt: "2026-10-05 17:40",
    source: "telegram_voice",
  },
  {
    id: "tx-4",
    type: "income",
    name: "Freelance Desain UI",
    category: "Freelance",
    wallet: "BCA",
    amount: 2500000,
    occurredAt: "2026-10-04 14:00",
    source: "web",
  },
  {
    id: "tx-5",
    type: "transfer",
    name: "Tarik Tunai ATM",
    category: "Transfer",
    wallet: "BCA → Tunai",
    amount: 500000,
    occurredAt: "2026-10-03 11:20",
    source: "web",
  },
];

export default function UserDashboardPage() {
  const [periodFilter, setPeriodFilter] = useState("this_month");
  const streakDays = 6;

  const totalBalance = 14850000;
  const totalIncome = 14500000;
  const totalExpense = 3250000;
  const netSurplus = totalIncome - totalExpense;

  return (
    <div className="space-y-8">
      {/* Top Welcome & Period Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-text-primary">
            Beranda Keuangan
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            Pantau arus kas, sisa anggaran, dan distribusi pos pengeluaran Anda.
          </p>
        </div>

        {/* Period Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-surface border border-border self-start sm:self-auto overflow-x-auto">
          {[
            { id: "this_week", label: "Minggu Ini" },
            { id: "this_month", label: "Bulan Ini" },
            { id: "last_month", label: "Bulan Lalu" },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriodFilter(p.id)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                periodFilter === p.id
                  ? "bg-primary text-primary-foreground shadow-subtle"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Streak & Motivation Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-gold/10 to-transparent border border-primary/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold flex items-center justify-center">
            <Flame className="w-6 h-6 fill-gold stroke-none animate-bounce" />
          </div>
          <div>
            <div className="text-xs font-bold text-text-primary flex items-center gap-1.5">
              <span>Streak Mencatat: {streakDays} Hari Berturut-turut!</span>
              <Badge variant="gold" className="text-[10px] px-1.5 py-0">HEBAT</Badge>
            </div>
            <p className="text-[11px] text-text-secondary mt-0.5">
              Pertahankan konsistensi mencatatmu untuk wawasan keuangan yang 100% akurat.
            </p>
          </div>
        </div>

        <Link
          href="/app/telegram"
          className="hidden md:flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
        >
          <Bot className="w-4 h-4" />
          <span>Catat via Telegram</span>
        </Link>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Saldo (Semua Wallet)"
          value={<MoneyText amount={totalBalance} size="2xl" type="neutral" />}
          subtitle="3 Rekening & E-Wallet Aktif"
          icon={Wallet}
        />
        <StatCard
          title="Pemasukan Bulan Ini"
          value={<MoneyText amount={totalIncome} size="2xl" type="income" showSign />}
          subtitle="+15% vs bulan lalu"
          icon={TrendingUp}
          iconClassName="bg-income/10 text-income"
        />
        <StatCard
          title="Pengeluaran Bulan Ini"
          value={<MoneyText amount={totalExpense} size="2xl" type="expense" showSign />}
          subtitle="Hemat 8% dari limit budget"
          icon={TrendingDown}
          iconClassName="bg-expense/10 text-expense"
        />
        <StatCard
          title="Selisih (Surplus Arus Kas)"
          value={<MoneyText amount={netSurplus} size="2xl" type={netSurplus >= 0 ? "income" : "expense"} showSign />}
          subtitle={netSurplus >= 0 ? "Arus kas sehat (Surplus)" : "Defisit keuangan!"}
          icon={Sparkles}
          iconClassName="bg-gold/15 text-gold"
        />
      </div>

      {/* Charts Section: Cashflow Line + Expense Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 30-Day Cashflow Chart */}
        <Card className="lg:col-span-2 p-6">
          <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold">Arus Kas Harian (30 Hari)</CardTitle>
              <p className="text-xs text-text-secondary">Pemasukan vs Pengeluaran</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-income font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-income" /> Pemasukan
              </span>
              <span className="flex items-center gap-1.5 text-expense font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-expense" /> Pengeluaran
              </span>
            </div>
          </CardHeader>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SAMPLE_CASHFLOW_30DAYS}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis
                  stroke="var(--text-secondary)"
                  fontSize={11}
                  tickFormatter={(v) => `Rp${(v / 1000000).toFixed(1)}jt`}
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
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#16A34A"
                  strokeWidth={2}
                  fill="#16A34A"
                  fillOpacity={0.15}
                />
                <Area
                  type="monotone"
                  dataKey="expense"
                  stroke="#DC2626"
                  strokeWidth={2}
                  fill="#DC2626"
                  fillOpacity={0.15}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Expense Category Donut Chart */}
        <Card className="p-6 flex flex-col justify-between">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-base font-bold">Pos Pengeluaran</CardTitle>
            <p className="text-xs text-text-secondary">Distribusi per kategori</p>
          </CardHeader>

          {/* Highest category highlight */}
          <div className="p-3 rounded-xl bg-expense/10 border border-expense/20 text-xs text-expense font-semibold">
            Paling boros: Makan & Minum (38%) &middot; {formatIDR(1250000)}
          </div>

          <div className="h-44 w-full relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SAMPLE_CATEGORY_EXPENSES}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                >
                  {SAMPLE_CATEGORY_EXPENSES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [formatIDR(Number(val)), "Pengeluaran"]}
                  contentStyle={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-border">
            {SAMPLE_CATEGORY_EXPENSES.slice(0, 3).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-text-secondary">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </span>
                <span className="font-heading font-bold text-text-primary">
                  {cat.percentage}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Budget Progress & 5 Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Progress Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <CardTitle className="text-base font-bold">Progress Budget Bulan Ini</CardTitle>
              <p className="text-xs text-text-secondary">Batas pemakaian per kategori</p>
            </div>
            <Link href="/app/budget" className="text-xs text-primary font-bold hover:underline">
              Kelola
            </Link>
          </div>

          <div className="space-y-4">
            {/* Makan & Minum */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-text-primary">Makan & Minum</span>
                <span className="text-text-secondary">
                  {formatIDR(1250000)} / {formatIDR(1500000)}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                <div className="h-full bg-budgetWarning rounded-full transition-all" style={{ width: "83%" }} />
              </div>
              <div className="text-[10px] text-budgetWarning font-medium text-right">
                Peringatan: 83% dari batas anggaran
              </div>
            </div>

            {/* Belanja Harian */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-text-primary">Belanja Harian</span>
                <span className="text-text-secondary">
                  {formatIDR(750000)} / {formatIDR(1500000)}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: "50%" }} />
              </div>
              <div className="text-[10px] text-income font-medium text-right">
                Aman (50% terpakai)
              </div>
            </div>

            {/* Transportasi */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-text-primary">Transportasi</span>
                <span className="text-text-secondary">
                  {formatIDR(450000)} / {formatIDR(600000)}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: "75%" }} />
              </div>
              <div className="text-[10px] text-income font-medium text-right">
                Aman (75% terpakai)
              </div>
            </div>
          </div>
        </Card>

        {/* 5 Recent Transactions */}
        <Card className="lg:col-span-2 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <CardTitle className="text-base font-bold">5 Transaksi Terakhir</CardTitle>
              <p className="text-xs text-text-secondary">Aktivitas keuangan terbaru</p>
            </div>
            <Link href="/app/transaksi" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
              <span>Semua Riwayat</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-border">
            {SAMPLE_RECENT_TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-3 hover:bg-surface/50 rounded-xl px-2 transition-colors">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
                      tx.type === "income" && "bg-income/10 text-income",
                      tx.type === "expense" && "bg-expense/10 text-expense",
                      tx.type === "transfer" && "bg-primary/10 text-primary"
                    )}
                  >
                    {tx.type === "income" && <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />}
                    {tx.type === "expense" && <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />}
                    {tx.type === "transfer" && <ArrowRightLeft className="w-4 h-4 stroke-[2.5]" />}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-text-primary">{tx.name}</div>
                    <div className="text-[11px] text-text-secondary flex items-center gap-1.5 mt-0.5">
                      <span>{tx.category}</span>
                      <span>&middot;</span>
                      <span>{tx.wallet}</span>
                      <span>&middot;</span>
                      <span className="font-mono">{tx.occurredAt}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <MoneyText
                    amount={tx.amount}
                    type={tx.type as any}
                    showSign={tx.type !== "transfer"}
                    size="base"
                  />
                  <div className="text-[10px] text-text-secondary capitalize mt-0.5">
                    {tx.source === "telegram_text" && "Bot Telegram"}
                    {tx.source === "receipt" && "Scan Struk AI"}
                    {tx.source === "telegram_voice" && "Voice Note AI"}
                    {tx.source === "web" && "Web Manual"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
