"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ScanLine,
  UploadCloud,
  Camera,
  CheckCircle2,
  Sparkles,
  Edit2,
  Trash2,
  Plus,
  Lock,
  ArrowRight,
  Receipt,
  Store,
  Calendar,
  Wallet,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatIDR } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";

interface ReceiptItem {
  name: string;
  qty: number;
  price: number;
  subtotal: number;
}

export default function UserScanPage() {
  const isPro = true; // In real app, verified via profile/hasFeature

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);

  // Review Form State
  const [merchant, setMerchant] = useState("Indomaret Tebet Raya");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState("Belanja Harian");
  const [wallet, setWallet] = useState("BCA");
  const [items, setItems] = useState<ReceiptItem[]>([
    { name: "Susu UHT Full Cream 1L", qty: 2, price: 21500, subtotal: 43000 },
    { name: "Roti Tawar Gandum", qty: 1, price: 18500, subtotal: 18500 },
    { name: "Minyak Goreng 2L", qty: 1, price: 38000, subtotal: 38000 },
    { name: "Sabun Mandi Refill", qty: 2, price: 29000, subtotal: 58000 },
  ]);

  const totalAmount = items.reduce((acc, curr) => acc + curr.subtotal, 0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setScanning(true);

    // Simulate AI Vision OCR processing
    setTimeout(() => {
      setScanning(false);
      setReviewMode(true);
    }, 1800);
  };

  const handleItemChange = (index: number, field: keyof ReceiptItem, val: any) => {
    const updated = [...items];
    (updated[index] as any)[field] = val;
    if (field === "qty" || field === "price") {
      updated[index].subtotal = updated[index].qty * updated[index].price;
    }
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([...items, { name: "Item Baru", qty: 1, price: 0, subtotal: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSaveTransaction = () => {
    alert(`Transaksi ${merchant} senilai ${formatIDR(totalAmount)} berhasil dicatat bersama ${items.length} item rincian!`);
    setReviewMode(false);
    setImagePreview(null);
  };

  if (!isPro) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-gold/15 text-gold flex items-center justify-center mx-auto shadow-subtle">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold font-heading text-text-primary">
            Fitur Scan Struk AI Khusus Member Pro
          </h2>
          <p className="text-xs md:text-sm text-text-secondary max-w-md mx-auto mt-2">
            Otomatisasi pencatatan belanja minimarket dan restoran dengan teknologi AI Vision mutakhir.
          </p>
        </div>

        <Button asChild size="lg" variant="gold" className="gap-2 font-bold">
          <Link href="/app/pengaturan">
            <Sparkles className="w-5 h-5" />
            <span>Upgrade ke Paket Pro (Rp99rb/bln)</span>
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold font-heading tracking-tight text-text-primary">
            Scan Struk Belanja (AI Vision)
          </h1>
          <Badge variant="gold">PRO FITUR</Badge>
        </div>
        <p className="text-xs md:text-sm text-text-secondary mt-1">
          Unggah atau ambil foto struk nota Anda. AI akan membaca toko, tanggal, item rincian, dan total otomatis.
        </p>
      </div>

      {!reviewMode ? (
        <Card className="p-8 md:p-12 text-center border-dashed border-2 border-border bg-surface/40 hover:bg-surface/70 transition-all rounded-3xl">
          {scanning ? (
            <div className="space-y-4 py-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto animate-pulse">
                <Sparkles className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="font-heading font-bold text-lg text-text-primary">
                  AI Sedang Membaca Struk Anda...
                </h3>
                <p className="text-xs text-text-secondary">
                  Mengekstrak nama toko, tanggal, rincian barang, dan nominal total.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-subtle">
                <ScanLine className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="font-heading font-bold text-lg text-text-primary">
                  Pilih atau Ambil Foto Struk Belanja
                </h3>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  Mendukung nota Indomaret, Alfamart, Hypermart, cafe, SPBU, dan struk restoran.
                </p>
              </div>

              <label className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm cursor-pointer hover:bg-primary-hover transition-colors shadow-subtle">
                <Camera className="w-4 h-4" />
                <span>Upload / Ambil Foto Struk</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </Card>
      ) : (
        /* Review & Edit Screen */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          {/* Photo Preview on Left */}
          <Card className="p-4 space-y-3 flex flex-col items-center">
            <span className="text-xs font-bold text-text-secondary uppercase self-start">
              Foto Struk
            </span>
            <div className="w-full h-80 rounded-2xl overflow-hidden bg-black/10 border border-border flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Struk Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Receipt className="w-12 h-12 text-text-secondary/40" />
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setReviewMode(false);
                setImagePreview(null);
              }}
              className="w-full text-xs"
            >
              Scan Ulang Foto Lain
            </Button>
          </Card>

          {/* Editable Items & Form on Right */}
          <Card className="lg:col-span-2 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <CardTitle className="text-base font-bold">Review Hasil Pembacaan AI</CardTitle>
              </div>
              <Badge variant="income">Akurasi 98%</Badge>
            </div>

            {/* Merchant, Date, Wallet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Nama Toko</label>
                <Input
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Tanggal Belanja</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Kategori Pos</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium text-text-primary"
                >
                  <option value="Belanja Harian">Belanja Harian</option>
                  <option value="Makan & Minum">Makan & Minum</option>
                  <option value="Rumah Tangga">Rumah Tangga</option>
                  <option value="Kesehatan">Kesehatan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Dibayar Lewat</label>
                <select
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium text-text-primary"
                >
                  <option value="BCA">BCA</option>
                  <option value="Tunai">Tunai</option>
                  <option value="GoPay">GoPay</option>
                </select>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary">Rincian Barang Belanjaan:</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleAddItem}
                  className="h-7 text-xs text-primary font-bold gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Item</span>
                </Button>
              </div>

              <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden bg-background">
                {items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center gap-2 text-xs">
                    <Input
                      value={item.name}
                      onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                      className="h-8 text-xs flex-1"
                    />
                    <Input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => handleItemChange(idx, "qty", Number(e.target.value))}
                      className="h-8 text-xs w-14 text-center"
                    />
                    <Input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(idx, "price", Number(e.target.value))}
                      className="h-8 text-xs w-24 text-right"
                    />
                    <div className="w-24 text-right font-heading font-bold text-text-primary tabular-nums">
                      {formatIDR(item.subtotal)}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveItem(idx)}
                      className="h-7 w-7 p-0 text-expense"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Total and Submit */}
            <div className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between">
              <div>
                <span className="text-xs text-text-secondary">Total Struk (Terhitung):</span>
                <div className="text-2xl font-extrabold font-heading text-expense">
                  {formatIDR(totalAmount)}
                </div>
              </div>

              <Button
                onClick={handleSaveTransaction}
                size="lg"
                className="gap-2 font-bold"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Transaksi Struk</span>
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
