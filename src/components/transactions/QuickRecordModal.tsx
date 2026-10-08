"use client";

import React, { useState } from "react";
import { X, ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Calendar, Tag, Wallet, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatIDR } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";

interface QuickRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DEFAULT_CATEGORIES = {
  expense: [
    { id: "cat-1", name: "Makan & Minum", icon: "🍔" },
    { id: "cat-2", name: "Transportasi", icon: "🚗" },
    { id: "cat-3", name: "Belanja Harian", icon: "🛒" },
    { id: "cat-4", name: "Tagihan & Utilitas", icon: "💡" },
    { id: "cat-5", name: "Pulsa & Internet", icon: "📱" },
    { id: "cat-6", name: "Kesehatan", icon: "💊" },
    { id: "cat-7", name: "Pendidikan", icon: "📚" },
    { id: "cat-8", name: "Hiburan", icon: "🎬" },
    { id: "cat-9", name: "Rumah Tangga", icon: "🏠" },
    { id: "cat-10", name: "Cicilan", icon: "💳" },
    { id: "cat-11", name: "Sedekah & Donasi", icon: "🤲" },
    { id: "cat-12", name: "Lainnya", icon: "📦" },
  ],
  income: [
    { id: "cat-13", name: "Gaji", icon: "💰" },
    { id: "cat-14", name: "Bonus", icon: "🎁" },
    { id: "cat-15", name: "Usaha", icon: "🏬" },
    { id: "cat-16", name: "Freelance", icon: "💻" },
    { id: "cat-17", name: "Hadiah", icon: "🎉" },
    { id: "cat-18", name: "Lainnya", icon: "💵" },
  ],
};

const SAMPLE_WALLETS = [
  { id: "wal-1", name: "Tunai", type: "cash" },
  { id: "wal-2", name: "BCA", type: "bank" },
  { id: "wal-3", name: "GoPay", type: "ewallet" },
];

export function QuickRecordModal({ isOpen, onClose, onSuccess }: QuickRecordModalProps) {
  const [type, setType] = useState<"expense" | "income" | "transfer">("expense");
  const [rawAmount, setRawAmount] = useState<string>("0");
  const [selectedCategory, setSelectedCategory] = useState<string>("cat-1");
  const [selectedWallet, setSelectedWallet] = useState<string>("wal-1");
  const [targetWallet, setTargetWallet] = useState<string>("wal-2");
  const [note, setNote] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleKeypadPress = (val: string) => {
    if (val === "C") {
      setRawAmount("0");
    } else if (val === "DEL") {
      setRawAmount((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
    } else if (val === "000") {
      if (rawAmount !== "0") setRawAmount((prev) => prev + "000");
    } else {
      setRawAmount((prev) => (prev === "0" ? val : prev + val));
    }
  };

  const numericAmount = parseInt(rawAmount, 10) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) return;
    setLoading(true);
    // Simulate transaction saving
    setTimeout(() => {
      setLoading(false);
      setRawAmount("0");
      setNote("");
      onClose();
      if (onSuccess) onSuccess();
    }, 400);
  };

  const categories = type === "income" ? DEFAULT_CATEGORIES.income : DEFAULT_CATEGORIES.expense;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/50">
          <h3 className="font-heading font-bold text-lg text-text-primary">
            Catat Transaksi Cepat
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Type Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-background rounded-2xl border border-border">
            <button
              type="button"
              onClick={() => {
                setType("expense");
                setSelectedCategory(DEFAULT_CATEGORIES.expense[0].id);
              }}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all",
                type === "expense"
                  ? "bg-expense text-white shadow-subtle"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Pengeluaran</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType("income");
                setSelectedCategory(DEFAULT_CATEGORIES.income[0].id);
              }}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all",
                type === "income"
                  ? "bg-income text-white shadow-subtle"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Pemasukan</span>
            </button>
            <button
              type="button"
              onClick={() => setType("transfer")}
              className={cn(
                "flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all",
                type === "transfer"
                  ? "bg-primary text-primary-foreground shadow-subtle"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Transfer</span>
            </button>
          </div>

          {/* Amount Display & Keypad */}
          <div className="p-4 rounded-2xl bg-background border border-border text-center space-y-1">
            <span className="text-xs text-text-secondary">Nominal</span>
            <div
              className={cn(
                "text-3xl md:text-4xl font-extrabold font-heading tabular-nums",
                type === "expense" && "text-expense",
                type === "income" && "text-income",
                type === "transfer" && "text-primary"
              )}
            >
              {formatIDR(numericAmount)}
            </div>
          </div>

          {/* Quick Keypad */}
          <div className="grid grid-cols-4 gap-2">
            {["1", "2", "3", "DEL", "4", "5", "6", "000", "7", "8", "9", "C", "0"].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => handleKeypadPress(k)}
                className={cn(
                  "py-2.5 rounded-xl font-heading font-semibold text-sm border border-border transition-all active:scale-95",
                  k === "DEL" || k === "C"
                    ? "bg-expense/10 text-expense hover:bg-expense/20 col-span-1"
                    : k === "0"
                    ? "col-span-2 bg-background hover:bg-surface text-text-primary"
                    : "bg-background hover:bg-surface text-text-primary"
                )}
              >
                {k}
              </button>
            ))}
          </div>

          {/* Transfer Wallets OR Category Grid */}
          {type === "transfer" ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
                  Dari Wallet
                </label>
                <select
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {SAMPLE_WALLETS.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
                  Ke Wallet
                </label>
                <select
                  value={targetWallet}
                  onChange={(e) => setTargetWallet(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {SAMPLE_WALLETS.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-text-secondary mb-2 block">
                Kategori
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-36 overflow-y-auto p-1">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id)}
                    className={cn(
                      "flex items-center gap-1.5 p-2 rounded-xl text-xs font-medium border transition-all text-left truncate",
                      selectedCategory === c.id
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-subtle"
                        : "border-border bg-background hover:bg-surface text-text-primary"
                    )}
                  >
                    <span>{c.icon}</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Wallet & Date row */}
          {type !== "transfer" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
                  Wallet / Rekening
                </label>
                <select
                  value={selectedWallet}
                  onChange={(e) => setSelectedWallet(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {SAMPLE_WALLETS.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
                  Tanggal
                </label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-text-secondary mb-1.5 block">
              Catatan (Opsional)
            </label>
            <Input
              type="text"
              placeholder="Contoh: Kopi bareng tim, makan siang padang"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={numericAmount <= 0 || loading}
              className="flex-1 font-bold"
            >
              {loading ? "Menyimpan..." : "Simpan Transaksi"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
