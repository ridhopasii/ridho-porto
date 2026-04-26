-- =====================================================
-- QUICK FIXES & HELPER QUERIES
-- =====================================================
-- Kumpulan query SQL untuk troubleshooting & maintenance

-- =====================================================
-- 1. RESET VISIBILITY (Show All Content)
-- =====================================================
-- Gunakan jika semua konten hilang dari home page

UPDATE "Project" SET "showOnHome" = true;
UPDATE "Article" SET "showOnHome" = true;
UPDATE "Experience" SET "showOnHome" = true;
UPDATE "Education" SET "showOnHome" = true;
UPDATE "Skill" SET "showOnHome" = true;
UPDATE "Award" SET "showOnHome" = true;
UPDATE "Publication" SET "showOnHome" = true;
UPDATE "Organization" SET "showOnHome" = true;
UPDATE "Gallery" SET "showOnHome" = true;

-- =====================================================
-- 2. MARK ALL MESSAGES AS READ
-- =====================================================

UPDATE "Message" SET "isRead" = true;

-- =====================================================
-- 3. CHECK TABLE STRUCTURE
-- =====================================================
-- Verify kolom showOnHome ada di semua tabel

SELECT 
  table_name, 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE column_name IN ('showOnHome', 'isRead')
  AND table_schema = 'public'
ORDER BY table_name, column_name;

-- =====================================================
-- 4. CHECK RLS POLICIES
-- =====================================================
-- Verify RLS policies sudah di-setup

SELECT 
  schemaname, 
  tablename, 
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- 5. COUNT CONTENT BY TABLE
-- =====================================================
-- Quick overview berapa banyak data di setiap tabel

SELECT 'Profile' as table_name, COUNT(*) as count FROM "Profile"
UNION ALL
SELECT 'Project', COUNT(*) FROM "Project"
UNION ALL
SELECT 'Article', COUNT(*) FROM "Article"
UNION ALL
SELECT 'Experience', COUNT(*) FROM "Experience"
UNION ALL
SELECT 'Education', COUNT(*) FROM "Education"
UNION ALL
SELECT 'Skill', COUNT(*) FROM "Skill"
UNION ALL
SELECT 'Award', COUNT(*) FROM "Award"
UNION ALL
SELECT 'Publication', COUNT(*) FROM "Publication"
UNION ALL
SELECT 'Organization', COUNT(*) FROM "Organization"
UNION ALL
SELECT 'Gallery', COUNT(*) FROM "Gallery"
UNION ALL
SELECT 'Message', COUNT(*) FROM "Message"
UNION ALL
SELECT 'SiteSettings', COUNT(*) FROM "SiteSettings";

-- =====================================================
-- 6. CHECK VISIBLE CONTENT
-- =====================================================
-- Berapa banyak konten yang visible di home page

SELECT 
  'Project' as table_name, 
  COUNT(*) FILTER (WHERE "showOnHome" = true) as visible,
  COUNT(*) FILTER (WHERE "showOnHome" = false) as hidden,
  COUNT(*) as total
FROM "Project"
UNION ALL
SELECT 'Article', 
  COUNT(*) FILTER (WHERE "showOnHome" = true),
  COUNT(*) FILTER (WHERE "showOnHome" = false),
  COUNT(*)
FROM "Article"
UNION ALL
SELECT 'Experience',
  COUNT(*) FILTER (WHERE "showOnHome" = true),
  COUNT(*) FILTER (WHERE "showOnHome" = false),
  COUNT(*)
FROM "Experience";

-- =====================================================
-- 7. FIND UNREAD MESSAGES
-- =====================================================

SELECT 
  id,
  name,
  email,
  subject,
  "createdAt",
  "isRead"
FROM "Message"
WHERE "isRead" = false
ORDER BY "createdAt" DESC;

-- =====================================================
-- 8. RESET SITE SETTINGS TO DEFAULT
-- =====================================================

DELETE FROM "SiteSettings";

INSERT INTO "SiteSettings" (key, value) VALUES
  ('show_about', true),
  ('show_projects', true),
  ('show_experience', true),
  ('show_education', true),
  ('show_blog', true),
  ('show_gallery', true),
  ('show_skills', true),
  ('show_achievements', true),
  ('show_contact', true),
  ('show_organizations', true);

-- =====================================================
-- 9. DELETE OLD MESSAGES (Older than 30 days)
-- =====================================================

