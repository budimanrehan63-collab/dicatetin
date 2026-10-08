# Architecture & Implementation Plan — Dicatetin

## 1. Ringkasan Arsitektur
Dicatetin dibangun sebagai aplikasi monolithic SaaS modern berbasis Next.js 14+ App Router dengan Supabase sebagai Backend-as-a-Service (BaaS).

```
                      +-----------------------------+
                      |        User Clients         |
                      |  - Web Browser (Desktop/HP) |
                      |  - Telegram Mobile / Desktop|
                      +--------------+--------------+
                                     |
              +----------------------+----------------------+
              |                                             |
              v                                             v
+-----------------------------+               +-----------------------------+
|    Next.js Web Application  |               |  Telegram Bot Webhook       |
|  - Landing Page (AIDA)      |               |  /api/telegram/webhook      |
|  - User Dashboard (/app)    |               |  (grammY framework)         |
|  - Admin Dashboard (/admin) |               +--------------+--------------+
|  - Auth & Onboarding        |                              |
+--------------+--------------+                              |
               |                                             |
               +----------------------+----------------------+
                                      |
                                      v
                      +-------------------------------+
                      |        Server Logic Layer     |
                      |  - Server Actions & API Routes|
                      |  - RBAC & hasFeature checks   |
                      |  - aiService (Gemini+Fallback)|
                      |  - Cron Handlers & Resend     |
                      |  - Midtrans Snap & Webhooks   |
                      +---------------+---------------+
                                      |
                                      v
                      +-------------------------------+
                      |     Supabase Infrastructure   |
                      |  - PostgreSQL with RLS        |
                      |  - Supabase Auth (Email+OAuth)|
                      |  - Private Storage (Struk/Bukti|
                      |  - Views (wallet_balances)    |
                      +-------------------------------+
```

---

## 2. Struktur Direktori Proyek

