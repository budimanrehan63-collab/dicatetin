"use client";

import React, { useState, useEffect } from "react";
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Eye,
  Building2,
  Clock,
  Image as ImageIcon,
  History,
  ShieldCheck,
  Search,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatIDR } from "@/lib/utils/currency";
import { formatDateID } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import { AdminStore, PaymentItem } from "@/lib/data/adminStore";

export default function AdminApprovalPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"pending" | "paid" | "rejected" | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const loadData = () => {
    setPayments(AdminStore.getPayments());
  };

  useEffect(() => {
    setMounted(true);
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("dicatetin_store_updated", handleUpdate);
    return () => window.removeEventListener("dicatetin_store_updated", handleUpdate);
  }, []);

  const handleApprove = (id: string, name: string) => {
    AdminStore.updatePaymentStatus(id, "paid");
    alert(`Pembayaran ${name} berhasil disetujui (ACC)! Akun user kini berstatus aktif dan riwayat tersimpan.`);
  };

  const handleReject = (id: string, name: string) => {
    if (confirm(`Tolak bukti transfer dari ${name}?`)) {
      AdminStore.updatePaymentStatus(id, "rejected");
      alert(`Pembayaran ${name} ditolak. Riwayat penolakan tersimpan di tab Riwayat Ditolak.`);
    }
  };

  // Counts
  const pendingCount = payments.filter((p) => p.status === "pending").length;
  const approvedCount = payments.filter((p) => p.status === "paid").length;
  const rejectedCount = payments.filter((p) => p.status === "rejected").length;

  const filteredPayments = payments.filter((p) => {
    const matchTab = activeTab === "all" || p.status === activeTab;
    const matchSearch =
      p.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  if (!mounted) {
    return <div className="p-8 text-center text-xs text-text-secondary">Memuat data persetujuan...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-text-primary">
            Persetujuan Pendaftar & Riwayat Bukti Transfer
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            Verifikasi transfer bank manual, ACC pendaftar ke Kelola Users, dan pantau riwayat persetujuan lengkap.
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border pb-3">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab("pending")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === "pending"
                  ? "bg-primary text-primary-foreground shadow-subtle"
                  : "bg-surface hover:bg-background text-text-secondary hover:text-text-primary border border-border"
              )}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Menunggu ACC</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-budgetWarning text-white font-extrabold animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("paid")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === "paid"
                  ? "bg-income text-white shadow-subtle"
                  : "bg-surface hover:bg-background text-text-secondary hover:text-text-primary border border-border"
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Riwayat Disetujui (ACC)</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-income/20 text-income font-bold">
                {approvedCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("rejected")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === "rejected"
                  ? "bg-expense text-white shadow-subtle"
                  : "bg-surface hover:bg-background text-text-secondary hover:text-text-primary border border-border"
              )}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Riwayat Ditolak</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-expense/20 text-expense font-bold">
                {rejectedCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("all")}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                activeTab === "all"
                  ? "bg-surface border-2 border-primary text-primary font-extrabold"
                  : "bg-surface hover:bg-background text-text-secondary hover:text-text-primary border border-border"
              )}
            >
              <History className="w-3.5 h-3.5" />
              <span>Semua Riwayat ({payments.length})</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-text-secondary absolute left-3 top-3" />
            <Input
              placeholder="Cari nama, email, order..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs h-9"
            />
          </div>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPayments.length === 0 ? (
          <Card className="col-span-full p-12 text-center text-text-secondary">
            <CheckCircle2 className="w-10 h-10 text-income/60 mx-auto mb-2" />
            <p className="font-heading font-semibold text-text-primary">
              {activeTab === "pending"
                ? "Tidak Ada Antrian Menunggu Persetujuan"
                : activeTab === "paid"
                ? "Belum Ada Riwayat Pembayaran Disetujui"
                : activeTab === "rejected"
                ? "Belum Ada Riwayat Pembayaran Ditolak"
                : "Tidak Ada Data Transaksi Persetujuan"}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              {activeTab === "pending"
                ? "Semua bukti transfer pendaftar baru sudah selesai diverifikasi."
                : "Data transaksi akan otomatis tercatat dan tersimpan di sini."}
            </p>
          </Card>
        ) : (
          filteredPayments.map((item) => (
            <Card key={item.id} className="p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-base text-text-primary">
                      {item.userName}
                    </h3>
                    <p className="text-xs text-text-secondary">
                      {item.userEmail} &middot; {item.phoneWa}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Badge variant={item.planName.toLowerCase() === "pro" ? "gold" : "secondary"}>
                      Paket {item.planName}
                    </Badge>

                    {item.status === "paid" && (
                      <Badge variant="income" className="gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Disetujui
                      </Badge>
                    )}
                    {item.status === "pending" && (
                      <Badge variant="warning" className="gap-1">
                        <Clock className="w-3 h-3" />
                        Pending
                      </Badge>
                    )}
                    {item.status === "rejected" && (
                      <Badge variant="destructive" className="gap-1">
                        <XCircle className="w-3 h-3" />
                        Ditolak
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-background border border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="text-text-secondary">Nominal Tagihan:</span>
                    <div className="font-heading font-bold text-sm text-text-primary mt-0.5 tabular-nums">
                      {formatIDR(item.amount)}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-text-secondary">Metode:</span>
                    <div className="font-medium text-text-primary mt-0.5 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-primary" />
                      <span>{item.method === "transfer" ? "Transfer Bank BCA" : "Midtrans QRIS"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatDateID(item.createdAt.split("T")[0])}</span>
                  </span>
                  <span className="font-mono text-[11px] font-bold text-text-primary">
                    {item.orderId}
                  </span>
                </div>

                {/* Bukti Transfer Button */}
                {item.proofUrl && (
                  <button
                    type="button"
                    onClick={() => setSelectedProof(item.proofUrl!)}
                    className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-border hover:border-primary/50 text-xs text-primary font-bold transition-colors bg-surface/80 cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Lihat Foto Bukti Struk Transfer</span>
                  </button>
                )}
              </div>

              {/* Action Buttons: If Pending, show ACC & Tolak. If already ACC/Rejected, show status info */}
              {item.status === "pending" ? (
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleReject(item.id, item.userName)}
                    className="w-1/2 text-expense border-expense/30 hover:bg-expense/10 hover:border-expense gap-1.5 text-xs font-bold"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Tolak</span>
                  </Button>

                  <Button
                    type="button"
                    onClick={() => handleApprove(item.id, item.userName)}
                    className="w-1/2 gap-1.5 text-xs font-bold"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Setujui (ACC)</span>
                  </Button>
                </div>
              ) : (
                <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-text-secondary">
                  <span>Status Verifikasi:</span>
                  {item.status === "paid" ? (
                    <span className="text-income font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Disetujui & Akun Aktif di Kelola Users
                    </span>
                  ) : (
                    <span className="text-expense font-bold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Pendaftaran Ditolak
                    </span>
                  )}
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Modal Preview Bukti */}
      {selectedProof && (
        <div
          onClick={() => setSelectedProof(null)}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-lg w-full bg-surface rounded-3xl p-5 space-y-4 border border-border shadow-2xl text-left"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h4 className="font-heading font-bold text-sm text-text-primary">
                Bukti Struk Transfer Bank
              </h4>
              <button
                onClick={() => setSelectedProof(null)}
                className="text-xs text-text-secondary hover:text-text-primary px-2 py-1 rounded-lg hover:bg-background"
              >
                ✕ Tutup
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden border border-border bg-black/10 flex items-center justify-center">
              <img
                src={selectedProof}
                alt="Bukti Transfer"
                className="w-full max-h-[65vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
