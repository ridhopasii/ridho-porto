-- =====================================================
-- MIGRATION: PageContent editor defaults and uniqueness
-- =====================================================
-- Membuat PageContent konsisten sebagai sumber teks editable dari admin.

CREATE UNIQUE INDEX IF NOT EXISTS idx_pagecontent_page_locale_key
  ON "PageContent" ("page", "locale", "key");

CREATE INDEX IF NOT EXISTS idx_pagecontent_page_locale
  ON "PageContent" ("page", "locale");

-- Home page defaults
INSERT INTO "PageContent" ("page", "locale", "key", "value") VALUES
  ('home', 'en', 'intro', 'Hi, I''m Ridho Robbi Pasi'),
  ('home', 'en', 'location', 'Based in Aceh, Indonesia 🇮🇩'),
  ('home', 'en', 'location_type', 'Onsite'),
  ('home', 'en', 'resume.paragraph_1', 'A Student in Informatics Engineering at UNIMAL passionate about Web Development, UI/UX Design, and Network Engineering.'),
  ('home', 'en', 'resume.paragraph_2', 'I''m always enthusiastic about learning new technologies and applying them to solve real-world problems.'),
  ('home', 'id', 'intro', 'Halo, saya Ridho Robbi Pasi'),
  ('home', 'id', 'location', 'Berdomisili di Aceh, Indonesia 🇮🇩'),
  ('home', 'id', 'location_type', 'Onsite'),
  ('home', 'id', 'resume.paragraph_1', 'Seorang mahasiswa Teknik Informatika UNIMAL yang passionate dalam Web Development, UI/UX Design, dan Network Engineering.'),
  ('home', 'id', 'resume.paragraph_2', 'Saya selalu antusias dalam mempelajari teknologi baru dan menerapkannya dalam memecahkan masalah nyata.')
ON CONFLICT ("page", "locale", "key")
DO UPDATE SET "value" = EXCLUDED."value";

-- About page defaults
INSERT INTO "PageContent" ("page", "locale", "key", "value") VALUES
  ('about', 'en', 'title', 'About'),
  ('about', 'en', 'description', 'A brief introduction to who I am.'),
  ('about', 'en', 'resume.paragraph_1', 'I''m Ridho Robbi Pasi, a student in Informatics Engineering at UNIMAL. Passionate in Web Development, UI/UX Design, and Network Engineering.'),
  ('about', 'en', 'resume.paragraph_2', 'I''m always enthusiastic about learning new technologies and applying them to solve real-world problems.'),
  ('about', 'en', 'resume.paragraph_3', 'I believe that good design and architecture lead to excellent user experiences.'),
  ('about', 'en', 'resume.paragraph_4', 'Best regards,'),
  ('about', 'en', 'career.title', 'Career'),
  ('about', 'en', 'career.sub_title', 'My professional journey.'),
  ('about', 'en', 'organization.title', 'Organization'),
  ('about', 'en', 'organization.sub_title', 'My organizational and community involvement.'),
  ('about', 'en', 'education.title', 'Education'),
  ('about', 'en', 'education.sub_title', 'My educational journey.'),
  ('about', 'en', 'resume_download_button', 'Download Resume'),
  ('about', 'en', 'portfolio_download_button', 'Download Portfolio'),
  ('about', 'en', 'error', 'An error occurred on the server.'),
  ('about', 'en', 'no_data', 'No data available.'),
  ('about', 'id', 'title', 'Tentang'),
  ('about', 'id', 'description', 'Pengenalan singkat mengenai siapa saya.'),
  ('about', 'id', 'resume.paragraph_1', 'Saya Ridho Robbi Pasi, mahasiswa Teknik Informatika UNIMAL. Passionate dalam Web Development, UI/UX Design, dan Network Engineering.'),
  ('about', 'id', 'resume.paragraph_2', 'Saya selalu antusias dalam mempelajari teknologi baru dan menerapkannya dalam memecahkan masalah nyata.'),
  ('about', 'id', 'resume.paragraph_3', 'Saya percaya bahwa desain dan arsitektur yang baik akan menghasilkan pengalaman pengguna yang luar biasa.'),
  ('about', 'id', 'resume.paragraph_4', 'Salam hangat,'),
  ('about', 'id', 'career.title', 'Karier'),
  ('about', 'id', 'career.sub_title', 'Perjalanan profesional saya.'),
  ('about', 'id', 'organization.title', 'Organisasi'),
  ('about', 'id', 'organization.sub_title', 'Keterlibatan saya dalam organisasi dan komunitas.'),
  ('about', 'id', 'education.title', 'Pendidikan'),
  ('about', 'id', 'education.sub_title', 'Perjalanan pendidikan saya.'),
  ('about', 'id', 'resume_download_button', 'Unduh Resume'),
  ('about', 'id', 'portfolio_download_button', 'Unduh Portofolio'),
  ('about', 'id', 'error', 'Terjadi kesalahan pada server.'),
  ('about', 'id', 'no_data', 'Data tidak tersedia.')
ON CONFLICT ("page", "locale", "key")
DO UPDATE SET "value" = EXCLUDED."value";
