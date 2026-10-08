"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatIDR } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";
import {
  Check,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building2,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import { AdminStore, PlanItem } from "@/lib/data/adminStore";
import { setAppCookie } from "@/lib/utils/cookies";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultPlanParam = searchParams.get("plan") || "pro";

  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>(defaultPlanParam);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneWa, setPhoneWa] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"midtrans" | "transfer">("transfer");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadedPlans = AdminStore.getPlans().filter((p) => p.isActive);
    setPlans(loadedPlans);
    if (!loadedPlans.some((p) => p.name.toLowerCase() === selectedPlan.toLowerCase()) && loadedPlans.length > 0) {
      setSelectedPlan(loadedPlans[0].name.toLowerCase());
    }
  }, []);

  const activePlanObj = plans.find((p) => p.name.toLowerCase() === selectedPlan.toLowerCase()) || plans[0];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const planAmount = activePlanObj ? activePlanObj.price : 99000;
    const planNameClean = activePlanObj ? activePlanObj.name : "Pro";
    const cleanEmail = email.toLowerCase().trim();

    try {
      const nextExp = new Date();
      nextExp.setDate(nextExp.getDate() + (activePlanObj ? activePlanObj.durationDays : 30));

      // 1. Add user to AdminStore with status: "pending"
      const newAdminUser = AdminStore.addUser({
        name: fullName,
        email: cleanEmail,
        phoneWa: phoneWa,
        plan: planNameClean.toLowerCase(),
        status: "pending",
        role: "user",
        expiresAt: nextExp.toISOString().split("T")[0],
        telegramConnected: false,
        lastActive: "Baru mendaftar",
      });

      // 2. Add pending payment record to AdminStore
      AdminStore.addPayment({
        userId: newAdminUser.id,
        userName: fullName,
        userEmail: cleanEmail,
        phoneWa: phoneWa,
        planName: planNameClean,
        amount: planAmount,
        method: paymentMethod,
        status: "pending",
        orderId: (paymentMethod === "transfer" ? "MAN-" : "MID-") + Date.now().toString().slice(-8),
        createdAt: new Date().toISOString(),
        proofUrl: paymentMethod === "transfer" ? "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60" : undefined,
      });

      // Save reference to last registered email
      if (typeof window !== "undefined") {
        localStorage.setItem("dicatetin_last_registered_email", cleanEmail);
        setAppCookie("dicatetin_session", "pending", 1);
      }

      setTimeout(() => {
        router.push("/menunggu-persetujuan");
      }, 300);
    } catch (err: any) {
      setErrorMessage(err?.message || "Pendaftaran gagal. Silakan periksa kembali data Anda.");
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-card border-border">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold font-heading">
          Daftar Akun Baru
        </CardTitle>
        <CardDescription>
          Pilih paket dan mulai kelola keuanganmu lebih baik
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-expense/10 border border-expense/20 text-expense text-xs">
            {errorMessage}
          </div>
        )}

        {/* Dynamic Plan Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-secondary block">
            Pilihan Paket Berlangganan
          </label>
          <div className={cn("grid gap-3", plans.length > 2 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-2")}>
            {plans.map((plan) => {
              const isSelected = selectedPlan.toLowerCase() === plan.name.toLowerCase();
              const isPro = plan.name.toLowerCase() === "pro";
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.name.toLowerCase())}
                  className={cn(
                    "p-3.5 rounded-2xl border cursor-pointer transition-all relative select-none flex flex-col justify-between",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-subtle ring-1 ring-primary/40"
                      : "border-border bg-background hover:bg-surface"
                  )}
                >
                  {isPro && (
                    <div className="absolute -top-2 -right-2">
                      <Badge variant="gold" className="text-[9px] px-1.5 py-0 shadow-sm">
                        POPULER
                      </Badge>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-heading font-bold text-sm text-text-primary flex items-center gap-1">
                        {plan.name} {isPro && <Sparkles className="w-3.5 h-3.5 text-gold" />}
                      </span>
                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                    <div className="text-base font-extrabold font-heading text-primary">
                      {formatIDR(plan.price)}
                      <span className="text-[10px] font-normal text-text-secondary">/{plan.durationDays} hr</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-1 line-clamp-2">
                    {plan.subtitle || plan.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              Nama Lengkap
            </label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Contoh: Rina Safitri"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-10"
              />
              <User className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              Email Aktif
            </label>
            <div className="relative">
              <Input
                type="email"
                placeholder="rina@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
              <Mail className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              Nomor WhatsApp
            </label>
            <div className="relative">
              <Input
                type="tel"
                placeholder="081234567890"
                required
                value={phoneWa}
                onChange={(e) => setPhoneWa(e.target.value)}
                className="pl-10"
              />
              <Phone className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-secondary">
              Password Baru
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 6 karakter"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
              />
              <Lock className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                className="absolute right-3 top-2.5 p-1 text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-primary" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold text-text-secondary block">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("transfer")}
                className={cn(
                  "flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer",
                  paymentMethod === "transfer"
                    ? "border-primary bg-primary/10 text-primary font-bold"
                    : "border-border bg-background text-text-secondary"
                )}
              >
                <Building2 className="w-4 h-4 shrink-0" />
                <span>Transfer Bank (BCA)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("midtrans")}
                className={cn(
                  "flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer",
                  paymentMethod === "midtrans"
                    ? "border-primary bg-primary/10 text-primary font-bold"
                    : "border-border bg-background text-text-secondary"
                )}
              >
                <CreditCard className="w-4 h-4 shrink-0" />
                <span>QRIS & E-Wallet</span>
              </button>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full font-bold gap-2 mt-2">
            {loading ? "Mendaftarkan..." : "Daftar & Lanjut ke Konfirmasi Pembayaran"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>

        <div className="pt-2 text-center text-xs text-text-secondary">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">
            Masuk di sini
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-text-secondary">Memuat...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
