"use client";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  phoneWa: string;
  plan: string;
  status: "pending" | "active" | "suspended" | "expired";
  role?: "user" | "admin" | "superadmin";
  expiresAt: string;
  telegramConnected: boolean;
  telegramUsername?: string;
  lastActive: string;
}

export interface PaymentItem {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  phoneWa: string;
  planName: string;
  amount: number;
  method: "midtrans" | "transfer";
  status: "paid" | "pending" | "rejected";
  orderId: string;
  createdAt: string;
  proofUrl?: string;
}

export interface PlanItem {
  id: string;
  name: string;
  subtitle?: string;
  price: number;
  durationDays: number;
  description: string;
  ctaText?: string;
  aiQuotaMonthly: number;
  isActive: boolean;
  features: string[];
}

export interface FeatureItem {
  code: string;
  label: string;
  description?: string;
  isCustom?: boolean;
}

// Default initial state
const DEFAULT_PLANS: PlanItem[] = [
  {
    id: "plan-1",
    name: "Basic",
    subtitle: "Untuk pencatatan personal mandiri",
    price: 59000,
    durationDays: 30,
    description: "Pencatatan manual lengkap via web dashboard, multi-wallet & export laporan Excel/CSV.",
    ctaText: "Pilih Paket Basic",
    aiQuotaMonthly: 0,
    isActive: true,
    features: ["budget", "export"],
  },
  {
    id: "plan-2",
    name: "Pro",
    subtitle: "Paling hemat & lengkap dengan AI",
    price: 99000,
    durationDays: 30,
    description: "Semua fitur Basic + Bot Telegram AI, Voice Note transkripsi, OCR Scan Struk & AI Financial Insight.",
    ctaText: "Mulai Berlangganan Pro",
    aiQuotaMonthly: 300,
    isActive: true,
    features: ["budget", "export", "telegram", "ai_chat", "ai_voice", "ai_scan", "ai_insight"],
  },
];

const DEFAULT_FEATURES: FeatureItem[] = [
  { code: "budget", label: "Budgeting & Peringatan Batas Kategori (80% & 100%)" },
  { code: "export", label: "Export Excel (.xlsx) & CSV Siap Google Sheets" },
  { code: "telegram", label: "Koneksi Bot Telegram Bersama (6-digit Linking)" },
  { code: "ai_chat", label: "Catat Teks Chat AI (Natural Language Processing)" },
  { code: "ai_voice", label: "Catat Voice Note AI (Transkripsi Suara Otomatis)" },
  { code: "ai_scan", label: "Scan Struk & Nota AI (OCR Multimodal Detail Item)" },
  { code: "ai_insight", label: "Ringkasan Finansial & AI Insight Pengeluaran" },
];

const DEFAULT_USERS: UserItem[] = [
  {
    id: "usr-admin-1",
    name: "Fauzy Pratama",
    email: "fauzymnf29@gmail.com",
    phoneWa: "081298765432",
    plan: "pro",
    status: "active",
    role: "superadmin",
    expiresAt: "2099-12-31",
    telegramConnected: true,
    telegramUsername: "fauzymnf",
    lastActive: "Baru saja",
  },
  {
    id: "usr-demo-1",
    name: "Rina Safitri",
    email: "rina.safitri@gmail.com",
    phoneWa: "081344556677",
    plan: "pro",
    status: "pending",
    role: "user",
    expiresAt: "2026-11-06",
    telegramConnected: false,
    lastActive: "2026-10-06 11:20",
  },
  {
    id: "usr-demo-2",
    name: "Budi Santoso",
    email: "budi.santoso@yahoo.com",
    phoneWa: "085611223344",
    plan: "basic",
    status: "active",
    role: "user",
    expiresAt: "2026-11-05",
    telegramConnected: false,
    lastActive: "2026-10-06 09:10",
  },
];

