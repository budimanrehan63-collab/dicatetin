-- =======================================================================
-- DICATETIN DATABASE INITIALIZATION MIGRATION
-- PostgreSQL / Supabase Schema with RLS, Triggers, Views, and Seed Data
-- =======================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'user');
CREATE TYPE user_status AS ENUM ('pending', 'active', 'suspended', 'expired');
CREATE TYPE transaction_type AS ENUM ('income', 'expense', 'transfer');
CREATE TYPE wallet_type AS ENUM ('cash', 'bank', 'ewallet');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'rejected');
CREATE TYPE payment_method AS ENUM ('midtrans', 'transfer');
CREATE TYPE subscription_source AS ENUM ('midtrans', 'manual', 'invite');
CREATE TYPE ai_task_type AS ENUM ('text', 'voice', 'receipt', 'insight');

-- 2. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. PLANS TABLE
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    duration_days INT NOT NULL DEFAULT 30,
    description TEXT,
    ai_quota_monthly INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_plans_updated_at BEFORE UPDATE ON plans FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 4. PLAN FEATURES TABLE
CREATE TABLE IF NOT EXISTS plan_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    feature_code VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(plan_id, feature_code)
);

-- 5. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    phone_wa VARCHAR(30),
    role user_role NOT NULL DEFAULT 'user',
    status user_status NOT NULL DEFAULT 'pending',
    plan_id UUID REFERENCES plans(id) ON DELETE SET NULL,
    telegram_chat_id BIGINT UNIQUE,
    telegram_username VARCHAR(100),
    default_wallet_id UUID,
    theme VARCHAR(20) DEFAULT 'system',
    timezone VARCHAR(50) DEFAULT 'Asia/Jakarta',
    onboarding_done BOOLEAN NOT NULL DEFAULT false,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_telegram_chat ON profiles(telegram_chat_id);

-- 6. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
    start_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    source subscription_source NOT NULL DEFAULT 'manual',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE INDEX idx_subscriptions_user_end ON subscriptions(user_id, end_at);

-- 7. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
    amount NUMERIC(12, 2) NOT NULL,
    method payment_method NOT NULL DEFAULT 'transfer',
    status payment_status NOT NULL DEFAULT 'pending',
    midtrans_order_id VARCHAR(100),
    proof_url TEXT,
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE INDEX idx_payments_status ON payments(status);

-- 8. WALLETS TABLE
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type wallet_type NOT NULL DEFAULT 'cash',
    initial_balance NUMERIC(15, 2) NOT NULL DEFAULT 0,
    icon VARCHAR(50) DEFAULT 'wallet',
    color VARCHAR(30) DEFAULT '#0F7A4F',
    is_archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE INDEX idx_wallets_user ON wallets(user_id);

-- 9. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- NULL means default system category
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'income' or 'expense'
    icon VARCHAR(50) DEFAULT 'tag',
    color VARCHAR(30) DEFAULT '#5B6B62',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE INDEX idx_categories_user ON categories(user_id);

-- 10. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type transaction_type NOT NULL DEFAULT 'expense',
    amount NUMERIC(15, 2) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
    to_wallet_id UUID REFERENCES wallets(id) ON DELETE SET NULL, -- Only for transfer
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    note TEXT,
    source VARCHAR(30) NOT NULL DEFAULT 'web', -- 'web', 'telegram_text', 'telegram_voice', 'receipt'
    receipt_url TEXT,
    merchant VARCHAR(100),
    ai_confidence NUMERIC(4, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE INDEX idx_transactions_user_date ON transactions(user_id, occurred_at);
CREATE INDEX idx_transactions_wallet ON transactions(wallet_id);

-- 11. TRANSACTION ITEMS TABLE (For receipts breakdown)
CREATE TABLE IF NOT EXISTS transaction_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    qty INT NOT NULL DEFAULT 1,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transaction_items_tx ON transaction_items(transaction_id);

-- 12. BUDGETS TABLE
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    month VARCHAR(7) NOT NULL, -- Format YYYY-MM
    limit_amount NUMERIC(15, 2) NOT NULL,
    alert_80_sent BOOLEAN NOT NULL DEFAULT false,
    alert_100_sent BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, category_id, month)
);

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE INDEX idx_budgets_user_month ON budgets(user_id, month);

