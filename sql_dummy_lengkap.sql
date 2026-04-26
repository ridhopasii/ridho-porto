-- ============================================================
-- SQL DUMMY LENGKAP - Portofolio Ridho Robbi Pasi
-- Jalankan di Supabase SQL Editor
-- ============================================================

-- 1. PROFILE
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "images" JSONB DEFAULT '[]';
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;
ALTER TABLE "Profile" ALTER COLUMN "fullName" DROP NOT NULL;
DELETE FROM "Profile" WHERE id NOT IN (SELECT MIN(id) FROM "Profile");

INSERT INTO "Profile" (
  "fullName", name, title, bio, email, location,
  badge, status_text, quote,
  about_tag, about_title,
  education_level, availability,
  instagram_url, linkedin_url, github_url, twitter_url,
  footer_title, footer_sub,
  images
) VALUES (
  'Ridho Robbi Pasi',
  'Ridho Robbi Pasi',
  'TechnoPreneur & Web Developer',
  'Mahasiswa Teknik Informatika yang passionate di bidang web development, desain kreatif, dan kepemimpinan organisasi kepemudaan.',
  'ridhorobbipasi@gmail.com',
  'Malang, Jawa Timur, Indonesia',
  'Duta Pemuda Global',
  'Open for collaborations',
  'Bangun sesuatu yang bermakna, bukan sekadar yang mudah.',
  'Discovery',
  'Beyond the Surface',
  'Informatika · UB',
  'Ready to Work',
  'https://instagram.com/ridhorobbipasi',
  'https://linkedin.com/in/ridhorobbipasi',
  'https://github.com/ridhopasii',
  'https://twitter.com/ridhorobbipasi',
  'LET''S WORK TOGETHER',
  'Punya ide projek atau butuh kolaborasi? Ayo wujudkan bersama.',
  '["https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/gallery_hackathon.png"]'
) ON CONFLICT DO NOTHING;

-- 2. EXPERIENCE
INSERT INTO "Experience" (company, position, period, description, "logoUrl", slug, "updatedAt") VALUES
('Kominfo RI - GDSC', 'Web Developer Intern', '2024 - Sekarang', 'Mengembangkan aplikasi web untuk program digitalisasi layanan pemerintah menggunakan Next.js dan Supabase.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Chrome_icon_%28September_2014%29.svg/480px-Google_Chrome_icon_%28September_2014%29.svg.png', 'exp-kominfo-gdsc', NOW()),
('BEM FILKOM UB', 'Ketua Departemen Teknologi', '2023 - 2024', 'Memimpin departemen teknologi dengan 12 anggota, mengelola platform digital BEM dan menyelenggarakan 5+ workshop tech.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png', 'exp-bem-filkom', NOW()),
('Startup Lokal - DevMalang', 'Frontend Developer', '2022 - 2023', 'Membangun UI/UX untuk platform marketplace UMKM lokal berbasis React dan TailwindCSS dengan 500+ pengguna aktif.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/320px-Amazon_logo.svg.png', 'exp-devmalang', NOW()),
('Freelance', 'Full Stack Developer', '2021 - 2022', 'Mengerjakan 10+ proyek web untuk klien UMKM, institusi pendidikan, dan komunitas kepemudaan.', NULL, 'exp-freelance', NOW()),
('HIPMI UB', 'Sekretaris Umum', '2023 - 2024', 'Mengkoordinasikan kegiatan Himpunan Pengusaha Muda Indonesia cabang Universitas Brawijaya, 80+ anggota aktif.', NULL, 'exp-hipmi-ub', NOW()),
('Youth Icon Indonesia', 'Top 10 Finalis', '2024', 'Terpilih sebagai Top 10 Youth Icon Indonesia oleh HIPMI Nasional dari 500+ pendaftar seluruh Indonesia.', NULL, 'exp-youth-icon', NOW())
ON CONFLICT (slug) DO NOTHING;

