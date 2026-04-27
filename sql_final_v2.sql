-- ============================================================
-- PRODUKTIF COMPLETE DATABASE SCHEMA v2.0
-- (Updated: Habit Config, Yearly Plan, Tabungan Umroh, dsb)
-- ============================================================

-- 1. TABEL UTAMA: DAILY PRODUCTIVITY LOG 
CREATE TABLE IF NOT EXISTS "Productivity" (
    "id" SERIAL PRIMARY KEY,
    "date" DATE UNIQUE NOT NULL,
    "tasks" JSONB NOT NULL DEFAULT '[]',
    "dayType" TEXT DEFAULT 'A',
    "mood" TEXT,
    "goals" TEXT,
    "pomodoroMinutes" INTEGER DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL SITE SETTINGS 
CREATE TABLE IF NOT EXISTS "SiteSettings" (
    "id" SERIAL PRIMARY KEY,
    "key" TEXT UNIQUE NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL TABUNGAN UMROH 
CREATE TABLE IF NOT EXISTS "TabunganUmroh" (
    "id" SERIAL PRIMARY KEY,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "category" TEXT NOT NULL, -- 'diri_sendiri', 'mahram', 'keluarga', 'orang_lain'
    "amount" BIGINT DEFAULT 0,
    "target" BIGINT DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE("month", "year", "category")
);

-- 4. TABEL ONE YEAR PLAN 
CREATE TABLE IF NOT EXISTS "YearlyPlan" (
    "id" SERIAL PRIMARY KEY,
    "year" INTEGER NOT NULL DEFAULT 2026,
    "category" TEXT NOT NULL, -- 'mindset', 'skill', 'health', 'family'
    "item" TEXT NOT NULL,
    "monthlyHabit" TEXT,
    "weeklyHabit" TEXT,
    "dailyHabit" TEXT,
    "completed" BOOLEAN DEFAULT FALSE,
    "progress" INTEGER DEFAULT 0, -- 0-100
    "sortOrder" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL MONTHLY TRACKER 
CREATE TABLE IF NOT EXISTS "MonthlyTracker" (
    "id" SERIAL PRIMARY KEY,
    "date" DATE NOT NULL,
    "checklist" JSONB NOT NULL DEFAULT '{}',
    "notes" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE("date")
);

-- 6. TABEL HABITS 
CREATE TABLE IF NOT EXISTS "HabitConfig" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL, -- 'ibadah', 'kesehatan', 'produktivitas', 'pengembangan_diri'
    "icon" TEXT,
    "isActive" BOOLEAN DEFAULT TRUE,
    "frequency" TEXT DEFAULT 'daily', 
    "target" INTEGER DEFAULT 1,
    "sortOrder" INTEGER DEFAULT 0
);

-- ============================================================
-- RLS POLICIES (Buka semua akses untuk Admin Panel)
-- ============================================================

ALTER TABLE "Productivity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteSettings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TabunganUmroh" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "YearlyPlan" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MonthlyTracker" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "HabitConfig" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_productivity" ON "Productivity";
DROP POLICY IF EXISTS "allow_all_sitesettings" ON "SiteSettings";
DROP POLICY IF EXISTS "allow_all_tabungan" ON "TabunganUmroh";
DROP POLICY IF EXISTS "allow_all_yearly" ON "YearlyPlan";
DROP POLICY IF EXISTS "allow_all_monthly" ON "MonthlyTracker";
DROP POLICY IF EXISTS "allow_all_habit" ON "HabitConfig";

CREATE POLICY "allow_all_productivity" ON "Productivity" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_sitesettings" ON "SiteSettings" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_tabungan" ON "TabunganUmroh" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_yearly" ON "YearlyPlan" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_monthly" ON "MonthlyTracker" FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_habit" ON "HabitConfig" FOR ALL TO public USING (true) WITH CHECK (true);

-- ============================================================
-- DATA SEED: DAILY PRODUCTIVITY TEMPLATE 
-- ============================================================
INSERT INTO "SiteSettings" ("key", "value") VALUES (
    'productivity_config',
    '{
        "block1": [
            "Sholat Subuh berjamaah",
            "Dzikir Pagi",
            "Tilawah Al-Quran (min. 5 halaman)",
            "Sarapan & Minum air putih",
            "Review jadwal harian"
        ],
        "block2A": [
            "Belajar coding / skill teknis 2 jam",
            "Membuat konten (1 konten)",
            "Membaca buku (35 halaman)",
            "Latihan bahasa Inggris / Arab"
        ],
        "block2B": [
            "Mengerjakan proyek freelance",
            "Belajar hal baru (kursus online)",
            "Menulis jurnal / refleksi",
            "Networking / kolaborasi"
        ],
        "block2Sunday": [
            "Evaluasi mingguan",
            "Rencana pekan depan",
            "Waktu keluarga / silaturahmi",
            "Refreshing & recharge"
        ],
        "block3": [
            "Sholat Isya berjamaah",
            "Dzikir Petang",
            "Evaluasi checklist hari ini",
            "Persiapan esok hari",
            "Tidur maksimal jam 22.30"
        ]
    }'
) ON CONFLICT ("key") DO NOTHING;

-- ============================================================
-- DATA SEED: MONTHLY TRACKER HABIT CONFIG
-- ============================================================
INSERT INTO "HabitConfig" ("name", "category", "icon", "isActive", "frequency", "target", "sortOrder") VALUES
-- IBADAH
('Sholat Subuh Berjamaah', 'ibadah', '🌅', TRUE, 'daily', 1, 1),
('Sholat Dzuhur', 'ibadah', '☀️', TRUE, 'daily', 1, 2),
('Sholat Ashar', 'ibadah', '🌤️', TRUE, 'daily', 1, 3),
('Sholat Maghrib Berjamaah', 'ibadah', '🌆', TRUE, 'daily', 1, 4),
('Sholat Isya Berjamaah', 'ibadah', '🌙', TRUE, 'daily', 1, 5),
('Sholat Dhuha', 'ibadah', '✨', TRUE, 'daily', 1, 6),
('Sholat Tahajud', 'ibadah', '🌟', TRUE, 'daily', 1, 7),
('Tilawah Al-Quran', 'ibadah', '📖', TRUE, 'daily', 5, 8),
('Hafalan Al-Quran', 'ibadah', '🧠', TRUE, 'daily', 1, 9),
('Dzikir Pagi', 'ibadah', '🌄', TRUE, 'daily', 1, 10),
('Dzikir Petang', 'ibadah', '🌇', TRUE, 'daily', 1, 11),
('Puasa Sunnah', 'ibadah', '🤲', TRUE, 'weekly', 2, 12),
('Sedekah Harian', 'ibadah', '💝', TRUE, 'daily', 1, 13),
-- KESEHATAN
('Olahraga / Workout', 'kesehatan', '💪', TRUE, 'daily', 1, 20),
('Minum Air 2 Liter', 'kesehatan', '💧', TRUE, 'daily', 2, 21),
('Tidur Cukup (7-8 Jam)', 'kesehatan', '😴', TRUE, 'daily', 1, 22),
('Makan Buah & Sayur', 'kesehatan', '🥗', TRUE, 'daily', 1, 23),
('Tidak Minum Bergula', 'kesehatan', '🚫', TRUE, 'daily', 1, 24),
-- PRODUKTIVITAS
('Belajar Coding / Skill', 'produktivitas', '💻', TRUE, 'daily', 2, 30),
('Membuat Konten', 'produktivitas', '🎬', TRUE, 'daily', 1, 31),
('Baca Buku', 'produktivitas', '📚', TRUE, 'daily', 35, 32),
('Belajar Bahasa Inggris', 'produktivitas', '🗣️', TRUE, 'daily', 1, 33),
('Belajar Bahasa Arab', 'produktivitas', '📝', TRUE, 'daily', 1, 34),
('Review Jadwal Harian', 'produktivitas', '📋', TRUE, 'daily', 1, 35),
-- PENGEMBANGAN DIRI
('Menulis Jurnal / Refleksi', 'pengembangan_diri', '📓', TRUE, 'daily', 1, 40),
('Evaluasi Mingguan', 'pengembangan_diri', '🔍', TRUE, 'weekly', 1, 41),
('Silaturahmi / Keluarga', 'pengembangan_diri', '❤️', TRUE, 'weekly', 1, 42)
ON CONFLICT DO NOTHING;

-- ============================================================
-- DATA SEED: ONE YEAR PLAN 2026 
-- ============================================================
INSERT INTO "YearlyPlan" ("year", "category", "item", "monthlyHabit", "weeklyHabit", "dailyHabit", "completed", "sortOrder") VALUES
-- MINDSET
(2026, 'mindset', 'Membaca dan memahami 12 buku', 'Dalam 1 bulan minimal 1 buku', '35 Halaman dalam satu pekan', '5 Halaman dalam satu hari', TRUE, 1),
(2026, 'mindset', 'Menambah pemahaman tentang Kepribadian dalam Islam', NULL, NULL, NULL, TRUE, 2),
(2026, 'mindset', 'Belajar hal baru setiap bulan', NULL, NULL, NULL, TRUE, 3),
(2026, 'mindset', 'Belajar management waktu', 'Evaluasi management waktu setiap bulan', 'Membuat jadwal kegiatan seminggu sekali', 'Ceklis jadwal kegiatan setiap malam', TRUE, 4),
(2026, 'mindset', 'Belajar menabung (tentukan target tabungan)', NULL, NULL, NULL, TRUE, 5),
(2026, 'mindset', 'Menjadi pendengar yang baik', NULL, NULL, NULL, TRUE, 6),
(2026, 'mindset', 'Semangat menyebarkan kebaikan', NULL, NULL, NULL, TRUE, 7),
(2026, 'mindset', 'Menulis 50 affirmasi positif untuk diri sendiri / orang lain', NULL, NULL, NULL, TRUE, 8),
-- SKILL
(2026, 'skill', 'Menghasilkan 360 Konten dalam 1 Tahun', 'Ada 30 konten yang dibuat', '3 Konten Reels + 4 Konten Feed', '1 Hari 1 konten', FALSE, 10),
(2026, 'skill', 'Menambah hafalan Al-Quran', NULL, NULL, NULL, FALSE, 11),
(2026, 'skill', 'Menambah pengetahuan tentang bahasa Inggris dan Arab', NULL, NULL, NULL, FALSE, 12),
-- HEALTH
(2026, 'health', 'Rajin melaksanakan puasa sunnah', NULL, NULL, NULL, FALSE, 20),
(2026, 'health', 'Lebih banyak buah dan sayuran (+ smoothie hijau)', NULL, NULL, NULL, FALSE, 21),
(2026, 'health', 'Menghindari minuman bergula tinggi', NULL, NULL, NULL, FALSE, 22),
(2026, 'health', 'Diet tinggi protein, pra dan probiotik', NULL, NULL, NULL, FALSE, 23),
-- FAMILY
(2026, 'family', 'Persiapan pernikahan / rencana target untuk keluarga', NULL, NULL, NULL, FALSE, 30)
ON CONFLICT DO NOTHING;

-- ============================================================
-- DATA SEED: TABUNGAN UMROH
-- ============================================================
INSERT INTO "TabunganUmroh" ("month", "year", "category", "amount", "target", "notes") VALUES
('January', 2026, 'mahram', 10000000, 30000000, 'Setoran awal'),
('January', 2026, 'keluarga', 15000000, 30000000, 'Setoran awal'),
('January', 2026, 'orang_lain', 25000000, 30000000, 'Setoran awal'),
('January', 2026, 'diri_sendiri', 0, 30000000, 'Belum ada setoran')
ON CONFLICT ("month", "year", "category") DO NOTHING;

SELECT 'Berhasil! Semua tabel dan data untuk sistem produktivitas sudah siap digunakan.' AS status;