-- 13. REMINDER SETTINGS TABLE
CREATE TABLE IF NOT EXISTS reminder_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    times JSONB NOT NULL DEFAULT '["12:30", "20:00"]'::jsonb, -- Max 2 reminder times
    summary_mode VARCHAR(20) NOT NULL DEFAULT 'off', -- 'off', 'daily', 'weekly'
    channels JSONB NOT NULL DEFAULT '["in_app", "email"]'::jsonb, -- 'in_app', 'email', 'telegram'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_reminder_settings_updated_at BEFORE UPDATE ON reminder_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 14. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    body TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    sent_via VARCHAR(30) DEFAULT 'in_app',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- 15. TELEGRAM LINK CODES TABLE
CREATE TABLE IF NOT EXISTS telegram_link_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    code VARCHAR(10) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_telegram_codes_code ON telegram_link_codes(code);

-- 16. AI PROVIDERS TABLE
CREATE TABLE IF NOT EXISTS ai_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    base_url TEXT,
    model VARCHAR(50) NOT NULL,
    api_key_encrypted TEXT NOT NULL,
    priority INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_ai_providers_updated_at BEFORE UPDATE ON ai_providers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 17. AI LOGS TABLE
CREATE TABLE IF NOT EXISTS ai_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    provider_id UUID REFERENCES ai_providers(id) ON DELETE SET NULL,
    task ai_task_type NOT NULL,
    tokens_in INT DEFAULT 0,
    tokens_out INT DEFAULT 0,
    cost_estimate NUMERIC(10, 6) DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'success',
    error TEXT,
    latency_ms INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_logs_user ON ai_logs(user_id);
CREATE INDEX idx_ai_logs_created ON ai_logs(created_at);

-- 18. APP SETTINGS TABLE
CREATE TABLE IF NOT EXISTS app_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_app_settings_updated_at BEFORE UPDATE ON app_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 19. ADMIN LOGS TABLE
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    target_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    detail JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_admin ON admin_logs(admin_id);

-- 20. INVITATIONS TABLE
CREATE TABLE IF NOT EXISTS invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(150) NOT NULL,
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    duration_days INT NOT NULL DEFAULT 30,
    token VARCHAR(100) NOT NULL UNIQUE,
    invited_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invitations_token ON invitations(token);

-- =======================================================================
-- 21. VIEW: WALLET_BALANCES
-- Dynamic balance = initial_balance + income - expense + transfer_in - transfer_out
-- =======================================================================
CREATE OR REPLACE VIEW wallet_balances AS
SELECT 
    w.id AS wallet_id,
    w.user_id,
    w.name,
    w.type,
    w.icon,
    w.color,
    w.initial_balance,
    w.is_archived,
    (
        w.initial_balance 
        + COALESCE(SUM(CASE WHEN t.type = 'income' AND t.wallet_id = w.id THEN t.amount ELSE 0 END), 0)
        - COALESCE(SUM(CASE WHEN t.type = 'expense' AND t.wallet_id = w.id THEN t.amount ELSE 0 END), 0)
        - COALESCE(SUM(CASE WHEN t.type = 'transfer' AND t.wallet_id = w.id THEN t.amount ELSE 0 END), 0)
        + COALESCE(SUM(CASE WHEN t.type = 'transfer' AND t.to_wallet_id = w.id THEN t.amount ELSE 0 END), 0)
    ) AS current_balance
FROM wallets w
LEFT JOIN transactions t ON (t.wallet_id = w.id OR t.to_wallet_id = w.id)
GROUP BY w.id, w.user_id, w.name, w.type, w.icon, w.color, w.initial_balance, w.is_archived;

-- =======================================================================
-- 22. ROW LEVEL SECURITY (RLS) POLICIES
-- =======================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminder_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE telegram_link_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Plans & Features: Public read
CREATE POLICY "Public read active plans" ON plans FOR SELECT USING (true);
CREATE POLICY "Public read plan features" ON plan_features FOR SELECT USING (true);

-- Profiles: User can read/update own profile
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Wallets: User can read/write own wallets
CREATE POLICY "Users manage own wallets" ON wallets FOR ALL USING (auth.uid() = user_id);

-- Categories: User can read default categories (user_id IS NULL) + own categories
CREATE POLICY "Users read categories" ON categories FOR SELECT USING (user_id IS NULL OR user_id = auth.uid());
CREATE POLICY "Users manage own categories" ON categories FOR ALL USING (auth.uid() = user_id);