-- 3. EDUCATION
ALTER TABLE "Education" ADD COLUMN IF NOT EXISTS description TEXT;
INSERT INTO "Education" (institution, degree, major, period, description, "logoUrl", "proofUrl", slug, "updatedAt") VALUES
('Universitas Brawijaya', 'S1', 'Teknik Informatika', '2021 - Sekarang', 'Fokus pada rekayasa perangkat lunak, kecerdasan buatan, dan sistem informasi. IPK 3.75/4.00.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/University_of_Brawijaya_Logo.svg/480px-University_of_Brawijaya_Logo.svg.png', NULL, 'edu-ub-informatika', NOW()),
('SMA Negeri 1 Malang', 'SMA', 'IPA', '2018 - 2021', 'Lulus dengan nilai rata-rata 92.5. Aktif di OSIS, KIR, dan Paskibraka Kota Malang.', NULL, NULL, 'edu-sman1-malang', NOW()),
('SMP Negeri 3 Malang', 'SMP', 'Reguler', '2015 - 2018', 'Lulus dengan nilai terbaik angkatan. Juara olimpiade matematika tingkat kota.', NULL, NULL, 'edu-smpn3-malang', NOW()),
('Coursera - Google', 'Sertifikat', 'Google UX Design Certificate', '2023', 'Menyelesaikan program sertifikasi UX Design dari Google melalui platform Coursera dalam 6 bulan.', NULL, NULL, 'edu-google-ux', NOW()),
('Dicoding Indonesia', 'Sertifikat', 'Full Stack Web Developer', '2022', 'Lulus program Dicoding dengan predikat bintang 5 untuk seluruh modul front-end dan back-end.', NULL, NULL, 'edu-dicoding-fullstack', NOW()),
('Bangkit Academy', 'Sertifikat', 'Cloud Computing Path', '2024', 'Peserta Bangkit Academy 2024 jalur Cloud Computing, berkolaborasi dengan Google, GoTo, dan Traveloka.', NULL, NULL, 'edu-bangkit-cloud', NOW())
ON CONFLICT (slug) DO NOTHING;

-- 4. SKILL
INSERT INTO "Skill" (name, category, level, icon, "updatedAt") VALUES
('Next.js', 'Frontend', 90, 'nextjs', NOW()),
('React.js', 'Frontend', 88, 'react', NOW()),
('TailwindCSS', 'Frontend', 92, 'tailwind', NOW()),
('TypeScript', 'Frontend', 80, 'typescript', NOW()),
('Figma & UI/UX', 'Design', 85, 'figma', NOW()),
('Node.js', 'Backend', 78, 'nodejs', NOW()),
('Supabase', 'Backend', 88, 'supabase', NOW()),
('PostgreSQL', 'Backend', 75, 'postgresql', NOW()),
('Git & GitHub', 'Tools', 90, 'github', NOW()),
('Docker', 'Tools', 65, 'docker', NOW()),
('Photoshop', 'Design', 80, 'photoshop', NOW()),
('Laravel / PHP', 'Backend', 70, 'laravel', NOW())
ON CONFLICT DO NOTHING;

-- 5. ORGANIZATION
INSERT INTO "Organization" (name, role, period, description, "logoUrl", slug, "updatedAt") VALUES
('BEM FILKOM Universitas Brawijaya', 'Ketua Departemen Teknologi Informasi', '2023 - 2024', 'Memimpin divisi teknologi dengan fokus digitalisasi layanan BEM dan penyelenggaraan event teknologi kampus.', NULL, 'org-bem-filkom', NOW()),
('HIPMI PT Universitas Brawijaya', 'Sekretaris Umum', '2023 - 2024', 'Mengkoordinasikan administrasi dan kegiatan 80+ anggota pengusaha muda mahasiswa UB.', NULL, 'org-hipmi-ub', NOW()),
('Google Developer Student Club UB', 'Core Team - Mobile Developer', '2022 - 2023', 'Bagian dari tim inti GDSC UB, mengelola workshop mobile development dan hackathon internal.', NULL, 'org-gdsc-ub', NOW()),
('Paskibraka Kota Malang', 'Anggota Inti', '2020 - 2021', 'Terpilih mewakili Kota Malang sebagai Paskibraka pada perayaan HUT RI ke-75 dan ke-76.', NULL, 'org-paskibraka-malang', NOW()),
('Komunitas Coding Malang', 'Co-Founder & Koordinator', '2022 - Sekarang', 'Mendirikan komunitas developer lokal Malang dengan 200+ anggota aktif, mengadakan meetup bulanan.', NULL, 'org-coding-malang', NOW()),
('UKM Kewirausahaan UB', 'Divisi Digital Marketing', '2021 - 2022', 'Mengelola strategi pemasaran digital UKM dengan meningkatkan engagement media sosial 300%.', NULL, 'org-ukm-ub', NOW())
ON CONFLICT (slug) DO NOTHING;