const DEFAULT_PAYMENTS: PaymentItem[] = [
  {
    id: "pay-1",
    userId: "usr-demo-1",
    userName: "Rina Safitri",
    userEmail: "rina.safitri@gmail.com",
    phoneWa: "081344556677",
    planName: "Pro",
    amount: 99000,
    method: "transfer",
    status: "pending",
    orderId: "MAN-20261006-001",
    createdAt: "2026-10-06T10:30:00Z",
    proofUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: "pay-2",
    userId: "usr-demo-2",
    userName: "Budi Santoso",
    userEmail: "budi.santoso@yahoo.com",
    phoneWa: "085611223344",
    planName: "Basic",
    amount: 59000,
    method: "midtrans",
    status: "paid",
    orderId: "MID-20261005-002",
    createdAt: "2026-10-05T14:20:00Z",
  },
];

const STORAGE_KEYS = {
  USERS: "dicatetin_store_users_v2",
  PAYMENTS: "dicatetin_store_payments_v2",
  PLANS: "dicatetin_store_plans_v2",
  FEATURES: "dicatetin_store_features_v2",
};

// Safe client-side storage helpers
function getStoredItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Trigger custom event so other components in the same tab update reactively
    window.dispatchEvent(new Event("dicatetin_store_updated"));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

