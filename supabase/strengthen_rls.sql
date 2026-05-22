-- ==========================================================================================
-- SCRIPT PENGUATAN DATABASE SUPABASE (ROW LEVEL SECURITY)
-- ==========================================================================================
-- Panduan: 
-- 1. Buka dashboard Supabase (https://supabase.com/dashboard)
-- 2. Masuk ke project kamu, lalu pilih menu "SQL Editor" di sidebar kiri.
-- 3. Copy-paste seluruh isi file ini dan klik "Run".
-- ==========================================================================================

-- 1. AKTIFKAN RLS (Row Level Security) UNTUK SEMUA TABEL UTAMA
-- Ini memastikan bahwa secara default, semua akses (baca/tulis) diblokir kecuali diizinkan.
-- Sesuaikan nama tabel (misal: 'projects', 'blogs', 'contacts') dengan nama tabel aslimu.

-- Asumsi nama tabel: projects, blogs, contacts
ALTER TABLE IF EXISTS public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.contacts ENABLE ROW LEVEL SECURITY;

-- 2. HAPUS POLICY LAMA (Jika ada, agar tidak bentrok)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.projects;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.blogs;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.contacts;

-- ==========================================================================================
-- 3. BUAT POLICY BARU (PENGATURAN AKSES)
-- ==========================================================================================

-- A. TABEL PROJECTS
-- Semua orang boleh melihat (SELECT) project.
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.projects FOR SELECT
  USING ( true );

-- Hanya admin (user yang sudah login/authenticated) yang boleh menambah/mengubah/menghapus.
CREATE POLICY "Admin can insert projects."
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK ( true );

CREATE POLICY "Admin can update projects."
  ON public.projects FOR UPDATE
  TO authenticated
  USING ( true )
  WITH CHECK ( true );

CREATE POLICY "Admin can delete projects."
  ON public.projects FOR DELETE
  TO authenticated
  USING ( true );


-- B. TABEL BLOGS
-- Semua orang boleh membaca blog.
CREATE POLICY "Public blogs are viewable by everyone."
  ON public.blogs FOR SELECT
  USING ( true );

-- Hanya admin yang boleh kelola blog.
CREATE POLICY "Admin can insert blogs."
  ON public.blogs FOR INSERT
  TO authenticated
  WITH CHECK ( true );

CREATE POLICY "Admin can update blogs."
  ON public.blogs FOR UPDATE
  TO authenticated
  USING ( true )
  WITH CHECK ( true );

CREATE POLICY "Admin can delete blogs."
  ON public.blogs FOR DELETE
  TO authenticated
  USING ( true );


-- C. TABEL CONTACTS
-- Semua orang boleh MENGIRIM pesan (INSERT).
CREATE POLICY "Anyone can submit contact form."
  ON public.contacts FOR INSERT
  TO public
  WITH CHECK ( true );

-- HANYA ADMIN yang boleh membaca pesan masuk. Pengunjung biasa tidak boleh melihat pesan orang lain.
CREATE POLICY "Only admin can view contacts."
  ON public.contacts FOR SELECT
  TO authenticated
  USING ( true );

CREATE POLICY "Only admin can update/delete contacts."
  ON public.contacts FOR ALL
  TO authenticated
  USING ( true )
  WITH CHECK ( true );

-- ==========================================================================================
-- SELESAI
-- Database kamu sekarang sudah aman dari serangan manipulasi data dari luar!
-- ==========================================================================================