-- 6. AWARD
INSERT INTO "Award" (title, issuer, date, description, slug, "updatedAt") VALUES
('Top 10 Youth Icon Indonesia', 'HIPMI Nasional', '2024', 'Terpilih sebagai Top 10 Youth Icon Indonesia dari 500+ pendaftar seluruh nusantara.', 'award-youth-icon-2024', NOW()),
('Juara 1 Hackathon Smart Village Nasional', 'Kemendesa PDTT', '2023', 'Memenangkan hackathon nasional kategori Smart Village dengan solusi sistem informasi desa berbasis web.', 'award-hackathon-smartvillage', NOW()),
('Mahasiswa Berprestasi FILKOM UB', 'Universitas Brawijaya', '2023', 'Dinobatkan sebagai mahasiswa berprestasi tingkat fakultas atas kontribusi di bidang akademik dan organisasi.', 'award-mawapres-filkom', NOW()),
('Best Paper - Seminar Teknologi Nasional', 'Universitas Indonesia', '2024', 'Karya ilmiah tentang implementasi AI dalam sistem UMKM digital mendapat predikat best paper.', 'award-best-paper-2024', NOW()),
('Finalis PKM-KC Nasional', 'Kemendikbudristek', '2023', 'Lolos seleksi nasional Program Kreativitas Mahasiswa bidang Karya Cipta dengan inovasi EdTech.', 'award-pkm-kc-2023', NOW()),
('Sertifikat Bangkit Distinction', 'Google · GoTo · Traveloka', '2024', 'Menyelesaikan Bangkit Academy 2024 dengan predikat Distinguished Graduate top 10% peserta.', 'award-bangkit-distinction', NOW())
ON CONFLICT (slug) DO NOTHING;

-- 7. PUBLICATION
INSERT INTO "Publication" (title, publisher, date, abstract, slug, "updatedAt") VALUES
('Implementasi Machine Learning untuk Deteksi Hoaks di Media Sosial Indonesia', 'Jurnal Teknologi Informasi UB', '2024', 'Penelitian tentang model klasifikasi teks berbasis BERT untuk mendeteksi konten hoaks bahasa Indonesia di platform media sosial dengan akurasi 94.3%.', 'pub-ml-hoaks-2024', NOW()),
('Digitalisasi UMKM Lokal di Era Post-Pandemi', 'Jurnal Teknologi & Masyarakat', '2024', 'Analisis strategi digitalisasi UMKM lokal Indonesia pasca pandemi menggunakan pendekatan mixed-method dengan 50 sampel UMKM Kota Malang.', 'pub-digitalisasi-umkm-2024', NOW()),
('Smart Village: Model Sistem Informasi Desa Berbasis Web', 'Prosiding SEMNASTEK', '2023', 'Perancangan dan implementasi sistem informasi desa digital yang mencakup modul kependudukan, keuangan, dan layanan publik.', 'pub-smart-village-2023', NOW()),
('Pengaruh UI/UX terhadap Konversi E-Commerce UMKM', 'Jurnal Manajemen & Bisnis Digital', '2024', 'Studi tentang hubungan kualitas antarmuka pengguna dengan tingkat konversi penjualan pada platform e-commerce UMKM lokal.', 'pub-uiux-ecommerce-2024', NOW()),
('Implementasi PWA untuk Layanan Publik Desa', 'Seminar Nasional Informatika', '2023', 'Pengembangan Progressive Web Application untuk meningkatkan aksesibilitas layanan publik di desa-desa terpencil Indonesia.', 'pub-pwa-desa-2023', NOW()),
('Analisis Keamanan Sistem Informasi pada Startup Teknologi', 'JISKA - Jurnal Informatika Sunan Kalijaga', '2023', 'Evaluasi kerentanan keamanan sistem informasi pada 10 startup teknologi early-stage menggunakan metode OWASP Top 10.', 'pub-security-startup-2023', NOW())
ON CONFLICT (slug) DO NOTHING;

