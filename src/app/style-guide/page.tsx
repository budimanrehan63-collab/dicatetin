"use client";

import React from "react";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoneyText } from "@/components/common/MoneyText";
import { StatCard } from "@/components/common/StatCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Input } from "@/components/ui/input";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Receipt,
  Sparkles,
  ShieldCheck,
  Send,
  PieChart,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

export default function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-background text-text-primary p-6 md:p-12 space-y-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dicatetin Design System & Style Guide</h1>
          <p className="text-sm text-text-secondary mt-1">
            Panduan visual token, tipografi, warna, dan komponen dasar dalam mode terang & gelap.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>

      {/* 1. Logos */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b border-border pb-2">1. Brand Logo</h2>
        <div className="flex flex-wrap items-center gap-8 p-6 rounded-2xl border border-border bg-surface">
          <Logo size="sm" />
          <Logo size="md" />
          <Logo size="lg" />
        </div>
      </section>

      {/* 2. Color Palette & Tokens */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b border-border pb-2">2. Design Tokens (Warna & Palet)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          <div className="p-4 rounded-2xl border border-border bg-background space-y-2">
            <div className="h-12 w-full rounded-xl bg-background border border-border" />
            <div className="text-xs font-bold">Background</div>
            <div className="text-[11px] text-text-secondary">--background</div>
          </div>
          <div className="p-4 rounded-2xl border border-border bg-surface space-y-2">
            <div className="h-12 w-full rounded-xl bg-surface border border-border" />
            <div className="text-xs font-bold">Surface / Card</div>
            <div className="text-[11px] text-text-secondary">--surface</div>
          </div>
          <div className="p-4 rounded-2xl border border-border bg-surface space-y-2">
            <div className="h-12 w-full rounded-xl bg-primary" />
            <div className="text-xs font-bold text-primary">Primary Green</div>
            <div className="text-[11px] text-text-secondary">#0F7A4F / #34C88A</div>
          </div>
          <div className="p-4 rounded-2xl border border-border bg-surface space-y-2">
            <div className="h-12 w-full rounded-xl bg-gold" />
            <div className="text-xs font-bold text-gold">Aksen Emas</div>
            <div className="text-[11px] text-text-secondary">#C9A44C / #D9B866</div>
          </div>
          <div className="p-4 rounded-2xl border border-border bg-surface space-y-2">
            <div className="h-12 w-full rounded-xl bg-income" />
            <div className="text-xs font-bold text-income">Pemasukan</div>
            <div className="text-[11px] text-text-secondary">#16A34A / #4ADE80</div>
          </div>
          <div className="p-4 rounded-2xl border border-border bg-surface space-y-2">
            <div className="h-12 w-full rounded-xl bg-expense" />
            <div className="text-xs font-bold text-expense">Pengeluaran</div>
            <div className="text-[11px] text-text-secondary">#DC2626 / #F87171</div>
          </div>
        </div>
      </section>

      {/* 3. Typography & Currency (MoneyText) */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b border-border pb-2">3. Tipografi & Format Uang (MoneyText)</h2>
        <Card className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-background space-y-1">
              <span className="text-xs text-text-secondary">Saldo Total (Neutral)</span>
              <br />
              <MoneyText amount={12450000} size="2xl" type="neutral" />
            </div>
            <div className="p-4 rounded-xl border border-border bg-background space-y-1">
              <span className="text-xs text-text-secondary">Pemasukan Bulan Ini</span>
              <br />
              <MoneyText amount={15000000} size="2xl" type="income" showSign />
            </div>
            <div className="p-4 rounded-xl border border-border bg-background space-y-1">
              <span className="text-xs text-text-secondary">Pengeluaran Bulan Ini</span>
              <br />
              <MoneyText amount={2550000} size="2xl" type="expense" showSign />
            </div>
          </div>
        </Card>
      </section>

      {/* 4. Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b border-border pb-2">4. Buttons & Badges</h2>
        <div className="flex flex-wrap gap-3 items-center p-6 rounded-2xl border border-border bg-surface">
          <Button variant="default">Primary Button</Button>
          <Button variant="gold">Gold Button (Pro)</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large Action</Button>
        </div>
        <div className="flex flex-wrap gap-2 items-center p-4 rounded-2xl border border-border bg-surface">
          <Badge variant="default">Aktif</Badge>
          <Badge variant="gold">PRO MEMBER</Badge>
          <Badge variant="income">+ Pemasukan</Badge>
          <Badge variant="destructive">- Pengeluaran</Badge>
          <Badge variant="warning">Budget 80%</Badge>
          <Badge variant="secondary">Pending ACC</Badge>
        </div>
      </section>

      {/* 5. StatCards */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b border-border pb-2">5. StatCards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Saldo"
            value={<MoneyText amount={18250000} size="xl" />}
            subtitle="3 Dompet Aktif"
            icon={Wallet}
          />
          <StatCard
            title="Pemasukan"
            value={<MoneyText amount={12000000} size="xl" type="income" />}
            trend={{ value: "15%", isPositive: true, label: "vs bulan lalu" }}
            icon={TrendingUp}
            iconClassName="bg-income/10 text-income"
          />
          <StatCard
            title="Pengeluaran"
            value={<MoneyText amount={3450000} size="xl" type="expense" />}
            trend={{ value: "4%", isPositive: false, label: "lebih hemat" }}
            icon={TrendingDown}
            iconClassName="bg-expense/10 text-expense"
          />
          <StatCard
            title="Streak Mencatat"
            value="6 Hari"
            subtitle="Pertahankan konsistensimu!"
            icon={Sparkles}
            iconClassName="bg-gold/15 text-gold"
          />
        </div>
      </section>

      {/* 6. Empty State */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold border-b border-border pb-2">6. Empty State</h2>
        <EmptyState
          icon={Receipt}
          title="Belum ada transaksi di periode ini"
          description="Yuk mulai catat pengeluaran atau pemasukan pertamamu hari ini."
          actionLabel="Catat Sekarang"
          onAction={() => alert("Catat Transaksi")}
        />
      </section>
    </div>
  );
}
