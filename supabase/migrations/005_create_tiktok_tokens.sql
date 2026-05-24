-- =====================================================
-- MIGRATION: Create tiktok_tokens Table
-- =====================================================

CREATE TABLE IF NOT EXISTS "tiktok_tokens" (
  "id" TEXT PRIMARY KEY,
  "access_token" TEXT NOT NULL,
  "refresh_token" TEXT NOT NULL,
  "expires_at" TIMESTAMPTZ NOT NULL,
  "refresh_expires_at" TIMESTAMPTZ NOT NULL,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE "tiktok_tokens" ENABLE ROW LEVEL SECURITY;

-- Allow only authenticated/service role to manage tokens (public should not see this!)
DROP POLICY IF EXISTS "allow_auth_manage_tokens" ON "tiktok_tokens";
CREATE POLICY "allow_auth_manage_tokens" ON "tiktok_tokens"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
