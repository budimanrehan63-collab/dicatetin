# Project Memory - Dicatetin

## Project Overview
- **Name**: Dicatetin
- **Type**: SaaS Personal Finance Management Application (Web App + Telegram Bot + AI)
- **Target Market**: Indonesia (Indonesian language, IDR currency `Rp1.250.000`, Asia/Jakarta timezone WIB)
- **Stack**: Next.js 14+ (App Router) + TypeScript, Tailwind CSS + shadcn/ui, next-themes, Supabase (PostgreSQL, Auth, Storage, RLS), Recharts, React Hook Form + Zod, grammY (Telegram bot), Gemini (multimodal AI) with failover to OpenAI/DeepSeek, Midtrans Snap, Resend, SheetJS.

## Primary Administrator
- **Superadmin Email**: `fauzymnf29@gmail.com`
- **Role**: `superadmin` (Full access to all admin panel controls, users, API keys, and settings)

## Key Decisions & Rules
- **Design Tokens**: Dark green primary (`#0F7A4F` light / `#34C88A` dark), Dark green-black background (`#0B1410`), Gold accent (`#C9A44C` / `#D9B866`), tabular figures for money. No generic purple/blue gradients or emoji icons.
- **Plans**: Basic (Rp59.000, 30 days) and Pro (Rp99.000, 30 days). Dynamic in database with `plan_features` mapping.
- **AI Quota & Failover**: 300 actions/month fair use for Pro. Server-side failover between providers (`ai_providers` table) with encrypted API keys.
- **Bot**: Single shared bot with 6-digit code linking. Commands + NL processing for text, voice note, receipt photos.
- **Security & RLS**: Strict Supabase RLS on all tables. Admin operations through secure server action/route handlers with `requireAdmin()`.
- **Admin Store & State Persistence**: All admin operations (User status, ACC, reject, suspend, delete, edit, plan price/text changes, new custom features, approval queues) are managed via `AdminStore` (`src/lib/data/adminStore.ts`), ensuring 100% persistence across browser reloads, navigation, and testing.
- **Dynamic Calculation**: Overview metrics (Total Users, Active, Pending, MRR, Basic vs Pro) are dynamically computed from stored entities rather than static dummy figures.
