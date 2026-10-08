"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Download, Search, CheckCircle2, Clock, XCircle, ArrowUpRight, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatIDR } from "@/lib/utils/currency";
import { formatDateID } from "@/lib/utils/date";
import { AdminStore, PaymentItem } from "@/lib/data/adminStore";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadPayments = () => {
    setPayments(AdminStore.getPayments());
  };

  useEffect(() => {
    setMounted(true);
    loadPayments();

    const handleUpdate = () => loadPayments();
    window.addEventListener("dicatetin_store_updated", handleUpdate);
    return () => window.removeEventListener("dicatetin_store_updated", handleUpdate);
  }, []);

  const handleDeletePayment = (id: string) => {
    if (confirm("Hapus catatan transaksi pembayaran ini?")) {
      AdminStore.deletePayment(id);
      alert("Catatan pembayaran berhasil dihapus.");
    }
  };

  const handleExportCSV = () => {
    if (payments.length === 0) {
      alert("Tidak ada data pembayaran untuk diexport.");
      return;
    }

    const headers = ["Order ID", "Nama User", "Email", "Paket", "Nominal", "Metode", "Status", "Tanggal"];
    const rows = payments.map((p) => [
      p.orderId,
      p.userName,
      p.userEmail,
      p.planName,
      p.amount,
      p.method,
      p.status,
      p.createdAt,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `laporan_pembayaran_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = payments.filter((p) => {
    const matchSearch =
      p.userName.toLowerCase().includes(search.toLowerCase()) ||
      p.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      p.orderId.toLowerCase().includes(search.toLowerCase());
    const matchMethod = methodFilter === "all" || p.method === methodFilter;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchMethod && matchStatus;
  });

  if (!mounted) {
    return <div className="p-8 text-center text-xs text-text-secondary">Memuat data pembayaran...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-text-primary">
            Riwayat Pembayaran
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            Catatan transaksi pembayaran pendaftar riil, transfer bank, dan gateway pembayaran.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleExportCSV}
          className="gap-2 text-xs font-bold"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Riil</span>
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
            <Input
              placeholder="Cari order ID, nama, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter status transaksi"
              className="h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Semua Status</option>
              <option value="paid">Lunas (Paid)</option>
              <option value="pending">Pending</option>
              <option value="rejected">Ditolak</option>
            </select>

            {/* Method Filter */}
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              aria-label="Filter metode transaksi"
              className="h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Semua Metode</option>
              <option value="midtrans">Midtrans</option>
              <option value="transfer">Transfer BCA</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface text-text-secondary font-semibold">
                <th className="py-3 px-4">Order ID & Tanggal</th>
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">Paket</th>
                <th className="py-3 px-4">Nominal</th>
                <th className="py-3 px-4">Metode</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-text-secondary">
                    <CreditCard className="w-8 h-8 text-text-secondary/40 mx-auto mb-2" />
                    <p className="font-medium text-text-primary">Tidak Ada Riwayat Pembayaran</p>
                    <p className="text-[11px] text-text-secondary mt-0.5">
                      Belum ada transaksi pembayaran yang tercatat atau cocok dengan filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-text-primary">{item.orderId}</div>
                      <div className="text-[11px] text-text-secondary">
                        {formatDateID(item.createdAt.split("T")[0])}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-text-primary">{item.userName}</div>
                      <div className="text-[11px] text-text-secondary">{item.userEmail}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={item.planName.toLowerCase() === "pro" ? "gold" : "secondary"}>
                        {item.planName}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 font-bold font-heading text-text-primary tabular-nums">
                      {formatIDR(item.amount)}
                    </td>

                    <td className="py-3.5 px-4 capitalize text-text-secondary">
                      {item.method === "midtrans" ? "Midtrans Gateway" : "Transfer Bank BCA"}
                    </td>

                    <td className="py-3.5 px-4">
                      {item.status === "paid" && (
                        <Badge variant="income" className="gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Lunas
                        </Badge>
                      )}
                      {item.status === "pending" && (
                        <Badge variant="warning" className="gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </Badge>
                      )}
                      {item.status === "rejected" && (
                        <Badge variant="destructive" className="gap-1">
                          <XCircle className="w-3.5 h-3.5" />
                          Ditolak
                        </Badge>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDeletePayment(item.id)}
                        title="Hapus riwayat pembayaran"
                        className="p-1.5 rounded-lg hover:bg-expense/10 text-text-secondary hover:text-expense transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
