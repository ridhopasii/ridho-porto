-- Tambah kolom yang kurang di Project
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "projectUrl" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "slug" TEXT UNIQUE;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE "Project" ALTER COLUMN "updatedAt" SET DEFAULT NOW();

-- GALLERY
INSERT INTO "Gallery" (title, category, date, description, images) VALUES
('Hackathon Smart Village Nasional 2023', 'prestasi', '2023', 'Momen kemenangan tim kami di hackathon nasional Smart Village yang diselenggarakan Kemendesa.', '["https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/gallery_hackathon.png"]'),
('Workshop Web Development Dev Malang', 'kegiatan', '2024', 'Mengisi workshop dasar web development untuk 50+ peserta dari berbagai latar belakang.', '["https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/gallery_workshop.png"]'),
('Rapat Koordinasi BEM FILKOM UB', 'organisasi', '2023', 'Rapat koordinasi perdana pengurus BEM Fakultas Ilmu Komputer periode 2023-2024.', '["https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/gallery_organization.png"]'),
('Malam Penghargaan Youth Icon 2024', 'prestasi', '2024', 'Momen menerima penghargaan Top 10 Indonesia Youth Icon dari HIPMI nasional.', '["https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/gallery_award.png"]'),
('Paskibraka Kota Malang HUT RI ke-76', 'kegiatan', '2021', 'Kebanggaan terpilih sebagai Paskibraka Kota Malang dalam peringatan kemerdekaan RI.', '["https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/gallery_paskibraka.png"]'),
('Studi Banding dan Kunjungan Kampus 2024', 'pendidikan', '2024', 'Studi banding bersama delegasi mahasiswa se-Indonesia ke kampus dan perusahaan teknologi.', '["https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/gallery_campus.png"]');

-- PROJECT
INSERT INTO "Project" (title, description, tags, "imageUrl", "projectUrl", slug) VALUES
('Portofolio Ridho Robbi Pasi', 'Portofolio personal full-stack dengan CMS admin, realtime Supabase, dan desain premium dark mode.', 'Next.js,Supabase,TailwindCSS,PostgreSQL', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/project_portfolio.png', 'https://ridhorobbipasi.my.id', 'project-portfolio-ridho'),
('Smart Village Information System', 'Sistem informasi desa digital dengan modul kependudukan, keuangan, dan agenda desa berbasis web.', 'React,Node.js,PostgreSQL,Leaflet', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/project_smartvillage.png', NULL, 'project-smart-village'),
('UMKM Digital Platform', 'Platform e-commerce khusus UMKM lokal dengan fitur manajemen produk, pesanan, dan laporan keuangan.', 'Next.js,Stripe,Supabase,TailwindCSS', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/blog_tech.png', NULL, 'project-umkm-platform'),
('Pesantren Management System', 'Sistem manajemen pesantren: data santri, keuangan, absensi, dan dokumentasi kegiatan.', 'Laravel,MySQL,Bootstrap,PHP', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/project_portfolio.png', NULL, 'project-pesantren-ms'),
('Brand Identity Batik Nusantara', 'Paket branding lengkap untuk UMKM batik lokal: logo, panduan merek, dan konten media sosial.', 'Photoshop,Canva,Illustrator', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/blog_career.png', NULL, 'project-batik-brand'),
('Mobile Attendance App', 'Aplikasi absensi berbasis GPS untuk organisasi kepemudaan dengan dashboard laporan real-time.', 'React Native,Supabase,Expo', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/project_smartvillage.png', NULL, 'project-attendance-app')
ON CONFLICT (slug) DO NOTHING;

-- ARTICLE
INSERT INTO "Article" (title, slug, content, excerpt, "imageUrl", category, published) VALUES
('Memulai Karir sebagai Full Stack Developer di Usia Muda', 'memulai-karir-fullstack', 'Memulai karir di bidang teknologi di usia muda bukanlah hal yang mustahil. Mulailah dari dasar: HTML, CSS, JavaScript.', 'Panduan lengkap bagi pemuda yang ingin memulai karir sebagai full stack developer dari nol.', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/blog_career.png', 'Karir', true),
('Supabase vs Firebase: Mana yang Lebih Cocok?', 'supabase-vs-firebase', 'Dua platform BaaS populer ini memiliki kelebihan masing-masing. Supabase berbasis PostgreSQL open-source, Firebase dari Google dengan NoSQL.', 'Analisis lengkap kelebihan dan kekurangan Supabase vs Firebase untuk project modern.', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/blog_tech.png', 'Teknologi', true),
('Belajar Next.js 14 dari Nol untuk Pemula', 'belajar-nextjs-14', 'Next.js adalah framework React yang memungkinkan server-side rendering, static generation, dan banyak fitur production-ready out of the box.', 'Tutorial step-by-step belajar Next.js 14 dengan App Router untuk pemula absolut.', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/blog_tech.png', 'Tutorial', true),
('Pentingnya Soft Skill bagi Seorang Developer', 'softskill-penting-developer', 'Komunikasi, manajemen waktu, dan kemampuan berkolaborasi adalah soft skill yang sering diremehkan namun sangat krusial.', 'Mengapa komunikasi dan kepemimpinan sama pentingnya dengan kemampuan coding.', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/blog_career.png', 'Karir', true),
('Membangun Portofolio Digital yang Menarik', 'membangun-portofolio-digital', 'Portofolio adalah wajah profesional kamu di dunia digital. Ini yang pertama dilihat klien atau recruiter sebelum memutuskan untuk menghubungimu.', 'Cara membangun portofolio digital yang profesional dan meninggalkan kesan mendalam.', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/blog_career.png', 'Personal', true),
('Tips Time Management untuk Mahasiswa Aktif', 'tips-time-management-mahasiswa', 'Menjadi aktif di organisasi sambil menjaga IPK adalah tantangan nyata. Berikut strategi yang telah terbukti efektif: time blocking dan prioritas tugas.', 'Strategi manajemen waktu yang efektif bagi mahasiswa yang aktif berorganisasi.', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/blog_tech.png', 'Lifestyle', true)
ON CONFLICT (slug) DO NOTHING;

-- CEK HASIL
SELECT
  (SELECT COUNT(*) FROM "Gallery") as gallery,
  (SELECT COUNT(*) FROM "Project") as project,
  (SELECT COUNT(*) FROM "Article") as article;