```
dicatetin/
├── src/
│   ├── app/
│   │   ├── (marketing)/             # Landing page & public pages
│   │   │   ├── page.tsx             # Landing Page AIDA
│   │   │   ├── harga/page.tsx       # Pricing page
│   │   │   ├── kebijakan-privasi/page.tsx
│   │   │   ├── syarat-ketentuan/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (auth)/                  # Authentication
│   │   │   ├── login/page.tsx
│   │   │   ├── daftar/page.tsx
│   │   │   ├── lupa-password/page.tsx
│   │   │   ├── reset-password/page.tsx
│   │   │   ├── menunggu-persetujuan/page.tsx
│   │   │   ├── undangan/[token]/page.tsx
│   │   │   └── layout.tsx
│   │   ├── app/                     # User Dashboard (/app)
│   │   │   ├── layout.tsx           # Sidebar desktop + bottom nav mobile
│   │   │   ├── page.tsx             # Beranda (Summary, Charts, Streak)
│   │   │   ├── transaksi/page.tsx   # Transaksi list, filter, CRUD, transfer
│   │   │   ├── scan/page.tsx        # Scan Struk (Pro)
│   │   │   ├── wallet/page.tsx      # Multi-wallet & balance overview
│   │   │   ├── budget/page.tsx      # Monthly category budgets & progress
│   │   │   ├── laporan/page.tsx     # Monthly reports, 6mo bar chart, Export xlsx/csv
│   │   │   ├── telegram/page.tsx    # Telegram connection & 6-digit code
│   │   │   ├── pengaturan/page.tsx  # Profile, pass, reminder, theme, sub, pay hist
│   │   │   ├── tutorial/page.tsx    # Step-by-step guides with visuals
│   │   │   └── onboarding/page.tsx  # First-time setup wizard
│   │   ├── admin/                   # Admin Dashboard (/admin)
│   │   │   ├── layout.tsx           # Admin sidebar & Impersonation banner
│   │   │   ├── page.tsx             # Overview stats, charts, MRR, AI usage
│   │   │   ├── users/page.tsx       # Kelola User, ACC/Tolak, Invite, Impersonate
│   │   │   ├── persetujuan/page.tsx # Persetujuan bukti transfer pending
│   │   │   ├── pembayaran/page.tsx  # Riwayat transaksi Midtrans & manual
│   │   │   ├── paket/page.tsx       # CRUD plans & feature flags & AI quota
│   │   │   ├── api/page.tsx         # AI Provider CRUD, Telegram & Midtrans setup
│   │   │   ├── pengaturan/page.tsx  # Activation mode, regis open, bank info, templates
│   │   │   └── log/page.tsx         # AI logs, admin activity logs, webhook logs
│   │   ├── api/                     # Route Handlers
│   │   │   ├── auth/callback/route.ts
│   │   │   ├── telegram/webhook/route.ts
│   │   │   ├── telegram/set-webhook/route.ts
│   │   │   ├── payments/midtrans/route.ts
│   │   │   ├── payments/create-snap/route.ts
│   │   │   ├── cron/reminders/route.ts
│   │   │   ├── cron/subscriptions/route.ts
│   │   │   ├── ai/scan-receipt/route.ts
│   │   │   └── export/route.ts
│   │   ├── style-guide/page.tsx     # Visual verification page for components & themes
│   │   ├── globals.css              # Theme CSS Variables & typography
│   │   └── layout.tsx               # Root layout with ThemeProvider & Toaster
│   ├── components/
│   │   ├── ui/                      # Base atoms (Button, Card, Input, Dialog, etc.)
│   │   ├── common/                  # Logo, ThemeToggle, MoneyText, StatCard, EmptyState
│   │   ├── layouts/                 # UserNav, UserSidebar, AdminSidebar, MobileBottomNav
│   │   ├── transactions/            # QuickRecordModal (+ button), TransactionDetailModal
│   │   ├── scanner/                 # ReceiptDropzone, ReceiptReviewForm
│   │   ├── landing/                 # Hero, Problems, DemoSteps, PricingCard, FAQ, etc.
│   │   └── admin/                   # AdminUserActions, ProofViewerModal, ProviderTestModal
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts            # Browser Supabase client
│   │   │   ├── server.ts            # Server-side Supabase client (cookies)
│   │   │   ├── admin.ts             # Service-role Supabase client
│   │   │   └── middleware.ts        # Session & auth route validation
│   │   ├── auth/
│   │   │   ├── session.ts           # getCurrentUser(), requireAdmin()
│   │   │   └── permissions.ts       # hasFeature(userId, featureCode)
│   │   ├── ai/
│   │   │   ├── encryption.ts        # AES-256 key encryption/decryption
│   │   │   ├── aiService.ts         # Multimodal parser & failover engine
│   │   │   ├── providers/           # Gemini, OpenAI, DeepSeek adapters
│   │   │   └── schemas.ts           # Zod schemas for AI outputs
│   │   ├── telegram/
│   │   │   ├── bot.ts               # grammY bot instance & command handlers
│   │   │   └── keyboards.ts         # Inline action keyboards (Ubah, Hapus)
│   │   ├── payments/
│   │   │   └── midtrans.ts          # Midtrans Snap client & signature verifier
│   │   ├── email/
│   │   │   └── resend.ts            # Transactional email templates (Invite, ACC, Reminder)
│   │   ├── export/
│   │   │   └── excel.ts             # SheetJS multi-tab generator (.xlsx & .csv)
│   │   └── utils/
│   │       ├── currency.ts          # Indonesian IDR formatting (e.g., Rp1.250.000)
│   │       ├── date.ts              # Asia/Jakarta date formatting
│   │       └── cn.ts                # clsx + twMerge utility
│   ├── types/
│   │   └── database.types.ts        # Supabase TypeScript schema definitions
│   └── middleware.ts                # Next.js edge middleware
├── supabase/
│   ├── migrations/
│   │   └── 20261006000000_dicatetin_init.sql # All tables, enums, triggers, views, RLS
│   └── seed.sql                     # Plans, features, default categories, app_settings
├── public/                          # Static assets, mockups, illustrations
├── .env.example                     # Full environment variable template
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── PRD.md
```

---

## 3. Skema Tabel Database (Supabase PostgreSQL)

