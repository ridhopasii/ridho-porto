-- =====================================================
-- MIGRATION: Standardize Column Names & Add showOnHome
-- =====================================================
-- Menambahkan kolom showOnHome ke semua tabel yang perlu visibility control
-- Menghapus kolom 'published' yang tidak konsisten

-- 1. Tabel Article - Ganti 'published' dengan 'showOnHome'
DO $$ 
BEGIN
  -- Tambah kolom showOnHome jika belum ada
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Article' AND column_name = 'showOnHome'
  ) THEN
    ALTER TABLE "Article" ADD COLUMN "showOnHome" BOOLEAN DEFAULT true;
  END IF;

  -- Migrate data dari published ke showOnHome (jika ada)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Article' AND column_name = 'published'
  ) THEN
    UPDATE "Article" SET "showOnHome" = "published" WHERE "published" IS NOT NULL;
    ALTER TABLE "Article" DROP COLUMN IF EXISTS "published";
  END IF;
END $$;

-- 2. Tabel Project - Pastikan showOnHome ada
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "showOnHome" BOOLEAN DEFAULT true;

-- 3. Tabel Experience - Tambah showOnHome
ALTER TABLE "Experience" ADD COLUMN IF NOT EXISTS "showOnHome" BOOLEAN DEFAULT true;

-- 4. Tabel Education - Tambah showOnHome
ALTER TABLE "Education" ADD COLUMN IF NOT EXISTS "showOnHome" BOOLEAN DEFAULT true;

-- 5. Tabel Skill - Tambah showOnHome
ALTER TABLE "Skill" ADD COLUMN IF NOT EXISTS "showOnHome" BOOLEAN DEFAULT true;

-- 6. Tabel Award - Tambah showOnHome
ALTER TABLE "Award" ADD COLUMN IF NOT EXISTS "showOnHome" BOOLEAN DEFAULT true;

-- 7. Tabel Publication - Tambah showOnHome
ALTER TABLE "Publication" ADD COLUMN IF NOT EXISTS "showOnHome" BOOLEAN DEFAULT true;

-- 8. Tabel Organization - Tambah showOnHome
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "showOnHome" BOOLEAN DEFAULT true;

-- 9. Tabel Gallery - Tambah showOnHome
ALTER TABLE "Gallery" ADD COLUMN IF NOT EXISTS "showOnHome" BOOLEAN DEFAULT true;

-- 10. Tabel Message - Pastikan isRead ada
ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "isRead" BOOLEAN DEFAULT false;

-- Set default values untuk data yang sudah ada
UPDATE "Project" SET "showOnHome" = true WHERE "showOnHome" IS NULL;
UPDATE "Article" SET "showOnHome" = true WHERE "showOnHome" IS NULL;
UPDATE "Experience" SET "showOnHome" = true WHERE "showOnHome" IS NULL;
UPDATE "Education" SET "showOnHome" = true WHERE "showOnHome" IS NULL;
UPDATE "Skill" SET "showOnHome" = true WHERE "showOnHome" IS NULL;
UPDATE "Award" SET "showOnHome" = true WHERE "showOnHome" IS NULL;
UPDATE "Publication" SET "showOnHome" = true WHERE "showOnHome" IS NULL;
UPDATE "Organization" SET "showOnHome" = true WHERE "showOnHome" IS NULL;
UPDATE "Gallery" SET "showOnHome" = true WHERE "showOnHome" IS NULL;
UPDATE "Message" SET "isRead" = false WHERE "isRead" IS NULL;

-- Tambah index untuk performa query
CREATE INDEX IF NOT EXISTS idx_project_showonhome ON "Project"("showOnHome");
CREATE INDEX IF NOT EXISTS idx_article_showonhome ON "Article"("showOnHome");
CREATE INDEX IF NOT EXISTS idx_experience_showonhome ON "Experience"("showOnHome");
CREATE INDEX IF NOT EXISTS idx_education_showonhome ON "Education"("showOnHome");
CREATE INDEX IF NOT EXISTS idx_message_isread ON "Message"("isRead");

COMMENT ON COLUMN "Project"."showOnHome" IS 'Visibility control for home page';
COMMENT ON COLUMN "Article"."showOnHome" IS 'Visibility control for home page';
COMMENT ON COLUMN "Message"."isRead" IS 'Message read status';