-- Transactions & Items: User can manage own transactions
CREATE POLICY "Users manage own transactions" ON transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own transaction items" ON transaction_items FOR ALL USING (
    EXISTS (SELECT 1 FROM transactions WHERE transactions.id = transaction_items.transaction_id AND transactions.user_id = auth.uid())
);

-- Budgets: User manage own budgets
CREATE POLICY "Users manage own budgets" ON budgets FOR ALL USING (auth.uid() = user_id);

-- Reminders & Notifications: User manage own
CREATE POLICY "Users manage own reminder_settings" ON reminder_settings FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own telegram link codes" ON telegram_link_codes FOR ALL USING (auth.uid() = user_id);

-- Subscriptions & Payments: User can read own
CREATE POLICY "Users read own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read and create own payments" ON payments FOR ALL USING (auth.uid() = user_id);

-- =======================================================================
-- 23. SEED INITIAL DATA
-- =======================================================================

-- Plans Seed
INSERT INTO plans (id, name, price, duration_days, description, ai_quota_monthly, is_active, sort_order) VALUES
('11111111-1111-1111-1111-111111111111', 'Basic', 59000, 30, 'Paket hemat untuk pencatatan mandiri lengkap via web dashboard.', 0, true, 1),
('22222222-2222-2222-2222-222222222222', 'Pro', 99000, 30, 'Paket lengkap dengan Bot Telegram AI, Voice Note, Scan Struk & Insight Finansial.', 300, true, 2)
ON CONFLICT (id) DO NOTHING;

-- Plan Features Seed
INSERT INTO plan_features (plan_id, feature_code) VALUES
('11111111-1111-1111-1111-111111111111', 'budget'),
('11111111-1111-1111-1111-111111111111', 'export'),
('22222222-2222-2222-2222-222222222222', 'budget'),
('22222222-2222-2222-2222-222222222222', 'export'),
('22222222-2222-2222-2222-222222222222', 'telegram'),
('22222222-2222-2222-2222-222222222222', 'ai_chat'),
('22222222-2222-2222-2222-222222222222', 'ai_voice'),
('22222222-2222-2222-2222-222222222222', 'ai_scan'),
('22222222-2222-2222-2222-222222222222', 'ai_insight')
ON CONFLICT DO NOTHING;

-- Default Categories Seed
INSERT INTO categories (name, type, icon, color) VALUES
-- Pengeluaran
('Makan & Minum', 'expense', '🍔', '#DC2626'),
('Transportasi', 'expense', '🚗', '#EA580C'),
('Belanja Harian', 'expense', '🛒', '#D97706'),
('Tagihan & Utilitas', 'expense', '💡', '#65A30D'),
('Pulsa & Internet', 'expense', '📱', '#0891B2'),
('Kesehatan', 'expense', '💊', '#E11D48'),
('Pendidikan', 'expense', '📚', '#7C3AED'),
('Hiburan', 'expense', '🎬', '#9333EA'),
('Rumah Tangga', 'expense', '🏠', '#475569'),
('Cicilan', 'expense', '💳', '#B91C1C'),
('Sedekah & Donasi', 'expense', '🤲', '#059669'),
('Lainnya', 'expense', '📦', '#64748B'),
-- Pemasukan
('Gaji', 'income', '💰', '#16A34A'),
('Bonus', 'income', '🎁', '#15803D'),
('Usaha', 'income', '🏬', '#0D9488'),
('Freelance', 'income', '💻', '#0284C7'),
('Hadiah', 'income', '🎉', '#F59E0B'),
('Lainnya', 'income', '💵', '#10B981')
ON CONFLICT DO NOTHING;

-- App Settings Seed
INSERT INTO app_settings (key, value) VALUES
('activation_mode', '"manual"'::jsonb),
('registration_open', 'true'::jsonb),
('bank_info', '{"bank_name": "Bank Central Asia (BCA)", "account_number": "8831294819", "account_name": "PT DICATETIN TEKNOLOGI INDONESIA"}'::jsonb),
('templates', '{"reminder": "Hai {name}, hari ini belum ada catatan nih. Ketik aja pengeluaranmu di sini, misalnya: makan siang 20rb.", "welcome": "Selamat akun Dicatetin kamu sudah aktif! Mulai catat keuanganmu sekarang."}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
