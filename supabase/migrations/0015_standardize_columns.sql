-- =====================================================
-- MIGRATION: Standardize Column Names & Add showOnHome
-- =====================================================
-- Menambahkan kolom showOnHome ke semua tabel yang perlu visibility control
-- Menghapus kolom 'published' yang tidak konsisten

-- 1. Tabel Article - Ganti 'published' dengan 'showOnHome'
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'article') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'article' AND column_name = 'showOnHome') THEN
      ALTER TABLE article ADD COLUMN "showOnHome" BOOLEAN DEFAULT true;
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'article' AND column_name = 'published') THEN
      UPDATE article SET "showOnHome" = "published" WHERE "published" IS NOT NULL;
      ALTER TABLE article DROP COLUMN IF EXISTS "published";
    END IF;
  END IF;
END $$;

-- Pastikan showOnHome ada untuk tabel lain yang ada di 001_init.sql
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'project') THEN
    ALTER TABLE project ADD COLUMN IF NOT EXISTS "showOnHome" BOOLEAN DEFAULT true;
    UPDATE project SET "showOnHome" = true WHERE "showOnHome" IS NULL;
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'experience') THEN
    ALTER TABLE experience ADD COLUMN IF NOT EXISTS "showOnHome" BOOLEAN DEFAULT true;
    UPDATE experience SET "showOnHome" = true WHERE "showOnHome" IS NULL;
  END IF;
  
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'education') THEN
    ALTER TABLE education ADD COLUMN IF NOT EXISTS "showOnHome" BOOLEAN DEFAULT true;
    UPDATE education SET "showOnHome" = true WHERE "showOnHome" IS NULL;
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'skill') THEN
    ALTER TABLE skill ADD COLUMN IF NOT EXISTS "showOnHome" BOOLEAN DEFAULT true;
    UPDATE skill SET "showOnHome" = true WHERE "showOnHome" IS NULL;
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'award') THEN
    ALTER TABLE award ADD COLUMN IF NOT EXISTS "showOnHome" BOOLEAN DEFAULT true;
    UPDATE award SET "showOnHome" = true WHERE "showOnHome" IS NULL;
  END IF;

  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'message') THEN
    ALTER TABLE message ADD COLUMN IF NOT EXISTS "isRead" BOOLEAN DEFAULT false;
    UPDATE message SET "isRead" = false WHERE "isRead" IS NULL;
  END IF;
END $$;

-- Tambah index untuk performa query
CREATE INDEX IF NOT EXISTS idx_project_showonhome ON project("showOnHome");
CREATE INDEX IF NOT EXISTS idx_article_showonhome ON article("showOnHome");
CREATE INDEX IF NOT EXISTS idx_experience_showonhome ON experience("showOnHome");
CREATE INDEX IF NOT EXISTS idx_education_showonhome ON education("showOnHome");
CREATE INDEX IF NOT EXISTS idx_message_isread ON message("isRead");
