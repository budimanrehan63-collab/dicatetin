"use client";

import React, { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSent(true);
      }
    } catch (err: any) {
      setErrorMessage("Gagal mengirim link reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-card border-border">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold font-heading">
          Lupa Password?
        </CardTitle>
        <CardDescription>
          Masukkan email akun Anda untuk menerima tautan reset password.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-expense/10 border border-expense/20 text-expense text-xs">
            {errorMessage}
          </div>
        )}

        {sent ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-income/10 border border-income/20 text-income flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div className="text-xs">
                <p className="font-bold">Link reset terkirim!</p>
                <p className="text-[11px] opacity-90 mt-0.5">
                  Periksa kotak masuk atau folder spam email {email}.
                </p>
              </div>
            </div>

            <Button asChild variant="outline" className="w-full">
              <Link href="/login" className="flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Halaman Masuk</span>
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-3.5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary">
                Email Terdaftar
              </label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="nama@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
                <Mail className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full font-bold">
              {loading ? "Mengirim..." : "Kirim Link Reset"}
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="text-xs text-text-secondary hover:text-text-primary inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Masuk</span>
              </Link>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