DELETE FROM "Message" 
WHERE "createdAt" < NOW() - INTERVAL '30 days'
  AND "isRead" = true;

-- =====================================================
-- 10. BACKUP SINGLE TABLE TO JSON
-- =====================================================
-- Export single table (run in Supabase SQL Editor)

SELECT json_agg(row_to_json(t)) 
FROM (
  SELECT * FROM "Project"
) t;

-- Copy output dan save sebagai .json file

-- =====================================================
-- 11. CHECK STORAGE USAGE
-- =====================================================
-- Lihat berapa banyak storage yang digunakan

SELECT 
  bucket_id,
  COUNT(*) as file_count,
  pg_size_pretty(SUM(metadata->>'size')::bigint) as total_size
FROM storage.objects
GROUP BY bucket_id;

-- =====================================================
-- 12. FIND BROKEN IMAGE URLS
-- =====================================================
-- Find records dengan image URLs yang mungkin broken

SELECT 'Project' as table_name, id, title, images
FROM "Project"
WHERE images IS NULL OR images = '[]'::jsonb;

-- =====================================================
-- 13. UPDATE TIMESTAMPS
-- =====================================================
-- Update updatedAt untuk trigger cache refresh

UPDATE "Project" SET "updatedAt" = NOW();
UPDATE "Article" SET "updatedAt" = NOW();

-- =====================================================
-- 14. CREATE ADMIN USER (via SQL)
-- =====================================================
-- Note: Lebih baik create via Supabase Dashboard → Auth
-- Tapi jika perlu via SQL:

-- INSERT INTO auth.users (
--   instance_id,
--   id,
--   aud,
--   role,
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   created_at,
--   updated_at
-- ) VALUES (
--   '00000000-0000-0000-0000-000000000000',
--   gen_random_uuid(),
--   'authenticated',
--   'authenticated',
--   'admin@example.com',
--   crypt('your_password', gen_salt('bf')),
--   NOW(),
--   NOW(),
--   NOW()
-- );

-- =====================================================
-- 15. PERFORMANCE: ADD MISSING INDEXES
-- =====================================================

-- Indexes untuk performa query
CREATE INDEX IF NOT EXISTS idx_project_createdat ON "Project"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_article_createdat ON "Article"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_message_createdat ON "Message"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_message_isread ON "Message"("isRead");

-- Composite indexes
CREATE INDEX IF NOT EXISTS idx_project_visible_date 
  ON "Project"("showOnHome", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_article_visible_date 
  ON "Article"("showOnHome", "createdAt" DESC);

-- =====================================================
-- 16. VACUUM & ANALYZE (Maintenance)
-- =====================================================
-- Run untuk optimize database performance

VACUUM ANALYZE "Project";
VACUUM ANALYZE "Article";
VACUUM ANALYZE "Message";

-- =====================================================
-- 17. CHECK DATABASE SIZE
-- =====================================================

SELECT 
  pg_size_pretty(pg_database_size(current_database())) as database_size;

-- =====================================================
-- 18. FIND DUPLICATE SLUGS
-- =====================================================

SELECT slug, COUNT(*) as count
FROM "Project"
GROUP BY slug
HAVING COUNT(*) > 1;

SELECT slug, COUNT(*) as count
FROM "Article"
GROUP BY slug
HAVING COUNT(*) > 1;

-- =====================================================
-- 19. RESET AUTO-INCREMENT IDs
-- =====================================================
-- Jika ada gap di ID sequence

SELECT setval(pg_get_serial_sequence('"Project"', 'id'), 
  COALESCE((SELECT MAX(id) FROM "Project"), 1));

SELECT setval(pg_get_serial_sequence('"Article"', 'id'), 
  COALESCE((SELECT MAX(id) FROM "Article"), 1));

-- =====================================================
-- 20. EMERGENCY: DISABLE RLS (TEMPORARY)
-- =====================================================
-- HANYA untuk debugging! Re-enable setelah selesai

-- ALTER TABLE "Project" DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Article" DISABLE ROW LEVEL SECURITY;

-- Jangan lupa re-enable:
-- ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE "Article" ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- END OF QUICK FIXES
-- =====================================================

-- Tips:
-- 1. Selalu backup sebelum run query yang modify data
-- 2. Test di development environment dulu
-- 3. Run query satu per satu, jangan sekaligus
-- 4. Monitor performa setelah add indexes
-- 5. Vacuum regularly untuk maintain performance
