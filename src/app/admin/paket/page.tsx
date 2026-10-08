"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Check,
  Edit2,
  Sparkles,
  Shield,
  Trash2,
  CheckCircle2,
  Tag,
  Sliders,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatIDR } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";
import { AdminStore, PlanItem, FeatureItem } from "@/lib/data/adminStore";

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [allFeatures, setAllFeatures] = useState<FeatureItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);
  const [newPlanModal, setNewPlanModal] = useState(false);

  // New Custom Feature Modal
  const [newFeatureModal, setNewFeatureModal] = useState(false);
  const [newFeatureCode, setNewFeatureCode] = useState("");
  const [newFeatureLabel, setNewFeatureLabel] = useState("");

  // New Plan form state
  const [newPlanName, setNewPlanName] = useState("");
  const [newPlanSubtitle, setNewPlanSubtitle] = useState("");
  const [newPlanPrice, setNewPlanPrice] = useState(149000);
  const [newPlanDays, setNewPlanDays] = useState(30);
  const [newPlanDescription, setNewPlanDescription] = useState("");
  const [newPlanQuota, setNewPlanQuota] = useState(500);
  const [newPlanFeatures, setNewPlanFeatures] = useState<string[]>(["budget", "export"]);

  const loadData = () => {
    setPlans(AdminStore.getPlans());
    setAllFeatures(AdminStore.getFeatures());
  };

  useEffect(() => {
    setMounted(true);
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("dicatetin_store_updated", handleUpdate);
    return () => window.removeEventListener("dicatetin_store_updated", handleUpdate);
  }, []);

  // Feature toggle inside editing modal
  const handleToggleFeature = (featureCode: string) => {
    if (!editingPlan) return;
    const exists = editingPlan.features.includes(featureCode);
    const updatedFeatures = exists
      ? editingPlan.features.filter((f) => f !== featureCode)
      : [...editingPlan.features, featureCode];
    setEditingPlan({ ...editingPlan, features: updatedFeatures });
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    AdminStore.updatePlan(editingPlan.id, editingPlan);
    alert(`Paket ${editingPlan.name} dan hak akses fitur berhasil diperbarui & tersimpan permanen!`);
    setEditingPlan(null);
  };

  const handleCreateNewFeature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeatureCode || !newFeatureLabel) return;

    const formattedCode = newFeatureCode.toLowerCase().trim().replace(/[^a-z0-9_]/g, "_");

    AdminStore.addFeature({
      code: formattedCode,
      label: newFeatureLabel.trim(),
      isCustom: true,
    });

    alert(`Fitur kustom "${newFeatureLabel}" berhasil ditambahkan! Anda sekarang dapat mencentangnya di paket mana pun.`);
    setNewFeatureCode("");
    setNewFeatureLabel("");
    setNewFeatureModal(false);
  };

  const handleDeleteFeature = (code: string, label: string) => {
    if (confirm(`Hapus fitur "${label}"? Fitur ini akan dinonaktifkan dari seluruh paket.`)) {
      AdminStore.deleteFeature(code);
      alert(`Fitur "${label}" berhasil dihapus.`);
    }
  };

  const handleCreateNewPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName) return;

    AdminStore.addPlan({
      name: newPlanName,
      subtitle: newPlanSubtitle || "Paket tambahan",
      price: Number(newPlanPrice),
      durationDays: Number(newPlanDays),
      description: newPlanDescription || "Deskripsi paket langganan kustom.",
      ctaText: "Mulai Berlangganan",
      aiQuotaMonthly: Number(newPlanQuota),
      isActive: true,
      features: newPlanFeatures,
    });

    alert(`Paket langganan baru "${newPlanName}" berhasil dibuat dan tersimpan!`);
    setNewPlanModal(false);
    setNewPlanName("");
    setNewPlanSubtitle("");
    setNewPlanDescription("");
  };

  const handleDeletePlan = (id: string, name: string) => {
    if (confirm(`Hapus paket "${name}" secara permanen?`)) {
      AdminStore.deletePlan(id);
      alert(`Paket "${name}" telah dihapus.`);
    }
  };

  if (!mounted) {
    return <div className="p-8 text-center text-xs text-text-secondary">Memuat data paket...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-text-primary">
            Kelola Paket Langganan & Fitur
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            Atur harga, nama, deskripsi kustom, durasi hari, kuota AI bulanan, dan buat fitur custom baru.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setNewFeatureModal(true)}
            className="gap-1.5 text-xs font-bold"
          >
            <Tag className="w-4 h-4 text-gold" />
            <span>Tambah Fitur Kustom</span>
          </Button>

          <Button
            onClick={() => setNewPlanModal(true)}
            className="gap-1.5 text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Paket Baru</span>
          </Button>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="p-6 space-y-4 relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold font-heading text-text-primary">
                      {plan.name}
                    </h3>
                    {plan.name.toLowerCase() === "pro" && <Badge variant="gold">POPULER</Badge>}
                  </div>
                  {plan.subtitle && (
                    <p className="text-xs text-primary font-medium mt-0.5">{plan.subtitle}</p>
                  )}
                  <p className="text-xs text-text-secondary mt-1">{plan.description}</p>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingPlan(plan)}
                    className="gap-1.5 text-xs font-bold"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Button>
                  {plans.length > 2 && (
                    <button
                      onClick={() => handleDeletePlan(plan.id, plan.name)}
                      className="p-1.5 rounded-lg hover:bg-expense/10 text-text-secondary hover:text-expense transition-colors"
                      title="Hapus paket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-background border border-border flex items-center justify-between">
                <div>
                  <span className="text-xs text-text-secondary">Harga Langganan:</span>
                  <div className="text-2xl font-extrabold font-heading text-text-primary">
                    {formatIDR(plan.price)}
                    <span className="text-xs font-normal text-text-secondary">
                      /{plan.durationDays} hari
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-text-secondary">Kuota AI:</span>
                  <div className="font-heading font-bold text-sm text-gold">
                    {plan.aiQuotaMonthly > 0 ? `${plan.aiQuotaMonthly} aksi/bln` : "Tanpa AI"}
                  </div>
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Daftar Hak Akses Fitur ({plan.features.length})
                </div>
                <div className="space-y-1.5">
                  {allFeatures.map((feat) => {
                    const hasFeat = plan.features.includes(feat.code);
                    return (
                      <div
                        key={feat.code}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-xl text-xs transition-colors",
                          hasFeat
                            ? "bg-primary/5 text-text-primary font-medium"
                            : "opacity-40 text-text-secondary"
                        )}
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full flex items-center justify-center shrink-0",
                            hasFeat
                              ? "bg-primary text-primary-foreground"
                              : "border border-border"
                          )}
                        >
                          {hasFeat && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{feat.label}</span>
                        {feat.isCustom && (
                          <span className="text-[9px] px-1 py-0 rounded bg-gold/15 text-gold font-bold ml-auto">
                            CUSTOM
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-text-secondary">
              <span>Status Paket:</span>
              <Badge variant={plan.isActive ? "income" : "destructive"}>
                {plan.isActive ? "Aktif Ditawarkan" : "Non-aktif"}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Custom Features Management Section */}
      <Card className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              <span>Daftar Seluruh Fitur Sistem ({allFeatures.length})</span>
            </CardTitle>
            <p className="text-xs text-text-secondary mt-0.5">
              Kelola master fitur yang dapat dicentang pada setiap paket langganan.
            </p>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setNewFeatureModal(true)}
            className="gap-1.5 text-xs font-bold self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Fitur Baru</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allFeatures.map((feat) => (
            <div
              key={feat.code}
              className="p-3.5 rounded-2xl bg-background border border-border flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-text-primary flex items-center gap-1.5">
                  <span>{feat.label}</span>
                  {feat.isCustom && (
                    <Badge variant="gold" className="text-[9px] px-1 py-0">
                      Custom
                    </Badge>
                  )}
                </div>
                <div className="font-mono text-[11px] text-text-secondary mt-0.5">
                  Kode: {feat.code}
                </div>
              </div>

              {feat.isCustom && (
                <button
                  onClick={() => handleDeleteFeature(feat.code, feat.label)}
                  title="Hapus fitur custom"
                  className="p-1.5 rounded-lg hover:bg-expense/10 text-text-secondary hover:text-expense transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* MODAL 1: Edit Paket */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <Card className="w-full max-w-xl p-6 space-y-4 my-8">
            <CardTitle className="text-lg font-bold font-heading">
              Edit Paket: {editingPlan.name}
            </CardTitle>
            <form onSubmit={handleSavePlan} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">
                    Nama Paket
                  </label>
                  <Input
                    required
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">
                    Sub-Judul / Tagline Kustom
                  </label>
                  <Input
                    placeholder="Contoh: Paling hemat untuk pemula"
                    value={editingPlan.subtitle || ""}
                    onChange={(e) => setEditingPlan({ ...editingPlan, subtitle: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">
                    Harga (IDR)
                  </label>
                  <Input
                    type="number"
                    required
                    value={editingPlan.price}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, price: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">
                    Durasi (Hari)
                  </label>
                  <Input
                    type="number"
                    required
                    value={editingPlan.durationDays}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, durationDays: Number(e.target.value) })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">
                    Kuota AI / Bulan
                  </label>
                  <Input
                    type="number"
                    value={editingPlan.aiQuotaMonthly}
                    onChange={(e) =>
                      setEditingPlan({ ...editingPlan, aiQuotaMonthly: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">
                  Deskripsi Kustom
                </label>
                <textarea
                  rows={3}
                  value={editingPlan.description}
                  onChange={(e) =>
                    setEditingPlan({ ...editingPlan, description: e.target.value })
                  }
                  className="w-full p-3 rounded-xl border border-border bg-background text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Feature Flags Checkboxes */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary block">
                  Centang Hak Akses Fitur (Feature Flags)
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto p-3 rounded-xl border border-border bg-surface">
                  {allFeatures.map((feat) => {
                    const isChecked = editingPlan.features.includes(feat.code);
                    return (
                      <label
                        key={feat.code}
                        className="flex items-center gap-2 text-xs cursor-pointer select-none hover:text-primary transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleFeature(feat.code)}
                          className="w-4 h-4 rounded text-primary focus:ring-primary/20 cursor-pointer"
                        />
                        <span className="font-medium">{feat.label}</span>
                        {feat.isCustom && (
                          <span className="text-[9px] px-1 rounded bg-gold/15 text-gold">
                            CUSTOM
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingPlan(null)}
                  className="w-1/2"
                >
                  Batal
                </Button>
                <Button type="submit" className="w-1/2 font-bold">
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL 2: Tambah Fitur Kustom Baru */}
      {newFeatureModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 space-y-4">
            <CardTitle className="text-lg font-bold font-heading">
              Tambah Fitur Kustom Baru
            </CardTitle>
            <p className="text-xs text-text-secondary">
              Buat kode fitur baru (misal: `pdf_export`, `family_sharing`, `consultation`) untuk dimasukkan ke paket langganan.
            </p>
            <form onSubmit={handleCreateNewFeature} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">
                  Nama Fitur (Tampil di UI)
                </label>
                <Input
                  required
                  placeholder="Contoh: Konsultasi Finansial 1-on-1 Bulanan"
                  value={newFeatureLabel}
                  onChange={(e) => setNewFeatureLabel(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">
                  Kode Unik Fitur (System Code)
                </label>
                <Input
                  required
                  placeholder="Contoh: financial_consultation"
                  value={newFeatureCode}
                  onChange={(e) => setNewFeatureCode(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewFeatureModal(false)}
                  className="w-1/2"
                >
                  Batal
                </Button>
                <Button type="submit" className="w-1/2 font-bold">
                  Simpan Fitur
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL 3: Tambah Paket Baru */}
      {newPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <Card className="w-full max-w-xl p-6 space-y-4 my-8">
            <CardTitle className="text-lg font-bold font-heading">
              Tambah Paket Langganan Baru
            </CardTitle>
            <form onSubmit={handleCreateNewPlan} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">
                    Nama Paket
                  </label>
                  <Input
                    required
                    placeholder="Contoh: Keluarga / Enterprise"
                    value={newPlanName}
                    onChange={(e) => setNewPlanName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">
                    Sub-Judul / Tagline
                  </label>
                  <Input
                    placeholder="Contoh: Untuk pengelolaan bersama keluarga"
                    value={newPlanSubtitle}
                    onChange={(e) => setNewPlanSubtitle(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">
                    Harga (IDR)
                  </label>
                  <Input
                    type="number"
                    required
                    value={newPlanPrice}
                    onChange={(e) => setNewPlanPrice(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">
                    Durasi (Hari)
                  </label>
                  <Input
                    type="number"
                    required
                    value={newPlanDays}
                    onChange={(e) => setNewPlanDays(Number(e.target.value))}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">
                    Kuota AI Bulanan
                  </label>
                  <Input
                    type="number"
                    value={newPlanQuota}
                    onChange={(e) => setNewPlanQuota(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">
                  Deskripsi Paket
                </label>
                <textarea
                  rows={3}
                  placeholder="Deskripsikan keunggulan paket ini..."
                  value={newPlanDescription}
                  onChange={(e) => setNewPlanDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border bg-background text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* Select features */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary block">
                  Pilih Fitur yang Didapat
                </label>
                <div className="space-y-2 max-h-40 overflow-y-auto p-3 rounded-xl border border-border bg-surface">
                  {allFeatures.map((feat) => {
                    const isChecked = newPlanFeatures.includes(feat.code);
                    return (
                      <label
                        key={feat.code}
                        className="flex items-center gap-2 text-xs cursor-pointer select-none hover:text-primary transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setNewPlanFeatures(newPlanFeatures.filter((f) => f !== feat.code));
                            } else {
                              setNewPlanFeatures([...newPlanFeatures, feat.code]);
                            }
                          }}
                          className="w-4 h-4 rounded text-primary focus:ring-primary/20 cursor-pointer"
                        />
                        <span className="font-medium">{feat.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewPlanModal(false)}
                  className="w-1/2"
                >
                  Batal
                </Button>
                <Button type="submit" className="w-1/2 font-bold">
                  Buat & Simpan Paket
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