export const AdminStore = {
  // Users
  getUsers(): UserItem[] {
    return getStoredItem<UserItem[]>(STORAGE_KEYS.USERS, DEFAULT_USERS);
  },

  saveUsers(users: UserItem[]): void {
    setStoredItem(STORAGE_KEYS.USERS, users);
  },

  addUser(user: Omit<UserItem, "id">): UserItem {
    const users = this.getUsers();
    const newUser: UserItem = {
      ...user,
      id: `usr-${Date.now()}`,
    };
    const updated = [newUser, ...users];
    this.saveUsers(updated);
    return newUser;
  },

  updateUser(id: string, updates: Partial<UserItem>): void {
    const users = this.getUsers();
    const updated = users.map((u) => (u.id === id ? { ...u, ...updates } : u));
    this.saveUsers(updated);
  },

  deleteUser(id: string): void {
    const users = this.getUsers();
    const updated = users.filter((u) => u.id !== id);
    this.saveUsers(updated);
  },

  // Payments
  getPayments(): PaymentItem[] {
    return getStoredItem<PaymentItem[]>(STORAGE_KEYS.PAYMENTS, DEFAULT_PAYMENTS);
  },

  savePayments(payments: PaymentItem[]): void {
    setStoredItem(STORAGE_KEYS.PAYMENTS, payments);
  },

  addPayment(payment: Omit<PaymentItem, "id">): PaymentItem {
    const payments = this.getPayments();
    const newPayment: PaymentItem = {
      ...payment,
      id: `pay-${Date.now()}`,
    };
    const updated = [newPayment, ...payments];
    this.savePayments(updated);
    return newPayment;
  },

  updatePaymentStatus(id: string, status: "paid" | "rejected"): void {
    const payments = this.getPayments();
    let approvedUserEmail: string | null = null;
    let approvedPlanName: string | null = null;

    const updatedPayments = payments.map((p) => {
      if (p.id === id) {
        if (status === "paid") {
          approvedUserEmail = p.userEmail;
          approvedPlanName = p.planName;
        }
        return { ...p, status };
      }
      return p;
    });

    this.savePayments(updatedPayments);

    // If approved, automatically activate the corresponding user!
    if (status === "paid" && approvedUserEmail) {
      const users = this.getUsers();
      const nextMonth = new Date();
      nextMonth.setDate(nextMonth.getDate() + 30);
      const expiresAt = nextMonth.toISOString().split("T")[0];

      const updatedUsers = users.map((u) => {
        if (u.email.toLowerCase() === approvedUserEmail!.toLowerCase()) {
          return {
            ...u,
            status: "active" as const,
            expiresAt,
            plan: approvedPlanName?.toLowerCase() || u.plan,
          };
        }
        return u;
      });
      this.saveUsers(updatedUsers);
    }
  },

  updatePaymentProof(identifier: string, proofUrl: string): void {
    const payments = this.getPayments();
    const updated = payments.map((p) => {
      if (p.id === identifier || p.userEmail.toLowerCase() === identifier.toLowerCase() || p.orderId === identifier) {
        return { ...p, proofUrl };
      }
      return p;
    });
    this.savePayments(updated);
  },

  deletePayment(id: string): void {
    const payments = this.getPayments();
    const updated = payments.filter((p) => p.id !== id);
    this.savePayments(updated);
  },

  // Plans
  getPlans(): PlanItem[] {
    return getStoredItem<PlanItem[]>(STORAGE_KEYS.PLANS, DEFAULT_PLANS);
  },

  savePlans(plans: PlanItem[]): void {
    setStoredItem(STORAGE_KEYS.PLANS, plans);
  },

  updatePlan(id: string, updates: Partial<PlanItem>): void {
    const plans = this.getPlans();
    const updated = plans.map((p) => (p.id === id ? { ...p, ...updates } : p));
    this.savePlans(updated);
  },

  addPlan(plan: Omit<PlanItem, "id">): PlanItem {
    const plans = this.getPlans();
    const newPlan: PlanItem = {
      ...plan,
      id: `plan-${Date.now()}`,
    };
    const updated = [...plans, newPlan];
    this.savePlans(updated);
    return newPlan;
  },

  deletePlan(id: string): void {
    const plans = this.getPlans();
    const updated = plans.filter((p) => p.id !== id);
    this.savePlans(updated);
  },

  // Features
  getFeatures(): FeatureItem[] {
    return getStoredItem<FeatureItem[]>(STORAGE_KEYS.FEATURES, DEFAULT_FEATURES);
  },

  saveFeatures(features: FeatureItem[]): void {
    setStoredItem(STORAGE_KEYS.FEATURES, features);
  },

  addFeature(feature: FeatureItem): void {
    const features = this.getFeatures();
    if (features.some((f) => f.code === feature.code)) return;
    const updated = [...features, { ...feature, isCustom: true }];
    this.saveFeatures(updated);
  },

  deleteFeature(code: string): void {
    const features = this.getFeatures();
    const updated = features.filter((f) => f.code !== code);
    this.saveFeatures(updated);

    // Also remove feature from all plans
    const plans = this.getPlans();
    const updatedPlans = plans.map((p) => ({
      ...p,
      features: p.features.filter((f) => f !== code),
    }));
    this.savePlans(updatedPlans);
  },

  // Dynamic Statistics Calculation for Overview
  getComputedStats() {
    const users = this.getUsers();
    const payments = this.getPayments();

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "active").length;
    const pendingAcc = users.filter((u) => u.status === "pending").length;

    // Check users expiring in next 7 days
    const now = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(now.getDate() + 7);

    const expiringIn7Days = users.filter((u) => {
      if (u.status !== "active") return false;
      const exp = new Date(u.expiresAt);
      return exp >= now && exp <= sevenDaysLater;
    }).length;

    // Calculate MRR from paid payments in the current month or active users
    const paidPayments = payments.filter((p) => p.status === "paid");
    const mrr = paidPayments.reduce((acc, p) => acc + p.amount, 0);

    const basicCount = users.filter(
      (u) => u.plan.toLowerCase() === "basic" && u.status === "active"
    ).length;
    const proCount = users.filter(
      (u) => u.plan.toLowerCase() === "pro" && u.status === "active"
    ).length;

    return {
      totalUsers,
      activeUsers,
      pendingAcc,
      expiringIn7Days,
      mrr,
      basicCount,
      proCount,
    };
  },

  // Reset to initial defaults (optional helper)
  resetToDefaults(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(DEFAULT_PAYMENTS));
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(DEFAULT_PLANS));
    localStorage.setItem(STORAGE_KEYS.FEATURES, JSON.stringify(DEFAULT_FEATURES));
    window.dispatchEvent(new Event("dicatetin_store_updated"));
  },
};