-- 8. GALLERY (dengan foto dummy dari storage)
INSERT INTO "Gallery" (title, category, date, description, images) VALUES
('Hackathon Smart Village Nasional 2023', 'prestasi', '2023', 'Momen kemenangan tim kami di hackathon nasional Smart Village yang diselenggarakan Kemendesa PDTT Jakarta.', '["https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/gallery_hackathon.png"]'),
('Workshop Web Development DevMalang', 'kegiatan', '2024', 'Mengisi workshop dasar web development untuk 50+ peserta dari berbagai latar belakang di Kota Malang.', '["https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/gallery_workshop.png"]'),
('Rapat Koordinasi BEM FILKOM UB', 'organisasi', '2023', 'Rapat koordinasi perdana pengurus BEM Fakultas Ilmu Komputer periode 2023-2024.', '["https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/gallery_organization.png"]'),
('Malam Penghargaan Youth Icon 2024', 'prestasi', '2024', 'Momen menerima penghargaan Top 10 Indonesia Youth Icon dari HIPMI Nasional di Jakarta.', '["https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/gallery_award.png"]'),
('Paskibraka Kota Malang HUT RI ke-76', 'kegiatan', '2021', 'Kebanggaan terpilih sebagai Paskibraka Kota Malang dalam peringatan kemerdekaan RI ke-76.', '["https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/gallery_paskibraka.png"]'),
('Studi Banding & Kunjungan Kampus 2024', 'pendidikan', '2024', 'Studi banding bersama delegasi mahasiswa se-Indonesia ke kampus dan perusahaan teknologi di Jakarta.', '["https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/gallery_campus.png"]');

-- 9. PROJECT
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "projectUrl" TEXT;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "slug" TEXT UNIQUE;
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE "Project" ALTER COLUMN "updatedAt" SET DEFAULT NOW();

