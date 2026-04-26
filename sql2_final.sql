-- SET DEFAULT updatedAt (cegah NOT NULL error)
ALTER TABLE "Publication" ALTER COLUMN "updatedAt" SET DEFAULT NOW();
ALTER TABLE "Experience" ALTER COLUMN "updatedAt" SET DEFAULT NOW();
ALTER TABLE "Education" ALTER COLUMN "updatedAt" SET DEFAULT NOW();
ALTER TABLE "Organization" ALTER COLUMN "updatedAt" SET DEFAULT NOW();
ALTER TABLE "Award" ALTER COLUMN "updatedAt" SET DEFAULT NOW();
ALTER TABLE "Skill" ALTER COLUMN "updatedAt" SET DEFAULT NOW();
ALTER TABLE "Article" ALTER COLUMN "updatedAt" SET DEFAULT NOW();
ALTER TABLE "Project" ALTER COLUMN "updatedAt" SET DEFAULT NOW();

-- TAMBAH KOLOM BARU
ALTER TABLE "Education" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "Education" ADD COLUMN IF NOT EXISTS "slug" TEXT UNIQUE;
ALTER TABLE "Education" ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;
ALTER TABLE "Education" ADD COLUMN IF NOT EXISTS "proofUrl" TEXT;
ALTER TABLE "Education" ADD COLUMN IF NOT EXISTS "images" JSONB;
ALTER TABLE "Experience" ADD COLUMN IF NOT EXISTS "slug" TEXT UNIQUE;
ALTER TABLE "Experience" ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;
ALTER TABLE "Experience" ADD COLUMN IF NOT EXISTS "images" JSONB;
ALTER TABLE "Skill" ADD COLUMN IF NOT EXISTS "slug" TEXT UNIQUE;
ALTER TABLE "Skill" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "Skill" ADD COLUMN IF NOT EXISTS "images" JSONB;
ALTER TABLE "Skill" ADD COLUMN IF NOT EXISTS "category" TEXT;
ALTER TABLE "Skill" ADD COLUMN IF NOT EXISTS "percentage" INTEGER;
ALTER TABLE "Organization" ADD COLUMN IF NOT EXISTS "slug" TEXT UNIQUE;
ALTER TABLE "Award" ADD COLUMN IF NOT EXISTS "slug" TEXT UNIQUE;
ALTER TABLE "Publication" ADD COLUMN IF NOT EXISTS "slug" TEXT UNIQUE;
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "excerpt" TEXT;
ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "category" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "cvLink" TEXT;

-- INSERT EXPERIENCE
INSERT INTO "Experience" (company, position, period, description, slug, "logoUrl", "proofUrl") VALUES
('Google Indonesia', 'Frontend Developer Intern', 'Jan 2024 - Jun 2024', 'Membangun antarmuka web menggunakan React dan Next.js untuk produk internal Google Indonesia.', 'exp-google-2024', 'https://logo.clearbit.com/google.com', 'https://linkedin.com'),
('BUMP Pesantren', 'Ketua Bagian Dokumentasi', 'Jan 2023 - Jan 2024', 'Memimpin tim dokumentasi, mengatur kegiatan foto dan video pesantren.', 'exp-bump-2023', NULL, NULL),
('Freelance Design', 'Graphic Designer', 'Jun 2022 - Des 2022', 'Desain branding, poster, dan konten media sosial untuk UMKM lokal.', 'exp-freelance-2022', NULL, NULL),
('Karang Taruna Desa', 'Ketua Divisi IT', 'Mar 2022 - Mar 2023', 'Membangun website desa dan mengelola media sosial organisasi kepemudaan.', 'exp-karangtaruna-2022', NULL, NULL),
('PT Nusantara Digital', 'Web Developer Part-time', 'Jul 2023 - Des 2023', 'Mengembangkan fitur e-commerce menggunakan Node.js dan PostgreSQL.', 'exp-nusantara-2023', NULL, NULL),
('Startup Lokal Barokah', 'Co-Founder & CTO', 'Jan 2024 - Sekarang', 'Mendirikan startup agribisnis digital, memimpin pengembangan platform dari nol.', 'exp-barokah-2024', NULL, NULL)
ON CONFLICT (slug) DO NOTHING;

