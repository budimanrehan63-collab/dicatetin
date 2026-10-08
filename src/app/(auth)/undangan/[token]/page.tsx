"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Lock, ArrowRight, CheckCircle, Eye, EyeOff } from "lucide-react";

export default function InvitationAcceptPage() {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAcceptInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      // Simulate token redemption & password setup
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          router.push("/app");
        }, 1500);
      }, 1000);
    } catch (err: any) {
      setErrorMessage("Token undangan tidak valid atau sudah kadaluarsa.");
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-card border-border">
      <CardHeader className="text-center space-y-1">
        <div className="mx-auto w-10 h-10 rounded-2xl bg-gold/15 text-gold flex items-center justify-center mb-1">
          <Sparkles className="w-5 h-5" />
        </div>
        <CardTitle className="text-2xl font-bold font-heading">
          Aktivasi Undangan Spesial
        </CardTitle>
        <CardDescription>
          Anda diundang untuk bergabung dengan Dicatetin. Buat password Anda untuk langsung mengaktifkan akun.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-expense/10 border border-expense/20 text-expense text-xs">
            {errorMessage}
          </div>
        )}

        {success ? (
          <div className="p-4 rounded-2xl bg-income/10 border border-income/20 text-income flex items-center gap-3">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <div className="text-xs font-semibold">
              Akun berhasil diaktifkan! Mengarahkan ke Beranda...
            </div>
          </div>
        ) : (
          <form onSubmit={handleAcceptInvite} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary">
                Buat Password Baru
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

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary">
                Ulangi Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ulangi password"
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <Lock className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
                  className="absolute right-3 top-2.5 p-1 text-text-secondary hover:text-text-primary transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-primary" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full font-bold gap-2">
              {loading ? "Mengaktifkan Akun..." : "Aktifkan Akun & Mulai"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
