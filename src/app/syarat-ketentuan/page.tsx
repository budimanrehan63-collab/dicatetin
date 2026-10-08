import React from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Card } from "@/components/ui/card";

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between">
      <LandingNavbar />
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <h1 className="text-3xl font-extrabold font-heading text-text-primary">
          Syarat & Ketentuan Layanan
        </h1>
        <p className="text-xs text-text-secondary">Terakhir diperbarui: 6 Oktober 2026</p>

        <Card className="p-6 md:p-8 space-y-4 text-xs md:text-sm text-text-secondary leading-relaxed bg-surface border-border">
          <h2 className="font-heading font-bold text-base text-text-primary">
            1. Ketentuan Umum & Pendaftaran
          </h2>
          <p>
            Dengan mendaftar dan menggunakan layanan Dicatetin, Anda menyetujui untuk memberikan informasi yang akurat dan bertanggung jawab atas kerahasiaan kata sandi serta keamanan akun Anda.
          </p>

          <h2 className="font-heading font-bold text-base text-text-primary">
            2. Paket Langganan & Kebijakan Fair Use
          </h2>
          <p>
            Layanan Dicatetin disediakan berdasarkan paket bulanan (Basic dan Pro). Paket Pro mencakup kuota Fair Use pemrosesan AI hingga 300 aksi per bulan (mencakup pembacaan teks, transkripsi voice note, dan scan struk).
          </p>

          <h2 className="font-heading font-bold text-base text-text-primary">
            3. Pembatalan & Pengembalian Dana
          </h2>
          <p>
            Langganan dapat dibatalkan kapan saja sebelum periode penagihan berikutnya. Setelah periode langganan berakhir, akun akan beralih ke status non-aktif/expired namun data Anda tetap tersimpan dan dapat diekspor.
          </p>

          <h2 className="font-heading font-bold text-base text-text-primary">
            4. Batasan Tanggung Jawab
          </h2>
          <p>
            Dicatetin adalah alat bantu pencatatan keuangan pribadi dan bukan merupakan penasihat keuangan berlisensi. Kami tidak bertanggung jawab atas keputusan investasi atau finansial pribadi yang Anda ambil.
          </p>
        </Card>
      </main>
      <LandingFooter />
    </div>
  );
}