-- INSERT EDUCATION
INSERT INTO "Education" (institution, degree, major, period, description, slug, "logoUrl", "proofUrl") VALUES
('Universitas Brawijaya', 'S1', 'Teknik Informatika', '2022 - Sekarang', 'Fokus pada pengembangan perangkat lunak, kecerdasan buatan, dan sistem terdistribusi.', 'edu-ub-2022', 'https://logo.clearbit.com/ub.ac.id', NULL),
('SMKN 1 Malang', 'SMK', 'Rekayasa Perangkat Lunak', '2019 - 2022', 'Juara 1 LKS Tingkat Kota bidang Web Design. Aktif di OSIS dan Paskibraka.', 'edu-smkn1-2019', NULL, NULL),
('Pesantren Modern Al-Amien', 'Pesantren', 'Ilmu Agama dan Kepemimpinan', '2016 - 2019', 'Mendalami ilmu agama sekaligus mengembangkan jiwa kepemimpinan.', 'edu-alamien-2016', NULL, NULL),
('Dicoding Academy', 'Sertifikasi', 'Front-End Web Developer', '2023', 'Menyelesaikan kelas Front-End Web dari Pemula hingga Expert.', 'edu-dicoding-2023', 'https://logo.clearbit.com/dicoding.com', 'https://dicoding.com/certificates'),
('Coursera - Google', 'Sertifikasi', 'Google IT Support Professional', '2023', 'Sertifikasi internasional Google mencakup networking, OS, dan cybersecurity.', 'edu-google-cert-2023', 'https://logo.clearbit.com/google.com', 'https://coursera.org'),
('SMPN 2 Malang', 'SMP', 'IPA', '2013 - 2016', 'Aktif dalam ekstrakurikuler olimpiade matematika dan komputer.', 'edu-smp-2013', NULL, NULL)
ON CONFLICT (slug) DO NOTHING;

-- INSERT SKILL
INSERT INTO "Skill" (name, level, category, percentage, description, slug) VALUES
('Next.js', 'Expert', 'hardskill', 95, 'Framework React untuk production - SSR, SSG, API Routes, dan App Router.', 'skill-nextjs'),
('Adobe Photoshop', 'Expert', 'design', 90, 'Desain grafis, photo editing, dan pembuatan aset visual berkualitas tinggi.', 'skill-photoshop'),
('Node.js', 'Advanced', 'hardskill', 85, 'Backend development dengan Express.js, REST API, dan integrasi database.', 'skill-nodejs'),
('Canva', 'Expert', 'design', 95, 'Desain konten media sosial, presentasi, dan materi marketing secara cepat.', 'skill-canva'),
('PostgreSQL', 'Advanced', 'hardskill', 80, 'Desain skema database relasional, query optimisasi, dan manajemen data.', 'skill-postgresql'),
('Instagram Marketing', 'Expert', 'softskill', 92, 'Strategi konten, copywriting, dan growth hacking untuk brand awareness.', 'skill-instagram-marketing')
ON CONFLICT (slug) DO NOTHING;

-- INSERT ORGANIZATION
INSERT INTO "Organization" (name, role, period, description, website, slug, "order") VALUES
('BEM Fakultas Ilmu Komputer UB', 'Kepala Departemen Komunikasi dan Informasi', 'Sep 2023 - Sep 2024', 'Memimpin tim humas dan media sosial fakultas.', NULL, 'org-bem-filkom', 1),
('BUMP Pesantren Al-Amien', 'Ketua Bagian Dokumentasi', 'Jan 2023 - Jan 2024', 'Mengoordinasikan kegiatan dokumentasi foto dan video pesantren.', NULL, 'org-bump-alamien', 2),
('Karang Taruna Desa Sukamaju', 'Ketua Divisi Teknologi Informasi', 'Mar 2022 - Mar 2023', 'Membangun ekosistem digital desa: website, media sosial, sistem informasi warga.', NULL, 'org-karangtaruna', 3),
('Komunitas Developer Malang', 'Core Member dan Mentor', 'Jan 2024 - Sekarang', 'Mentoring pemula web development, mengadakan workshop dan hackathon lokal.', 'https://devmalang.id', 'org-devmalang', 4),
('OSIS SMKN 1 Malang', 'Ketua OSIS', '2020 - 2021', 'Memimpin organisasi siswa dengan 1200 anggota, mengelola 15 program kerja.', NULL, 'org-osis-smkn', 5),
('Paskibraka Kota Malang', 'Anggota Inti', '2021', 'Terpilih sebagai Paskibraka Kota Malang dalam upacara HUT RI ke-76.', NULL, 'org-paskibraka', 6)
ON CONFLICT (slug) DO NOTHING;

