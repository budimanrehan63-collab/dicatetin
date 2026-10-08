"use client";

import React, { useState } from "react";
import {
  Receipt,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  Trash2,
  Edit3,
  Eye,
  Calendar,
  Tag,
  Wallet,
  FileText,
  ScanLine,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MoneyText } from "@/components/common/MoneyText";
import { formatIDR } from "@/lib/utils/currency";
import { formatDateID } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";

interface Transaction {
  id: string;
  type: "income" | "expense" | "transfer";
  name: string;
  category: string;
  wallet: string;
  toWallet?: string;
  amount: number;
  occurredAt: string;
  note?: string;
  source: "web" | "telegram_text" | "telegram_voice" | "receipt";
  receiptUrl?: string;
  items?: Array<{ name: string; qty: number; price: number; subtotal: number }>;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    type: "expense",
    name: "Makan Siang & Es Kopi",
    category: "Makan & Minum",
    wallet: "GoPay",
    amount: 45000,
    occurredAt: "2026-10-06 12:30",
    note: "Makan bareng tim kantor",
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
    receiptUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60",
    items: [
      { name: "Susu UHT Full Cream 1L", qty: 2, price: 21500, subtotal: 43000 },
      { name: "Roti Tawar Gandum", qty: 1, price: 18500, subtotal: 18500 },
      { name: "Minyak Goreng 2L", qty: 1, price: 38000, subtotal: 38000 },
      { name: "Sabun Mandi Cair Refill", qty: 2, price: 29000, subtotal: 58000 },
      { name: "Kopi Arabika Sachet", qty: 1, price: 27000, subtotal: 27000 },
    ],
  },
  {
    id: "tx-3",
    type: "expense",
    name: "Isi Bensin Pertamax",
    category: "Transportasi",
    wallet: "Tunai",
    amount: 50000,
    occurredAt: "2026-10-05 17:40",
    note: "Isi bensin motor",
    source: "telegram_voice",
  },
  {
    id: "tx-4",
    type: "income",
    name: "Freelance Desain UI/UX",
    category: "Freelance",
    wallet: "BCA",
    amount: 2500000,
    occurredAt: "2026-10-04 14:00",
    note: "Pembayaran termin 1 klien SaaS",
    source: "web",
  },
  {
    id: "tx-5",
    type: "transfer",
    name: "Top Up GoPay dari BCA",
    category: "Transfer",
    wallet: "BCA",
    toWallet: "GoPay",
    amount: 200000,
    occurredAt: "2026-10-04 10:15",
    source: "web",
  },
  {
    id: "tx-6",
    type: "expense",
    name: "Tagihan Listrik PLN",
    category: "Tagihan & Utilitas",
    wallet: "BCA",
    amount: 350000,
    occurredAt: "2026-10-02 08:30",
    source: "web",
  },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [walletFilter, setWalletFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter((tx) => {
    const matchSearch =
      tx.name.toLowerCase().includes(search.toLowerCase()) ||
      tx.category.toLowerCase().includes(search.toLowerCase()) ||
      (tx.note && tx.note.toLowerCase().includes(search.toLowerCase()));
    const matchType = typeFilter === "all" || tx.type === typeFilter;
    const matchWallet = walletFilter === "all" || tx.wallet === walletFilter;
    const matchSource = sourceFilter === "all" || tx.source === sourceFilter;
    return matchSearch && matchType && matchWallet && matchSource;
  });

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-text-primary">
            Riwayat Transaksi
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            Daftar seluruh pemasukan, pengeluaran, transfer, dan rincian struk belanja Anda.
          </p>
        </div>
      </div>

      {/* Search & Multi-Filter Bar */}
      <Card className="p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Input
              type="text"
              placeholder="Cari transaksi, kategori, catatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
            <Search className="w-4 h-4 text-text-secondary absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            {/* Type */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-9 px-2.5 rounded-xl border border-border bg-background text-xs text-text-primary"
            >
              <option value="all">Semua Jenis</option>
              <option value="expense">Pengeluaran</option>
              <option value="income">Pemasukan</option>
              <option value="transfer">Transfer</option>
            </select>

            {/* Wallet */}
            <select
              value={walletFilter}
              onChange={(e) => setWalletFilter(e.target.value)}
              className="h-9 px-2.5 rounded-xl border border-border bg-background text-xs text-text-primary"
            >
              <option value="all">Semua Wallet</option>
              <option value="Tunai">Tunai</option>
              <option value="BCA">BCA</option>
              <option value="GoPay">GoPay</option>
            </select>

            {/* Source */}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="h-9 px-2.5 rounded-xl border border-border bg-background text-xs text-text-primary"
            >
              <option value="all">Semua Sumber</option>
              <option value="web">Web Manual</option>
              <option value="telegram_text">Telegram Teks</option>
              <option value="telegram_voice">Voice Note AI</option>
              <option value="receipt">Scan Struk AI</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Transactions List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-surface text-text-secondary font-semibold">
                <th className="p-4">Tanggal & Jam</th>
                <th className="p-4">Deskripsi / Catatan</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Wallet</th>
                <th className="p-4">Sumber</th>
                <th className="p-4 text-right">Nominal</th>
                <th className="p-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-text-secondary">
                    Tidak ada transaksi yang cocok dengan filter yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface/50 transition-colors">
                    <td className="p-4 font-mono text-text-secondary whitespace-nowrap">
                      {tx.occurredAt}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-lg flex items-center justify-center shrink-0",
                            tx.type === "income" && "bg-income/10 text-income",
                            tx.type === "expense" && "bg-expense/10 text-expense",
                            tx.type === "transfer" && "bg-primary/10 text-primary"
                          )}
                        >
                          {tx.type === "income" && <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />}
                          {tx.type === "expense" && <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />}
                          {tx.type === "transfer" && <ArrowRightLeft className="w-3.5 h-3.5 stroke-[2.5]" />}
                        </div>
                        <div>
                          <div className="font-bold text-text-primary">{tx.name}</div>
                          {tx.note && (
                            <div className="text-[11px] text-text-secondary">{tx.note}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{tx.category}</Badge>
                    </td>
                    <td className="p-4 font-medium text-text-primary">
                      {tx.type === "transfer" ? `${tx.wallet} → ${tx.toWallet}` : tx.wallet}
                    </td>
                    <td className="p-4">
                      {tx.source === "telegram_text" && (
                        <span className="text-[11px] text-primary font-medium">Telegram Teks</span>
                      )}
                      {tx.source === "receipt" && (
                        <button
                          type="button"
                          onClick={() => setSelectedReceiptTx(tx)}
                          className="inline-flex items-center gap-1 text-[11px] text-gold font-bold hover:underline"
                        >
                          <ScanLine className="w-3.5 h-3.5" />
                          <span>Rincian Struk</span>
                        </button>
                      )}
                      {tx.source === "telegram_voice" && (
                        <span className="text-[11px] text-primary font-medium">Voice Note AI</span>
                      )}
                      {tx.source === "web" && (
                        <span className="text-[11px] text-text-secondary">Web Manual</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <MoneyText
                        amount={tx.amount}
                        type={tx.type as any}
                        showSign={tx.type !== "transfer"}
                        size="sm"
                      />
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {tx.receiptUrl && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedReceiptTx(tx)}
                            title="Lihat Rincian Struk"
                            className="h-7 w-7 p-0"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(tx.id)}
                          title="Hapus Transaksi"
                          className="h-7 w-7 p-0 text-expense hover:bg-expense/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Receipt Item Breakdown Modal */}
      {selectedReceiptTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="fixed inset-0" onClick={() => setSelectedReceiptTx(null)} />
          <div className="relative z-10 max-w-lg w-full bg-surface border border-border rounded-3xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-heading font-bold text-base text-text-primary">
                  Rincian Struk Pembelian
                </h3>
                <p className="text-xs text-text-secondary">{selectedReceiptTx.name}</p>
              </div>
              <button
                onClick={() => setSelectedReceiptTx(null)}
                className="text-xs text-text-secondary hover:text-text-primary"
              >
                Tutup
              </button>
            </div>

            {/* Receipt Image */}
            {selectedReceiptTx.receiptUrl && (
              <div className="rounded-2xl overflow-hidden bg-black/20 h-40 flex items-center justify-center border border-border">
                <img
                  src={selectedReceiptTx.receiptUrl}
                  alt="Foto Struk"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Breakdown item table */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-text-primary block">Daftar Item:</span>
              <div className="divide-y divide-border border border-border rounded-xl bg-background overflow-hidden">
                {selectedReceiptTx.items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-medium text-text-primary">{item.name}</div>
                      <div className="text-[10px] text-text-secondary">
                        {item.qty} x {formatIDR(item.price)}
                      </div>
                    </div>
                    <div className="font-heading font-bold text-text-primary">
                      {formatIDR(item.subtotal)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="p-3.5 rounded-xl bg-surface border border-border flex items-center justify-between text-sm">
              <span className="font-bold text-text-primary">Total Struk:</span>
              <span className="font-heading font-extrabold text-base text-expense">
                {formatIDR(selectedReceiptTx.amount)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
