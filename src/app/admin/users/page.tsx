"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Plus,
  Mail,
  UserCheck,
  UserX,
  MoreVertical,
  Clock,
  Send,
  Trash2,
  Edit2,
  Calendar,
  KeyRound,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { formatDateID } from "@/lib/utils/date";
import { AdminStore, UserItem } from "@/lib/data/adminStore";
import { setAppCookie } from "@/lib/utils/cookies";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");

  // Modals
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [invitePlan, setInvitePlan] = useState<"basic" | "pro">("pro");
  const [inviteDays, setInviteDays] = useState(30);
  const [generatedInviteLink, setGeneratedInviteLink] = useState<string | null>(null);

  const [extendModalUser, setExtendModalUser] = useState<UserItem | null>(null);
  const [extendDays, setExtendDays] = useState(30);

  const [editUserModal, setEditUserModal] = useState<UserItem | null>(null);
  const [deleteModalUser, setDeleteModalUser] = useState<UserItem | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [addManualModal, setAddManualModal] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualPlan, setManualPlan] = useState<"basic" | "pro">("pro");

  // Active Action Menu Modal/Sheet for 100% visible popover
  const [selectedActionUser, setSelectedActionUser] = useState<UserItem | null>(null);

  const loadUsers = () => {
    setUsers(AdminStore.getUsers());
  };

  useEffect(() => {
    setMounted(true);
    loadUsers();

    const handleUpdate = () => loadUsers();
    window.addEventListener("dicatetin_store_updated", handleUpdate);
    return () => window.removeEventListener("dicatetin_store_updated", handleUpdate);
  }, []);

  // Actions
  const handleAccUser = (userId: string) => {
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    const expiresAt = nextMonth.toISOString().split("T")[0];

    AdminStore.updateUser(userId, { status: "active", expiresAt });
    alert("User berhasil disetujui (ACC) dan langsung berstatus aktif!");
    setSelectedActionUser(null);
  };

  const handleRejectUser = (userId: string) => {
    if (confirm("Apakah Anda yakin ingin menolak pendaftaran user ini?")) {
      AdminStore.deleteUser(userId);
      alert("Pendaftaran user telah ditolak dan dihapus.");
      setSelectedActionUser(null);
    }
  };

  const handleToggleSuspend = (user: UserItem) => {
    const newStatus = user.status === "suspended" ? "active" : "suspended";
    AdminStore.updateUser(user.id, { status: newStatus });
    alert(
      newStatus === "suspended"
        ? `Akun ${user.name} berhasil dibekukan (suspend).`
        : `Akun ${user.name} berhasil diaktifkan kembali.`
    );
    setSelectedActionUser(null);
  };

  const handleExtend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extendModalUser) return;

    const currentExp = new Date(extendModalUser.expiresAt || new Date());
    const newExp = new Date(currentExp);
    newExp.setDate(newExp.getDate() + Number(extendDays));
    const formattedExp = newExp.toISOString().split("T")[0];

    AdminStore.updateUser(extendModalUser.id, {
      expiresAt: formattedExp,
      status: "active",
    });

    alert(`Langganan ${extendModalUser.name} berhasil diperpanjang hingga ${formattedExp}!`);
    setExtendModalUser(null);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUserModal) return;

    AdminStore.updateUser(editUserModal.id, {
      name: editUserModal.name,
      email: editUserModal.email,
      phoneWa: editUserModal.phoneWa,
      plan: editUserModal.plan,
      status: editUserModal.status,
    });

    alert("Data user berhasil diperbarui!");
    setEditUserModal(null);
  };

  const handlePermanentDelete = () => {
    if (!deleteModalUser) return;
    if (deleteConfirmText !== deleteModalUser.name) {
      alert("Nama konfirmasi tidak sesuai.");
      return;
    }

    AdminStore.deleteUser(deleteModalUser.id);
    alert(`User ${deleteModalUser.name} berhasil dihapus permanen!`);
    setDeleteModalUser(null);
    setDeleteConfirmText("");
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const token = "inv-" + Math.random().toString(36).substring(2, 10);
    const link = `${window.location.origin}/undangan/${token}`;

    const nextExp = new Date();
    nextExp.setDate(nextExp.getDate() + Number(inviteDays));

    AdminStore.addUser({
      name: inviteName,
      email: inviteEmail,
      phoneWa: "-",
      plan: invitePlan,
      status: "active",
      role: "user",
      expiresAt: nextExp.toISOString().split("T")[0],
      telegramConnected: false,
      lastActive: "Undangan Terkirim",
    });

    setGeneratedInviteLink(link);
  };

  const handleAddManualUser = (e: React.FormEvent) => {
    e.preventDefault();
    const nextExp = new Date();
    nextExp.setDate(nextExp.getDate() + 30);

    AdminStore.addUser({
      name: manualName,
      email: manualEmail,
      phoneWa: manualPhone || "-",
      plan: manualPlan,
      status: "active",
      role: "user",
      expiresAt: nextExp.toISOString().split("T")[0],
      telegramConnected: false,
      lastActive: "Baru ditambahkan",
    });

    alert("User manual berhasil ditambahkan dan langsung aktif!");
    setAddManualModal(false);
    setManualName("");
    setManualEmail("");
    setManualPhone("");
  };

  const handleImpersonate = (user: UserItem) => {
    setAppCookie("dicatetin_session", "admin", 30);
    setAppCookie("dicatetin_admin_session", "admin", 30);
    setTimeout(() => {
      window.location.href = "/app";
    }, 100);
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.phoneWa.includes(searchQuery);
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    const matchPlan = planFilter === "all" || u.plan.toLowerCase() === planFilter.toLowerCase();
    return matchSearch && matchStatus && matchPlan;
  });

  if (!mounted) {
    return <div className="p-8 text-center text-xs text-text-secondary">Memuat data pengguna...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-text-primary">
            Kelola Pengguna
          </h1>
          <p className="text-xs md:text-sm text-text-secondary mt-1">
            Manajemen akun pendaftar, persetujuan status, perpanjangan, dan kontrol akses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setInviteModalOpen(true)}
            className="gap-1.5 text-xs font-bold"
          >
            <Mail className="w-4 h-4 text-primary" />
            <span>Undang via Email</span>
          </Button>

          <Button
            onClick={() => setAddManualModal(true)}
            className="gap-1.5 text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah User Manual</span>
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-3" />
            <Input
              placeholder="Cari nama, email, no WA..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter status pengguna"
              className="h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Semua Status</option>
              <option value="active">Active (Aktif)</option>
              <option value="pending">Pending (Menunggu ACC)</option>
              <option value="expired">Expired (Habis)</option>
              <option value="suspended">Suspended (Dibekukan)</option>
            </select>

            {/* Plan Filter */}
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              aria-label="Filter paket berlangganan"
              className="h-10 px-3 rounded-xl border border-border bg-background text-xs font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Semua Paket</option>
              <option value="basic">Paket Basic</option>
              <option value="pro">Paket Pro</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto min-h-[280px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface text-text-secondary font-semibold">
                <th className="py-3 px-4">Nama & Email</th>
                <th className="py-3 px-4">Nomor WA</th>
                <th className="py-3 px-4">Paket</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Masa Berlaku</th>
                <th className="py-3 px-4">Telegram</th>
                <th className="py-3 px-4 text-right">Opsi Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-text-secondary">
                    Tidak ada data user yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-text-primary">{user.name}</div>
                      <div className="text-[11px] text-text-secondary">{user.email}</div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-text-secondary">
                      {user.phoneWa}
                    </td>

                    <td className="py-3.5 px-4">
                      <Badge variant={user.plan.toLowerCase() === "pro" ? "gold" : "secondary"}>
                        {user.plan.toUpperCase()}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4">
                      {user.status === "active" && (
                        <Badge variant="income" className="gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-income" />
                          Aktif
                        </Badge>
                      )}
                      {user.status === "pending" && (
                        <Badge variant="warning" className="gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-budgetWarning animate-pulse" />
                          Pending ACC
                        </Badge>
                      )}
                      {user.status === "expired" && (
                        <Badge variant="destructive">Kadaluarsa</Badge>
                      )}
                      {user.status === "suspended" && (
                        <Badge variant="destructive">Suspended</Badge>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-text-secondary">
                      {user.expiresAt ? formatDateID(user.expiresAt) : "-"}
                    </td>

                    <td className="py-3.5 px-4">
                      {user.telegramConnected ? (
                        <span className="text-primary font-medium">
                          @{user.telegramUsername || "Terhubung"}
                        </span>
                      ) : (
                        <span className="text-text-secondary/60">Belum</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {user.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleAccUser(user.id)}
                              title="Setujui (ACC) pendaftar"
                              className="px-2.5 py-1 rounded-lg bg-income text-white hover:bg-income/90 transition-colors text-xs font-bold flex items-center gap-1 shadow-sm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>ACC</span>
                            </button>
                            <button
                              onClick={() => handleRejectUser(user.id)}
                              title="Tolak pendaftar"
                              className="px-2 py-1 rounded-lg bg-expense/10 text-expense hover:bg-expense/20 transition-colors text-xs font-bold"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Tolak</span>
                            </button>
                          </>
                        )}

                        <button
                          onClick={() => setSelectedActionUser(user)}
                          aria-label={`Menu aksi untuk ${user.name}`}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border bg-surface hover:bg-background text-text-primary text-xs font-bold transition-all shadow-subtle hover:border-primary/40 cursor-pointer"
                        >
                          <MoreVertical className="w-3.5 h-3.5 text-primary" />
                          <span>Kelola</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ACTION SHEET / MODAL UNTUK TITIK 3 (100% KELIHATAN & LENGKAP) */}
      {selectedActionUser && (
        <div
          onClick={() => setSelectedActionUser(null)}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-surface border-2 border-border/80 shadow-2xl p-5 space-y-4 cursor-default animate-in zoom-in-95 duration-150 text-left"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div>
                <h3 className="font-heading font-bold text-base text-text-primary">
                  {selectedActionUser.name}
                </h3>
                <p className="text-xs text-text-secondary">{selectedActionUser.email}</p>
              </div>
              <button
                onClick={() => setSelectedActionUser(null)}
                className="p-1.5 rounded-xl hover:bg-background text-text-secondary hover:text-text-primary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <button
                onClick={() => {
                  handleImpersonate(selectedActionUser);
                  setSelectedActionUser(null);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-background hover:bg-primary/10 hover:text-primary transition-all text-xs font-bold text-text-primary border border-border"
              >
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <ExternalLink className="w-4 h-4" />
                </div>
                <div>
                  <div>Masuk sebagai User (Impersonate)</div>
                  <div className="text-[10px] font-normal text-text-secondary">
                    Buka tampilan dashboard user untuk troubleshooting
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setExtendModalUser(selectedActionUser);
                  setSelectedActionUser(null);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-background hover:bg-gold/10 hover:text-gold transition-all text-xs font-bold text-text-primary border border-border"
              >
                <div className="w-8 h-8 rounded-xl bg-gold/15 text-gold flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div>Perpanjang Masa Aktif</div>
                  <div className="text-[10px] font-normal text-text-secondary">
                    Tambah hari langganan manual tanpa bayar
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setEditUserModal(selectedActionUser);
                  setSelectedActionUser(null);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-background hover:bg-surface text-text-primary transition-all text-xs font-bold border border-border"
              >
                <div className="w-8 h-8 rounded-xl bg-surface border border-border text-text-secondary flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <div>Edit Data User</div>
                  <div className="text-[10px] font-normal text-text-secondary">
                    Ubah nama, email, no WA, paket, atau status
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleToggleSuspend(selectedActionUser)}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-background hover:bg-expense/10 hover:text-expense transition-all text-xs font-bold text-text-primary border border-border"
              >
                <div className="w-8 h-8 rounded-xl bg-expense/10 text-expense flex items-center justify-center">
                  <UserX className="w-4 h-4" />
                </div>
                <div>
                  <div>
                    {selectedActionUser.status === "suspended"
                      ? "Buka Blokir (Aktifkan User)"
                      : "Suspend / Bekukan Akun"}
                  </div>
                  <div className="text-[10px] font-normal text-text-secondary">
                    {selectedActionUser.status === "suspended"
                      ? "Izinkan user login kembali"
                      : "Kunci akses user sementara"}
                  </div>
                </div>
              </button>

              <div className="border-t border-border pt-1">
                <button
                  onClick={() => {
                    setDeleteModalUser(selectedActionUser);
                    setSelectedActionUser(null);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-expense/5 hover:bg-expense/15 text-expense transition-all text-xs font-bold border border-expense/20"
                >
                  <div className="w-8 h-8 rounded-xl bg-expense/20 text-expense flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div>Hapus User Permanen</div>
                    <div className="text-[10px] font-normal text-expense/80">
                      Hapus seluruh data & akun secara permanen
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: Invite via Email */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 space-y-4">
            <CardTitle className="text-lg font-bold">Undang Pengguna Baru</CardTitle>
            {generatedInviteLink ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-income/10 border border-income/20 text-income text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Undangan berhasil dibuat dan akun langsung terdaftar!</span>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">
                    Tautan Pendaftaran Langsung:
                  </label>
                  <Input value={generatedInviteLink} readOnly className="text-xs" />
                </div>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedInviteLink);
                    alert("Tautan disalin ke clipboard!");
                  }}
                  className="w-full text-xs font-bold"
                >
                  Salin Tautan Undangan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setInviteModalOpen(false);
                    setGeneratedInviteLink(null);
                  }}
                  className="w-full text-xs"
                >
                  Tutup
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Nama Lengkap</label>
                  <Input
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="Contoh: Rina Safitri"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Email</label>
                  <Input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="rina@gmail.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-secondary">Paket</label>
                    <select
                      value={invitePlan}
                      onChange={(e) => setInvitePlan(e.target.value as any)}
                      aria-label="Pilih paket undangan"
                      className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs"
                    >
                      <option value="basic">Basic</option>
                      <option value="pro">Pro</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-secondary">Durasi (Hari)</label>
                    <Input
                      type="number"
                      value={inviteDays}
                      onChange={(e) => setInviteDays(Number(e.target.value))}
                      min={1}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setInviteModalOpen(false)}
                    className="w-1/2"
                  >
                    Batal
                  </Button>
                  <Button type="submit" className="w-1/2 font-bold">
                    Buat Undangan
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      )}

      {/* MODAL 2: Tambah User Manual */}
      {addManualModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 space-y-4">
            <CardTitle className="text-lg font-bold">Tambah Pengguna Manual</CardTitle>
            <form onSubmit={handleAddManualUser} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Nama Lengkap</label>
                <Input
                  required
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="Nama Lengkap User"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Email Akun</label>
                <Input
                  type="email"
                  required
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  placeholder="user@gmail.com"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Nomor WhatsApp</label>
                <Input
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  placeholder="081234567890"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Pilihan Paket</label>
                <select
                  value={manualPlan}
                  onChange={(e) => setManualPlan(e.target.value as any)}
                  aria-label="Pilih paket user manual"
                  className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs"
                >
                  <option value="basic">Paket Basic (30 Hari)</option>
                  <option value="pro">Paket Pro (30 Hari)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAddManualModal(false)}
                  className="w-1/2"
                >
                  Batal
                </Button>
                <Button type="submit" className="w-1/2 font-bold">
                  Simpan & Aktifkan
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL 3: Perpanjang Manual */}
      {extendModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 space-y-4">
            <CardTitle className="text-lg font-bold">
              Perpanjang Langganan: {extendModalUser.name}
            </CardTitle>
            <form onSubmit={handleExtend} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">
                  Tambah Durasi (Hari)
                </label>
                <Input
                  type="number"
                  min={1}
                  value={extendDays}
                  onChange={(e) => setExtendDays(Number(e.target.value))}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setExtendModalUser(null)}
                  className="w-1/2"
                >
                  Batal
                </Button>
                <Button type="submit" className="w-1/2 font-bold">
                  Perpanjang
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL 4: Edit Data User */}
      {editUserModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 space-y-4">
            <CardTitle className="text-lg font-bold">Edit Data Pengguna</CardTitle>
            <form onSubmit={handleSaveEditUser} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Nama Lengkap</label>
                <Input
                  value={editUserModal.name}
                  onChange={(e) => setEditUserModal({ ...editUserModal, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Email</label>
                <Input
                  value={editUserModal.email}
                  onChange={(e) => setEditUserModal({ ...editUserModal, email: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Nomor WA</label>
                <Input
                  value={editUserModal.phoneWa}
                  onChange={(e) => setEditUserModal({ ...editUserModal, phoneWa: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Paket</label>
                  <select
                    value={editUserModal.plan}
                    onChange={(e) => setEditUserModal({ ...editUserModal, plan: e.target.value })}
                    aria-label="Pilih paket edit"
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs"
                  >
                    <option value="basic">Basic</option>
                    <option value="pro">Pro</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-secondary">Status</label>
                  <select
                    value={editUserModal.status}
                    onChange={(e) =>
                      setEditUserModal({ ...editUserModal, status: e.target.value as any })
                    }
                    aria-label="Pilih status edit"
                    className="w-full h-10 px-3 rounded-xl border border-border bg-background text-xs"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="expired">Expired</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditUserModal(null)}
                  className="w-1/2"
                >
                  Batal
                </Button>
                <Button type="submit" className="w-1/2 font-bold">
                  Simpan
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* MODAL 5: Hapus Permanen */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-md p-6 space-y-4 border-expense/30">
            <div className="flex items-center gap-2 text-expense">
              <AlertTriangle className="w-5 h-5" />
              <CardTitle className="text-base font-bold">Konfirmasi Hapus Permanen</CardTitle>
            </div>
            <p className="text-xs text-text-secondary">
              Tindakan ini tidak dapat dibatalkan. Seluruh data transaksi, dompet, dan riwayat user{" "}
              <strong className="text-text-primary">{deleteModalUser.name}</strong> akan dihapus permanen.
            </p>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">
                Ketik nama <span className="text-expense font-bold">{deleteModalUser.name}</span> untuk konfirmasi:
              </label>
              <Input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder={deleteModalUser.name}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setDeleteModalUser(null)}
                className="w-1/2"
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                disabled={deleteConfirmText !== deleteModalUser.name}
                onClick={handlePermanentDelete}
                className="w-1/2 font-bold"
              >
                Hapus Permanen
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