INSERT INTO "Project" (title, description, tags, "imageUrl", "projectUrl", slug) VALUES
('Portofolio Ridho Robbi Pasi', 'Portofolio personal full-stack dengan CMS admin, realtime Supabase, dark mode premium, dan multi-foto swipe.', 'Next.js,Supabase,TailwindCSS,PostgreSQL', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/project_portfolio.png', 'https://ridhorobbipasi.my.id', 'project-portfolio-ridho'),
('Smart Village Information System', 'Sistem informasi desa digital dengan modul kependudukan, keuangan, absensi, dan agenda desa berbasis web.', 'React,Node.js,PostgreSQL,Leaflet', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/project_smartvillage.png', NULL, 'project-smart-village'),
('UMKM Digital Platform', 'Platform e-commerce khusus UMKM lokal dengan fitur manajemen produk, pesanan, dan laporan keuangan otomatis.', 'Next.js,Stripe,Supabase,TailwindCSS', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/blog_tech.png', NULL, 'project-umkm-platform'),
('Pesantren Management System', 'Sistem manajemen pesantren komprehensif: data santri, keuangan, absensi, dan dokumentasi kegiatan harian.', 'Laravel,MySQL,Bootstrap,PHP', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/project_portfolio.png', NULL, 'project-pesantren-ms'),
('Brand Identity Batik Nusantara', 'Paket branding lengkap untuk UMKM batik lokal: logo, panduan merek, template sosmed, dan konten pemasaran.', 'Photoshop,Canva,Illustrator,Figma', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/blog_career.png', NULL, 'project-batik-brand'),
('Mobile Attendance App', 'Aplikasi absensi berbasis GPS untuk organisasi kepemudaan dengan dashboard laporan real-time dan notifikasi push.', 'React Native,Supabase,Expo,Maps API', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/project_smartvillage.png', NULL, 'project-attendance-app')
ON CONFLICT (slug) DO NOTHING;

-- 10. ARTICLE
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "published" BOOLEAN DEFAULT true;
ALTER TABLE "Article" ALTER COLUMN "updatedAt" SET DEFAULT NOW();

INSERT INTO "Article" (title, slug, content, excerpt, "imageUrl", category, published) VALUES
('Memulai Karir sebagai Full Stack Developer di Usia Muda', 'memulai-karir-fullstack', 'Memulai karir di bidang teknologi di usia muda bukanlah hal yang mustahil. Dengan tekad kuat, konsistensi belajar, dan portofolio yang kuat, siapapun bisa menjadi developer handal. Mulailah dari dasar: HTML, CSS, JavaScript — jangan lewatkan fondasinya.', 'Panduan lengkap bagi pemuda yang ingin memulai karir sebagai full stack developer dari nol.', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/blog_career.png', 'Karir', true),
('Supabase vs Firebase: Mana yang Lebih Cocok untuk Project Modern?', 'supabase-vs-firebase', 'Dua platform BaaS populer ini memiliki kelebihan masing-masing. Supabase berbasis PostgreSQL dan open-source dengan kueri SQL penuh. Firebase dari Google menggunakan NoSQL yang lebih fleksibel untuk data real-time sederhana.', 'Analisis lengkap kelebihan dan kekurangan Supabase vs Firebase untuk project modern.', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/blog_tech.png', 'Teknologi', true),
('Belajar Next.js 14 App Router dari Nol untuk Pemula', 'belajar-nextjs-14', 'Next.js 14 dengan App Router adalah game changer. Server Components, streaming, dan built-in optimization membuat pengembangan web menjadi jauh lebih efisien. Tutorial ini memandu kamu dari instalasi hingga deploy production.', 'Tutorial step-by-step belajar Next.js 14 dengan App Router untuk pemula absolut.', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/blog_tech.png', 'Tutorial', true),
('Pentingnya Soft Skill bagi Seorang Developer di Dunia Kerja Nyata', 'softskill-penting-developer', 'Komunikasi efektif, manajemen waktu, dan kemampuan berkolaborasi dalam tim adalah soft skill yang sering diremehkan namun sangat krusial. Banyak developer teknis hebat gagal berkembang karir karena kurang soft skill.', 'Mengapa komunikasi dan kepemimpinan sama pentingnya dengan kemampuan coding.', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/blog_career.png', 'Karir', true),
('Membangun Portofolio Digital yang Meninggalkan Kesan Mendalam', 'membangun-portofolio-digital', 'Portofolio adalah wajah profesional kamu di dunia digital — yang pertama dilihat recruiter atau klien. Buat portofolio yang bercerita, bukan hanya memajang daftar teknologi. Tambahkan konteks, dampak, dan personaliti.', 'Cara membangun portofolio digital yang profesional dan meninggalkan kesan mendalam.', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/blog_career.png', 'Personal', true),
('Tips Time Management untuk Mahasiswa Aktif Organisasi', 'tips-time-management-mahasiswa', 'Menjadi aktif di organisasi sambil menjaga IPK dan mengerjakan freelance adalah tantangan nyata. Strategi time blocking, prioritas dengan Eisenhower Matrix, dan weekly review terbukti efektif membantu keseimbangan.', 'Strategi manajemen waktu yang efektif bagi mahasiswa yang aktif berorganisasi.', 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/dummy/blog_tech.png', 'Lifestyle', true)
ON CONFLICT (slug) DO NOTHING;

-- CEK HASIL AKHIR
SELECT
  (SELECT COUNT(*) FROM "Profile") as profil,
  (SELECT COUNT(*) FROM "Experience") as experience,
  (SELECT COUNT(*) FROM "Education") as education,
  (SELECT COUNT(*) FROM "Skill") as skill,
  (SELECT COUNT(*) FROM "Organization") as organisasi,
  (SELECT COUNT(*) FROM "Award") as award,
  (SELECT COUNT(*) FROM "Publication") as publikasi,
  (SELECT COUNT(*) FROM "Gallery") as gallery,
  (SELECT COUNT(*) FROM "Project") as project,
  (SELECT COUNT(*) FROM "Article") as artikel;
