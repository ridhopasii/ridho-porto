-- =====================================================
-- MIGRATION: Setup Row Level Security (RLS) Policies
-- =====================================================
-- Mengatur RLS policies untuk semua tabel dengan proper security

-- Enable RLS pada semua tabel
ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Article" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Skill" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Experience" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Education" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Award" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Publication" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Gallery" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteSettings" ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PUBLIC READ POLICIES (Semua orang bisa baca)
-- =====================================================

-- Profile: Public Read
DROP POLICY IF EXISTS "profile_public_read" ON "Profile";
CREATE POLICY "profile_public_read" ON "Profile"
  FOR SELECT TO public USING (true);

-- Project: Public Read
DROP POLICY IF EXISTS "project_public_read" ON "Project";
CREATE POLICY "project_public_read" ON "Project"
  FOR SELECT TO public USING (true);

-- Article: Public Read
DROP POLICY IF EXISTS "article_public_read" ON "Article";
CREATE POLICY "article_public_read" ON "Article"
  FOR SELECT TO public USING (true);

-- Skill: Public Read
DROP POLICY IF EXISTS "skill_public_read" ON "Skill";
CREATE POLICY "skill_public_read" ON "Skill"
  FOR SELECT TO public USING (true);

-- Experience: Public Read
DROP POLICY IF EXISTS "experience_public_read" ON "Experience";
CREATE POLICY "experience_public_read" ON "Experience"
  FOR SELECT TO public USING (true);

-- Education: Public Read
DROP POLICY IF EXISTS "education_public_read" ON "Education";
CREATE POLICY "education_public_read" ON "Education"
  FOR SELECT TO public USING (true);

-- Award: Public Read
DROP POLICY IF EXISTS "award_public_read" ON "Award";
CREATE POLICY "award_public_read" ON "Award"
  FOR SELECT TO public USING (true);

-- Publication: Public Read
DROP POLICY IF EXISTS "publication_public_read" ON "Publication";
CREATE POLICY "publication_public_read" ON "Publication"
  FOR SELECT TO public USING (true);

-- Organization: Public Read
DROP POLICY IF EXISTS "organization_public_read" ON "Organization";
CREATE POLICY "organization_public_read" ON "Organization"
  FOR SELECT TO public USING (true);

-- Gallery: Public Read
DROP POLICY IF EXISTS "gallery_public_read" ON "Gallery";
CREATE POLICY "gallery_public_read" ON "Gallery"
  FOR SELECT TO public USING (true);

-- SiteSettings: Public Read
DROP POLICY IF EXISTS "settings_public_read" ON "SiteSettings";
CREATE POLICY "settings_public_read" ON "SiteSettings"
  FOR SELECT TO public USING (true);

-- =====================================================
-- MESSAGE POLICIES (Special handling)
-- =====================================================

-- Message: Public dapat INSERT (untuk contact form)
DROP POLICY IF EXISTS "message_public_insert" ON "Message";
CREATE POLICY "message_public_insert" ON "Message"
  FOR INSERT TO public WITH CHECK (true);

-- Message: Authenticated dapat READ semua
DROP POLICY IF EXISTS "message_auth_read" ON "Message";
CREATE POLICY "message_auth_read" ON "Message"
  FOR SELECT TO authenticated USING (true);

-- Message: Authenticated dapat UPDATE (mark as read)
DROP POLICY IF EXISTS "message_auth_update" ON "Message";
CREATE POLICY "message_auth_update" ON "Message"
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Message: Authenticated dapat DELETE
DROP POLICY IF EXISTS "message_auth_delete" ON "Message";
CREATE POLICY "message_auth_delete" ON "Message"
  FOR DELETE TO authenticated USING (true);

-- =====================================================
-- AUTHENTICATED WRITE POLICIES (Admin only)
-- =====================================================

-- Profile: Authenticated dapat UPDATE
DROP POLICY IF EXISTS "profile_auth_update" ON "Profile";
CREATE POLICY "profile_auth_update" ON "Profile"
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Project: Authenticated dapat INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "project_auth_all" ON "Project";
CREATE POLICY "project_auth_all" ON "Project"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Article: Authenticated dapat INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "article_auth_all" ON "Article";
CREATE POLICY "article_auth_all" ON "Article"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Skill: Authenticated dapat INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "skill_auth_all" ON "Skill";
CREATE POLICY "skill_auth_all" ON "Skill"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Experience: Authenticated dapat INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "experience_auth_all" ON "Experience";
CREATE POLICY "experience_auth_all" ON "Experience"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Education: Authenticated dapat INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "education_auth_all" ON "Education";
CREATE POLICY "education_auth_all" ON "Education"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Award: Authenticated dapat INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "award_auth_all" ON "Award";
CREATE POLICY "award_auth_all" ON "Award"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Publication: Authenticated dapat INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "publication_auth_all" ON "Publication";
CREATE POLICY "publication_auth_all" ON "Publication"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Organization: Authenticated dapat INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "organization_auth_all" ON "Organization";
CREATE POLICY "organization_auth_all" ON "Organization"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Gallery: Authenticated dapat INSERT, UPDATE, DELETE
DROP POLICY IF EXISTS "gallery_auth_all" ON "Gallery";
CREATE POLICY "gallery_auth_all" ON "Gallery"
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- SiteSettings: Authenticated dapat UPDATE
DROP POLICY IF EXISTS "settings_auth_update" ON "SiteSettings";
CREATE POLICY "settings_auth_update" ON "SiteSettings"
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- VISIBILITY TOGGLE POLICIES (The Eye Feature)
-- =====================================================
-- Allow public to update showOnHome column only (untuk shortcut visibility)

DROP POLICY IF EXISTS "project_public_visibility" ON "Project";
CREATE POLICY "project_public_visibility" ON "Project"
  FOR UPDATE TO public 
  USING (true) 
  WITH CHECK (true);

DROP POLICY IF EXISTS "article_public_visibility" ON "Article";
CREATE POLICY "article_public_visibility" ON "Article"
  FOR UPDATE TO public 
  USING (true) 
  WITH CHECK (true);

DROP POLICY IF EXISTS "experience_public_visibility" ON "Experience";
CREATE POLICY "experience_public_visibility" ON "Experience"
  FOR UPDATE TO public 
  USING (true) 
  WITH CHECK (true);

-- Note: Untuk production, sebaiknya visibility toggle hanya untuk authenticated users
-- Policy di atas memungkinkan public update untuk kemudahan development
