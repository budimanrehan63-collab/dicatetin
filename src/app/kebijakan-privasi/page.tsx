import React from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Card } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col justify-between">
      <LandingNavbar />
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-6">
        <h1 className="text-3xl font-extrabold font-heading text-text-primary">
          Kebijakan Privasi Dicatetin
        </h1>
        <p className="text-xs text-text-secondary">Terakhir diperbarui: 6 Oktober 2026</p>

        <Card className="p-6 md:p-8 space-y-4 text-xs md:text-sm text-text-secondary leading-relaxed bg-surface border-border">
          <h2 className="font-heading font-bold text-base text-text-primary">
            1. Pengumpulan Informasi
          </h2>
          <p>
            Kami mengumpulkan informasi yang Anda berikan secara langsung saat mendaftar akun Dicatetin, termasuk nama lengkap, alamat email, nomor WhatsApp, dan data transaksi keuangan yang Anda masukkan secara sukarela melalui web atau bot Telegram.
          </p>

          <h2 className="font-heading font-bold text-base text-text-primary">
            2. Penggunaan Data Transaksi & AI
          </h2>
          <p>
            Data catatan teks, voice note, dan foto struk belanja yang Anda kirimkan ke bot Telegram diproses oleh model kecerdasan buatan semata-mata untuk tujuan ekstraksi data keuangan Anda. Kami tidak menggunakan data transaksi pribadi Anda untuk melatih model publik atau menjualnya ke pihak ketiga.
          </p>

          <h2 className="font-heading font-bold text-base text-text-primary">
            3. Keamanan Data
          </h2>
          <p>
            Seluruh data disimpan di database PostgreSQL terenkripsi dengan Row Level Security (RLS). Hanya akun Anda yang memiliki hak akses untuk membaca dan mengubah data keuangan tersebut.
          </p>

          <h2 className="font-heading font-bold text-base text-text-primary">
            4. Hak Pengguna & Penghapusan Data
          </h2>
          <p>
            Anda memiliki hak penuh untuk mengekspor data keuangan Anda dalam format Excel / CSV kapan saja atau meminta penghapusan akun beserta seluruh riwayat transaksi secara permanen.
          </p>
        </Card>
      </main>
      <LandingFooter />
    </div>
  );
}
