"use client";

import React, { useState } from "react";
import {
  Wallet as WalletIcon,
  Plus,
  Building2,
  Smartphone,
  Banknote,
  Edit2,
  Archive,
  ArrowRightLeft,
  Check,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MoneyText } from "@/components/common/MoneyText";
import { formatIDR } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";

interface WalletItem {
  id: string;
  name: string;
  type: "cash" | "bank" | "ewallet";
  initialBalance: number;
  currentBalance: number;
  color: string;
  isArchived: boolean;
}

const INITIAL_WALLETS: WalletItem[] = [
  {
    id: "wal-1",
    name: "Dompet Tunai",
    type: "cash",
    initialBalance: 500000,
    currentBalance: 850000,
    color: "#0F7A4F",
    isArchived: false,
  },
  {
    id: "wal-2",
    name: "BCA Tabungan Utama",
    type: "bank",
    initialBalance: 5000000,
    currentBalance: 12500000,
    color: "#0284C7",
    isArchived: false,
  },
  {
    id: "wal-3",
    name: "GoPay Saldo",
    type: "ewallet",
    initialBalance: 200000,
    currentBalance: 1500000,
    color: "#0891B2",
    isArchived: false,
  },
];

export default function UserWalletsPage() {
  const [wallets, setWallets] = useState<WalletItem[]>(INITIAL_WALLETS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<WalletItem | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState<"cash" | "bank" | "ewallet">("bank");
  const [initialBalance, setInitialBalance] = useState(0);

  const totalCalculatedBalance = wallets
    .filter((w) => !w.isArchived)
    .reduce((acc, curr) => acc + curr.currentBalance, 0);

  const handleOpenAdd = () => {
    setEditingWallet(null);
    setName("");
    setType("bank");
    setInitialBalance(0);
    setModalOpen(true);
  };

  const handleOpenEdit = (w: WalletItem) => {
    setEditingWallet(w);
    setName(w.name);
    setType(w.type);
    setInitialBalance(w.initialBalance);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWallet) {
      setWallets((prev) =>
        prev.map((w) =>
          w.id === editingWallet.id
            ? { ...w, name, type, initialBalance }
            : w
        )
      );
    } else {
      const newWallet: WalletItem = {
        id: `wal-${Date.now()}`,
        name,
        type,
        initialBalance,
        currentBalance: initialBalance,
        color: type === "bank" ? "#0284C7" : type === "ewallet" ? "#0891B2" : "#0F7A4F",
        isArchived: false,
      };
      setWallets([...wallets, newWallet]);
    }
    setModalOpen(false);
  };

  const handleToggleArchive = (id: string) => {
    setWallets((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isArchived: !w.isArchived } : w))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-text-primary">
            Wallet & Rekening
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            Kelola multi-dompet tunai, rekening bank, dan e-wallet dengan saldo terhitung otomatis.
          </p>
        </div>

        <Button onClick={handleOpenAdd} className="gap-2 font-bold">
          <Plus className="w-4 h-4" />
          <span>Tambah Wallet Baru</span>
        </Button>
      </div>

      {/* Summary Banner */}
      <Card className="p-6 bg-surface border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-text-secondary font-medium uppercase tracking-wider">
            Total Saldo Seluruh Wallet
          </span>
          <div className="text-3xl font-extrabold font-heading text-text-primary mt-1">
            <MoneyText amount={totalCalculatedBalance} size="3xl" />
          </div>
        </div>
        <Badge variant="income" className="self-start sm:self-auto py-1 px-3 text-xs">
          {wallets.filter((w) => !w.isArchived).length} Dompet Aktif
        </Badge>
      </Card>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wallets.map((wallet) => (
          <Card
            key={wallet.id}
            className={cn(
              "p-6 space-y-4 relative transition-all",
              wallet.isArchived && "opacity-60 bg-surface/30"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-subtle"
                  style={{ backgroundColor: wallet.color }}
                >
                  {wallet.type === "cash" && <Banknote className="w-5 h-5" />}
                  {wallet.type === "bank" && <Building2 className="w-5 h-5" />}
                  {wallet.type === "ewallet" && <Smartphone className="w-5 h-5" />}
                </div>

                <div>
                  <h3 className="font-heading font-bold text-base text-text-primary">
                    {wallet.name}
                  </h3>
                  <span className="text-xs text-text-secondary capitalize">
                    {wallet.type === "cash" && "Uang Tunai (Cash)"}
                    {wallet.type === "bank" && "Rekening Bank"}
                    {wallet.type === "ewallet" && "E-Wallet Digital"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleOpenEdit(wallet)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleToggleArchive(wallet.id)}
                  title={wallet.isArchived ? "Buka Arsip" : "Arsipkan"}
                  className="h-8 w-8 p-0 text-text-secondary"
                >
                  <Archive className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-background border border-border space-y-1">
              <span className="text-xs text-text-secondary">Saldo Berjalan Saat Ini:</span>
              <div className="text-2xl font-extrabold font-heading text-text-primary">
                {formatIDR(wallet.currentBalance)}
              </div>
              <div className="text-[11px] text-text-secondary pt-1 flex justify-between">
                <span>Saldo Awal:</span>
                <span className="font-mono">{formatIDR(wallet.initialBalance)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit Wallet Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-2xl space-y-4">
            <h3 className="font-heading font-bold text-lg text-text-primary">
              {editingWallet ? "Edit Wallet" : "Tambah Wallet Baru"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">
                  Nama Dompet / Rekening
                </label>
                <Input
                  required
                  placeholder="Contoh: BCA Tabungan, Dompet Tunai, OVO"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">
                  Tipe Dompet
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "cash", label: "Tunai", icon: Banknote },
                    { id: "bank", label: "Bank", icon: Building2 },
                    { id: "ewallet", label: "E-Wallet", icon: Smartphone },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id as any)}
                      className={cn(
                        "p-2.5 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all",
                        type === t.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background text-text-secondary"
                      )}
                    >
                      <t.icon className="w-4 h-4" />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">
                  Saldo Awal (IDR)
                </label>
                <Input
                  type="number"
                  required
                  min={0}
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(Number(e.target.value))}
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
                  Simpan Wallet
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
