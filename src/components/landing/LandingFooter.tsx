import React from "react";
import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { MessageCircle, Mail, ShieldCheck } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-surface/50 pt-16 pb-12 text-text-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-2">
            <Logo size="md" href="/" />
            <p className="text-xs md:text-sm text-text-secondary max-w-sm leading-relaxed">
              Dicatetin adalah web app manajemen keuangan pribadi dengan integrasi Bot Telegram & AI Multimodal. Membantu Anda mengetahui ke mana setiap rupiah pergi secepat mengirim pesan chat.
            </p>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Privasi dan enkripsi data berstandar internasional.</span>
            </div>
          </div>

          {/* Col 2: Navigasi */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-text-primary">
              Navigasi
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#fitur" className="hover:text-primary transition-colors">
                  Fitur Unggulan
                </a>
              </li>
              <li>
                <a href="#cara-kerja" className="hover:text-primary transition-colors">
                  Cara Kerja
                </a>
              </li>
              <li>
                <a href="#harga" className="hover:text-primary transition-colors">
                  Paket Langganan
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-primary transition-colors">
                  Pertanyaan Umum (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Kontak */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-text-primary">
              Legal & Bantuan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/kebijakan-privasi"
                  className="hover:text-primary transition-colors"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  href="/syarat-ketentuan"
                  className="hover:text-primary transition-colors"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/6281298765432"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-income" />
                  <span>CS WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <p>&copy; {new Date().getFullYear()} Dicatetin.id. Seluruh hak cipta dilindungi undang-undang.</p>
          <p className="text-[11px] text-text-secondary/80">
            Dibuat dengan bangga untuk masyarakat Indonesia &middot; Zona Waktu Asia/Jakarta (WIB)
          </p>
        </div>
      </div>
    </footer>
  );
}