1. `profiles`: `id (uuid, auth.users)`, `full_name`, `phone_wa`, `role` (superadmin/admin/user), `status` (pending/active/suspended/expired), `plan_id`, `telegram_chat_id`, `telegram_username`, `default_wallet_id`, `theme`, `timezone`, `onboarding_done`, `deleted_at`.
2. `plans`: `id`, `name`, `price`, `duration_days`, `description`, `ai_quota_monthly`, `is_active`, `sort_order`.
3. `plan_features`: `id`, `plan_id`, `feature_code` (`telegram`, `ai_scan`, `ai_voice`, `ai_chat`, `ai_insight`, `export`, `budget`).
4. `subscriptions`: `id`, `user_id`, `plan_id`, `start_at`, `end_at`, `status`, `source`.
5. `payments`: `id`, `user_id`, `plan_id`, `amount`, `method` (midtrans/transfer), `status` (pending/paid/rejected), `midtrans_order_id`, `proof_url`, `reviewed_by`, `reviewed_at`, `note`.
6. `wallets`: `id`, `user_id`, `name`, `type` (cash/bank/ewallet), `initial_balance`, `icon`, `color`, `is_archived`.
7. `categories`: `id`, `user_id` (null = system default), `name`, `type` (income/expense), `icon`, `color`.
8. `transactions`: `id`, `user_id`, `type` (income/expense/transfer), `amount`, `category_id`, `wallet_id`, `to_wallet_id`, `occurred_at`, `note`, `source` (web/telegram_text/telegram_voice/receipt), `receipt_url`, `merchant`, `ai_confidence`.
9. `transaction_items`: `id`, `transaction_id`, `name`, `qty`, `price`, `subtotal`.
10. `budgets`: `id`, `user_id`, `category_id`, `month` (YYYY-MM), `limit_amount`, `alert_80_sent`, `alert_100_sent`.
11. `reminder_settings`: `id`, `user_id`, `times` (array of 'HH:MM'), `summary_mode` (off/daily/weekly), `channels` (email/telegram/in_app).
12. `notifications`: `id`, `user_id`, `type`, `title`, `body`, `is_read`, `sent_via`.
13. `telegram_link_codes`: `id`, `user_id`, `code` (6-char), `expires_at`, `used_at`.
14. `ai_providers`: `id`, `name`, `base_url`, `model`, `api_key_encrypted`, `priority`, `is_active`.
15. `ai_logs`: `id`, `user_id`, `provider_id`, `task` (text/voice/receipt/insight), `tokens_in`, `tokens_out`, `cost_estimate`, `status`, `error`, `latency_ms`.
16. `app_settings`: `id`, `key`, `value` (jsonb).
17. `admin_logs`: `id`, `admin_id`, `action`, `target_user_id`, `detail` (jsonb).
18. `invitations`: `id`, `email`, `plan_id`, `duration_days`, `token`, `invited_by`, `accepted_at`.
19. `VIEW wallet_balances`: `wallet_id`, `current_balance` calculated automatically from `initial_balance + income - expense + transfer_in - transfer_out`.

---

## 4. Eksekusi Fase Bertahap
- **Fase 1**: Setup project, Tailwind, Shadcn tokens (CSS vars), typography, base components, skeleton/empty pages, style-guide.
- **Fase 2**: SQL migration, seed, RLS policies, Supabase client/server helper, Auth pages & middleware, `hasFeature()` & `requireAdmin()`.
- **Fase 3**: Dashboard Admin lengkap (/admin, /admin/users, /admin/persetujuan, /admin/pembayaran, /admin/paket, /admin/api, /admin/pengaturan, /admin/log, Impersonation).
- **Fase 4**: Dashboard User lengkap (/app, /app/transaksi, /app/wallet, /app/budget, /app/laporan, /app/pengaturan, /app/tutorial, Onboarding, Quick Record Floating Modal).
- **Fase 5**: AI Layer & Scan Struk (ai_providers CRUD, AES encryption, aiService failover, /app/scan upload/review/save, ai_logs).
- **Fase 6**: Telegram Bot (grammY webhook, 6-digit code linking, text/VN/receipt parser, inline keyboards, commands).
- **Fase 7**: Reminder cron (15m WIB check), subscription expiry cron, notification bell, SheetJS Excel & CSV export, Midtrans Snap payment & webhook, manual transfer proof upload.
- **Fase 8**: Landing page AIDA mewah, interactive demo, comparison table, FAQ, terms/privacy pages, launch checklist verification.