-- INSERT AWARD
INSERT INTO "Award" (title, organizer, date, description, slug, "proofUrl") VALUES
('Juara 1 LKS Web Design Tingkat Kota', 'Dinas Pendidikan Kota Malang', '2021', 'Memenangkan LKS bidang Web Design tingkat Kota Malang.', 'award-lks-webdesign-2021', NULL),
('Best Presenter Youth Forum Nasional', 'Kemenpora RI', '2023', 'Penghargaan presenter terbaik forum pemuda nasional topik digitalisasi UMKM.', 'award-best-presenter-2023', NULL),
('Scholarship Awardee Beasiswa Prestasi', 'Yayasan Pendidikan Nusantara', '2022', 'Penerima beasiswa prestasi akademik dan non-akademik.', 'award-beasiswa-2022', NULL),
('Hackathon Champion Smart Village', 'Kemendesa PDTT', '2023', 'Juara 1 hackathon Smart Village tingkat nasional.', 'award-hackathon-smartvillage-2023', 'https://kemendesa.go.id'),
('Top 10 Indonesia Youth Icon', 'HIPMI', '2024', 'Terpilih sebagai 10 ikon pemuda Indonesia oleh HIPMI nasional.', 'award-youthicon-2024', NULL),
('Juara 2 Olimpiade Komputer Provinsi', 'Dinas Pendidikan Jawa Timur', '2020', 'Juara 2 olimpiade komputer tingkat provinsi Jawa Timur.', 'award-olimpkom-2020', NULL)
ON CONFLICT (slug) DO NOTHING;

-- INSERT PUBLICATION
INSERT INTO "Publication" (title, outlet, date, description, url, slug) VALUES
('Digitalisasi UMKM Lokal di Era Post-Pandemi', 'Jurnal Teknologi dan Masyarakat', '2024', 'Analisis strategi digitalisasi UMKM lokal Indonesia pasca pandemi.', NULL, 'pub-digitalisasi-umkm-2024'),
('Membangun Ekosistem Startup di Pesantren', 'Medium Tech in ID', '2023', 'Bagaimana pesantren modern bisa menjadi inkubator startup teknologi.', 'https://medium.com', 'pub-startup-pesantren-2023'),
('Next.js 14 Panduan App Router untuk Pemula', 'Dev.to', '2024', 'Tutorial lengkap migrasi ke App Router di Next.js 14.', 'https://dev.to', 'pub-nextjs14-tutorial-2024'),
('Peran Pemuda dalam Transformasi Digital Desa', 'Kompasiana', '2023', 'Opini tentang potensi pemuda desa mendorong transformasi digital.', 'https://kompasiana.com', 'pub-digital-desa-2023'),
('Implementasi Supabase sebagai Backend-as-a-Service', 'Hashnode', '2024', 'Studi kasus penggunaan Supabase untuk portofolio full-stack modern.', 'https://hashnode.com', 'pub-supabase-2024'),
('Desain UI UX Inklusif untuk Pengguna Indonesia', 'UX Collective ID', '2023', 'Prinsip desain inklusif mempertimbangkan konteks budaya Indonesia.', NULL, 'pub-uiux-inklusif-2023')
ON CONFLICT (slug) DO NOTHING;

-- CEK HASIL
SELECT
  (SELECT COUNT(*) FROM "Experience") as experience,
  (SELECT COUNT(*) FROM "Education") as education,
  (SELECT COUNT(*) FROM "Skill") as skill,
  (SELECT COUNT(*) FROM "Organization") as organization,
  (SELECT COUNT(*) FROM "Award") as award,
  (SELECT COUNT(*) FROM "Publication") as publication;
