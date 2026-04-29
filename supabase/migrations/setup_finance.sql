-- ============================================================
-- SQL UNTUK TABEL WALLETS DAN FINANCIAL TRANSACTIONS
-- ============================================================

-- 1. TABEL WALLETS (Dompet Keuangan)
CREATE TABLE IF NOT EXISTS "Wallets" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT DEFAULT '#3b82f6',
    "icon" TEXT DEFAULT '💳',
    "balance" BIGINT DEFAULT 0,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL FINANCIAL TRANSACTIONS (Pencatatan Keuangan)
CREATE TABLE IF NOT EXISTS "FinancialTransactions" (
    "id" SERIAL PRIMARY KEY,
    "wallet_id" INTEGER NOT NULL REFERENCES "Wallets"("id") ON DELETE CASCADE,
    "type" TEXT NOT NULL CHECK ("type" IN ('income', 'expense')),
    "amount" BIGINT NOT NULL DEFAULT 0,
    "description" TEXT,
    "date" DATE NOT NULL DEFAULT CURRENT_DATE,
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENABLE RLS
ALTER TABLE "Wallets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FinancialTransactions" ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES (Allow All for Personal Dashboard)
DROP POLICY IF EXISTS "allow_all_wallets" ON "Wallets";
CREATE POLICY "allow_all_wallets" ON "Wallets" FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_transactions" ON "FinancialTransactions";
CREATE POLICY "allow_all_transactions" ON "FinancialTransactions" FOR ALL TO public USING (true) WITH CHECK (true);

-- 5. DATA SEED: WALLET DEFAULT
INSERT INTO "Wallets" ("name", "color", "icon", "balance") VALUES 
('Cash Utama', '#10b981', '💵', 0),
('Bank BCA', '#3b82f6', '💳', 0)
ON CONFLICT DO NOTHING;

SELECT 'Tabel Wallets dan FinancialTransactions berhasil dibuat.' AS status;
