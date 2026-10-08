"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Building2,
  UploadCloud,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Image as ImageIcon,
  Check,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { formatIDR } from "@/lib/utils/currency";
import { AdminStore, PaymentItem, UserItem } from "@/lib/data/adminStore";

export default function PendingApprovalPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [lastEmail, setLastEmail] = useState<string | null>(null);
  const [payment, setPayment] = useState<PaymentItem | null>(null);
  const [userProfile, setUserProfile] = useState<UserItem | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadedProof, setUploadedProof] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isApproved, setIsApproved] = useState(false);

  const loadData = () => {
    if (typeof window === "undefined") return;
    const email = localStorage.getItem("dicatetin_last_registered_email");
    setLastEmail(email);

    const allPayments = AdminStore.getPayments();
    const allUsers = AdminStore.getUsers();

    let matchingPayment: PaymentItem | undefined;
    let matchingUser: UserItem | undefined;

    if (email) {
      matchingPayment = allPayments.find(
        (p) => p.userEmail.toLowerCase() === email.toLowerCase()
      );
      matchingUser = allUsers.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
    }

    if (!matchingPayment && allPayments.length > 0) {
      matchingPayment = allPayments[0];
    }
    if (!matchingUser && allUsers.length > 0) {
      matchingUser = allUsers.find((u) => u.id === matchingPayment?.userId) || allUsers[0];
    }

    setPayment(matchingPayment || null);
    setUserProfile(matchingUser || null);

    if (matchingPayment?.proofUrl) {
      setUploadedProof(matchingPayment.proofUrl);
    }

    if (matchingUser?.status === "active" || matchingPayment?.status === "paid") {
      setIsApproved(true);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("dicatetin_store_updated", handleUpdate);
    return () => window.removeEventListener("dicatetin_store_updated", handleUpdate);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedProof(dataUrl);

      if (payment) {
        AdminStore.updatePaymentProof(payment.id, dataUrl);
      } else if (lastEmail) {
        AdminStore.updatePaymentProof(lastEmail, dataUrl);
      }

      setUploading(false);
      setStatusMessage("Bukti transfer berhasil diunggah! Admin akan segera memeriksa dan menyetujui akun Anda.");
    };
    reader.readAsDataURL(file);
  };

  const handleCheckStatus = () => {
    loadData();
    const allUsers = AdminStore.getUsers();
    const email = lastEmail || payment?.userEmail;

    const user = allUsers.find((u) => u.email.toLowerCase() === email?.toLowerCase());

    if (user?.status === "active") {
      setIsApproved(true);
      setStatusMessage("Selamat! Akun Anda telah disetujui (ACC) oleh Admin. Mengarahkan ke Beranda...");
      document.cookie = "dicatetin_session=user; path=/; max-age=86400; SameSite=Lax";
      setTimeout(() => {
        router.push("/app");
      }, 1200);
    } else {
      setStatusMessage("Akun masih dalam status menunggu persetujuan admin. Anda bisa konfirmasi bukti transfer di bawah.");
    }
  };

  if (!mounted) {
    return <div className="p-8 text-center text-xs text-text-secondary">Memuat data pendaftaran...</div>;
  }

  if (isApproved) {
    return (
      <Card className="shadow-card border-border max-w-md mx-auto">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-income/15 text-income flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <CardTitle className="text-xl font-bold font-heading text-text-primary">
            Akun Berhasil Disetujui!
          </CardTitle>
          <CardDescription>
            Admin telah menyetujui pendaftaran dan pembayaran Anda. Akun Anda kini aktif penuh.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => {
              document.cookie = "dicatetin_session=user; path=/; max-age=86400; SameSite=Lax";
              router.push("/app");
            }}
            className="w-full font-bold gap-2"
          >
            <span>Masuk ke Dashboard Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card border-border max-w-md mx-auto">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-budgetWarning/15 text-budgetWarning flex items-center justify-center">
          <Clock className="w-6 h-6 animate-pulse" />
        </div>
        <CardTitle className="text-xl font-bold font-heading">
          Konfirmasi Pembayaran & Menunggu ACC
        </CardTitle>
        <CardDescription>
          Pendaftaran Anda telah tercatat. Silakan selesaikan pembayaran dan unggah bukti transfer agar admin dapat langsung mengaktifkan akun Anda.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {statusMessage && (
          <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Order Details */}
        {payment && (
          <div className="p-4 rounded-2xl bg-background border border-border space-y-2.5 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-text-secondary">Pendaftar:</span>
              <strong className="text-text-primary">{payment.userName} ({payment.userEmail})</strong>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Pilihan Paket:</span>
              <Badge variant={payment.planName.toLowerCase() === "pro" ? "gold" : "secondary"}>
                Paket {payment.planName}
              </Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Total Tagihan:</span>
              <strong className="text-base font-extrabold font-heading text-primary tabular-nums">
                {formatIDR(payment.amount)}
              </strong>
            </div>

            <div className="flex justify-between items-center text-[11px] text-text-secondary pt-1 border-t border-border">
              <span>Order ID:</span>
              <span className="font-mono font-bold text-text-primary">{payment.orderId}</span>
            </div>
          </div>
        )}

        {/* Bank Transfer Details */}
        <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
            <Building2 className="w-4 h-4 text-primary" />
            <span>Rekening Resmi Pembayaran (BCA)</span>
          </div>

          <div className="space-y-1.5 text-xs text-text-secondary bg-background p-3.5 rounded-xl border border-border">
            <div className="flex justify-between">
              <span>Nama Bank:</span>
              <strong className="text-text-primary">Bank Central Asia (BCA)</strong>
            </div>
            <div className="flex justify-between items-center">
              <span>Nomor Rekening:</span>
              <div className="flex items-center gap-1.5">
                <strong className="text-text-primary font-heading font-mono text-sm tracking-wider">
                  8831 2948 19
                </strong>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("8831294819");
                    alert("Nomor rekening BCA disalin!");
                  }}
                  className="text-[10px] text-primary hover:underline font-bold px-1.5 py-0.5 rounded bg-primary/10"
                >
                  Salin
                </button>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Atas Nama:</span>
              <strong className="text-text-primary">PT DICATETIN TEKNOLOGI</strong>
            </div>
          </div>
        </div>

        {/* Proof Upload / Confirmation */}
        <div className="space-y-2.5">
          <span className="text-xs font-semibold text-text-secondary block">
            Konfirmasi / Unggah Bukti Struk Transfer:
          </span>

          {uploadedProof ? (
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-income/10 border border-income/20 text-income flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-semibold">Bukti Transfer Terlampir</span>
                </div>
                <Badge variant="income">Terkirim</Badge>
              </div>

              <div className="rounded-xl overflow-hidden border border-border max-h-36 bg-black/5 flex items-center justify-center">
                <img
                  src={uploadedProof}
                  alt="Bukti Transfer"
                  className="max-h-36 object-contain"
                />
              </div>

              <label className="text-[11px] text-primary hover:underline cursor-pointer block text-center font-medium">
                Ganti foto bukti transfer
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-border rounded-2xl hover:border-primary/50 bg-background cursor-pointer transition-colors group">
                <UploadCloud className="w-8 h-8 text-text-secondary group-hover:text-primary transition-colors mb-1.5" />
                <span className="text-xs font-bold text-text-primary">
                  {uploading ? "Mengunggah..." : "Pilih Foto Bukti Transfer"}
                </span>
                <span className="text-[10px] text-text-secondary mt-0.5">
                  Format JPG, PNG atau Screenshot M-Banking
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        {/* Check Status Button */}
        <div className="pt-2 space-y-2">
          <Button
            onClick={handleCheckStatus}
            className="w-full gap-2 text-xs font-bold"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Cek Status Aktivasi Admin</span>
          </Button>

          <Link
            href="/login"
            className="flex items-center justify-center gap-1.5 text-xs text-text-secondary hover:text-text-primary py-1 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Masuk</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
