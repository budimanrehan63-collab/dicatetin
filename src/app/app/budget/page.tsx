"use client";

import React, { useState } from "react";
import { PieChart, Plus, AlertTriangle, CheckCircle2, Edit2, ShieldAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MoneyText } from "@/components/common/MoneyText";
import { formatIDR } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";

interface BudgetItem {
  id: string;
  categoryName: string;
  categoryIcon: string;
  limitAmount: number;
  spentAmount: number;
}

const INITIAL_BUDGETS: BudgetItem[] = [
  {
    id: "b-1",
    categoryName: "Makan & Minum",
    categoryIcon: "🍔",
    limitAmount: 1500000,
    spentAmount: 1250000, // 83.3% -> Warning
  },
  {
    id: "b-2",
    categoryName: "Belanja Harian",
    categoryIcon: "🛒",
    limitAmount: 1500000,
    spentAmount: 750000, // 50% -> Normal
  },
  {
    id: "b-3",
    categoryName: "Transportasi",
    categoryIcon: "🚗",
    limitAmount: 600000,
    spentAmount: 450000, // 75% -> Normal
  },
  {
    id: "b-4",
    categoryName: "Hiburan & Hobi",
    categoryIcon: "🎬",
    limitAmount: 400000,
    spentAmount: 420000, // 105% -> Over budget
  },
];

export default function UserBudgetPage() {
  const [budgets, setBudgets] = useState<BudgetItem[]>(INITIAL_BUDGETS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetItem | null>(null);

  const [categoryName, setCategoryName] = useState("Makan & Minum");
  const [limitAmount, setLimitAmount] = useState(1000000);

  const totalLimit = budgets.reduce((acc, b) => acc + b.limitAmount, 0);
  const totalSpent = budgets.reduce((acc, b) => acc + b.spentAmount, 0);
  const totalPercentage = Math.round((totalSpent / totalLimit) * 100);

  const handleOpenEdit = (b: BudgetItem) => {
    setEditingBudget(b);
    setCategoryName(b.categoryName);
    setLimitAmount(b.limitAmount);
    setModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingBudget(null);
    setCategoryName("Tagihan & Utilitas");
    setLimitAmount(500000);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBudget) {
      setBudgets((prev) =>
        prev.map((b) =>
          b.id === editingBudget.id ? { ...b, limitAmount } : b
        )
      );
    } else {
      const newBudget: BudgetItem = {
        id: `b-${Date.now()}`,
        categoryName,
        categoryIcon: "💡",
        limitAmount,
        spentAmount: 0,
      };
      setBudgets([...budgets, newBudget]);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-text-primary">
            Anggaran Bulanan (Budget)
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            Kendalikan pengeluaran dengan limit per kategori dan notifikasi otomatis saat mencapai 80% & 100%.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 font-bold">
          <Plus className="w-4 h-4" />
          <span>Atur Budget Baru</span>
        </Button>
      </div>

      {/* Global Budget Overview Card */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
              Total Pemakaian Anggaran Bulan Ini (Oktober 2026)
            </span>
            <div className="text-2xl font-extrabold font-heading text-text-primary mt-1">
              {formatIDR(totalSpent)}{" "}
              <span className="text-sm font-normal text-text-secondary">
                / {formatIDR(totalLimit)} ({totalPercentage}%)
              </span>
            </div>
          </div>

          <Badge
            variant={
              totalPercentage >= 100
                ? "destructive"
                : totalPercentage >= 80
                ? "warning"
                : "income"
            }
            className="text-xs py-1 px-3 self-start sm:self-auto"
          >
            {totalPercentage >= 100
              ? "Over Budget!"
              : totalPercentage >= 80
              ? "Mendekati Batas (80%+)"
              : "Pengeluaran Terkendali"}
          </Badge>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-3 rounded-full bg-border overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              totalPercentage >= 100
                ? "bg-expense"
                : totalPercentage >= 80
                ? "bg-budgetWarning"
                : "bg-primary"
            )}
            style={{ width: `${Math.min(totalPercentage, 100)}%` }}
          />
        </div>
      </Card>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((item) => {
          const percent = Math.round((item.spentAmount / item.limitAmount) * 100);
          const remaining = item.limitAmount - item.spentAmount;
          const isOver = percent >= 100;
          const isWarning = percent >= 80 && percent < 100;

          return (
            <Card key={item.id} className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.categoryIcon}</span>
                  <div>
                    <h3 className="font-heading font-bold text-base text-text-primary">
                      {item.categoryName}
                    </h3>
                    <span className="text-xs text-text-secondary">
                      Batas: {formatIDR(item.limitAmount)} / bulan
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleOpenEdit(item)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-2.5 rounded-full bg-border overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isOver ? "bg-expense" : isWarning ? "bg-budgetWarning" : "bg-primary"
                    )}
                    style={{ width: `${Math.min(percent, 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-text-primary">
                    Terpakai: {formatIDR(item.spentAmount)} ({percent}%)
                  </span>
                  <span
                    className={cn(
                      "font-semibold",
                      isOver ? "text-expense" : "text-text-secondary"
                    )}
                  >
                    {isOver ? `Lebih ${formatIDR(Math.abs(remaining))}` : `Sisa ${formatIDR(remaining)}`}
                  </span>
                </div>
              </div>

              {/* Status Alert Badge */}
              <div className="pt-1">
                {isOver && (
                  <div className="p-2.5 rounded-xl bg-expense/10 border border-expense/20 text-expense text-[11px] font-semibold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>Melebihi batas anggaran! Segera rem pengeluaran pos ini.</span>
                  </div>
                )}
                {isWarning && (
                  <div className="p-2.5 rounded-xl bg-budgetWarning/10 border border-budgetWarning/20 text-budgetWarning text-[11px] font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Peringatan: Pemakaian mencapai 80% dari batas bulanan.</span>
                  </div>
                )}
                {!isOver && !isWarning && (
                  <div className="p-2 rounded-xl bg-income/10 text-income text-[11px] font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Anggaran aman terkendali.</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Edit Budget Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-3xl border border-border bg-surface p-6 shadow-2xl space-y-4">
            <h3 className="font-heading font-bold text-lg text-text-primary">
              {editingBudget ? "Edit Batas Anggaran" : "Atur Budget Kategori"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">
                  Kategori
                </label>
                <Input
                  disabled={!!editingBudget}
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">
                  Batas Limit Bulanan (IDR)
                </label>
                <Input
                  type="number"
                  required
                  min={10000}
                  step={10000}
                  value={limitAmount}
                  onChange={(e) => setLimitAmount(Number(e.target.value))}
                />
              </div>

              <div className="pt-2 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button type="submit" className="flex-1 font-bold">
                  Simpan Budget
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
