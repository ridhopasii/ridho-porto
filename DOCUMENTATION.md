# 💎 MASTER DOCUMENTATION: RIDHO ROBBI PASI PREMIUM PORTFOLIO CMS

Dokumentasi ini berisi panduan teknis mendalam mengenai arsitektur, konfigurasi database, logika bisnis, dan instruksi deployment untuk proyek **Ridho Robbi Pasi Portfolio**.

---

## 📑 Daftar Isi

1. [Konfigurasi Environment](#-konfigurasi-environment)
2. [Arsitektur Database & SQL Schema](#-arsitektur-database--sql-schema)
3. [Panduan File & Folder Utama](#-panduan-file--folder-utama)
4. [Fitur Shortcut Visibilitas (The Eye)](#-fitur-shortcut-visibilitas-the-eye)
5. [Sistem Pesan & Notifikasi](#-sistem-pesan--notifikasi)
6. [Halaman Standalone (Premium Pages)](#-halaman-standalone-premium-pages)
7. [Panduan Deployment (Vercel)](#-panduan-deployment-vercel)
8. [Pemecahan Masalah (Troubleshooting)](#-pemecahan-masalah-troubleshooting)

---

## 🔐 Konfigurasi Environment

Buat file `.env.local` di folder root. Data ini bisa diambil dari dashboard Supabase -> Project Settings -> API.

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://uuybelgxovlgozgizith.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key_here

# Service Role (Gunakan hanya jika perlu akses bypass RLS di server)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

---

## 🗄️ Arsitektur Database & SQL Schema

Website ini menggunakan PostgreSQL (Supabase) dengan tabel-tabel berikut:

### 1. Tabel Utama & Kolom

| Nama Tabel     | Kolom Penting                                                                  | Deskripsi                           |
| -------------- | ------------------------------------------------------------------------------ | ----------------------------------- |
| `Profile`      | `id`, `name`, `bio`, `image`, `github_url`, `linkedin_url`, `footer_title`     | Inti identitas pemilik website.     |
| `Project`      | `id`, `title`, `description`, `tech`, `projectUrl`, `images`, **`showOnHome`** | Daftar karya (showOnHome: BOOLEAN). |
| `Article`      | `id`, `title`, `slug`, `content`, `image`, `category`, **`showOnHome`**        | Konten blog.                        |
| `Message`      | `id`, `name`, `email`, `subject`, `message`, **`isRead`**                      | Inbox dari form kontak.             |
| `Experience`   | `id`, `role`, `company`, `period`, `description`, **`showOnHome`**             | Riwayat kerja profesional.          |
| `SiteSettings` | `id`, `key`, `value`                                                           | Pengaturan toggle global section.   |

### 2. SQL Master Fix (Wajib Jalankan)

Gunakan kode ini jika ingin merestorasi status visibilitas dan izin admin:

```sql
-- Tambahkan kolom status jika belum ada
ALTER TABLE "Project" ADD COLUMN IF NOT EXISTS "showOnHome" BOOLEAN DEFAULT true;
ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "isRead" BOOLEAN DEFAULT false;

-- Izinkan publik untuk Update kolom tertentu (Shortcut Mata)
CREATE POLICY "eye_shortcut" ON "Project" FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "eye_shortcut_exp" ON "Experience" FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Izin Form Kontak (Insert & Kelola)
CREATE POLICY "msg_insert" ON "Message" FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "msg_manage" ON "Message" FOR ALL TO public USING (true);
```

---

## 📂 Panduan File & Folder Utama

### Core Logic

- **`app/page.jsx`**: Otak utama Home Page. Mengambil data dari semua tabel dan mem-filter berdasarkan `showOnHome !== false`.
- **`app/layout.jsx`**: Mengatur SEO Global, Metadata, dan Font (Outfit & Jakarta Sans).
- **`utils/supabase/client.js`**: Client Supabase untuk komponen interaktif (Client Components).
- **`utils/supabase/server.js`**: Client Supabase untuk pengambilan data cepat (Server Components).

### Components Interaktif

- **`components/VisibilityToggle.jsx`**: Komponen reusable untuk tombol "Mata". Menggunakan `router.refresh()` untuk update UI tanpa reload.
- **`components/AdminSidebar.jsx`**: Sidebar dinamis. Memiliki `useEffect` untuk memantau perubahan pesan baru secara real-time.
- **`components/MessageItem.jsx`**: Mengatur interaksi pesan (Mark as Read & Delete).

---

## 👁️ Fitur Shortcut Visibilitas (The Eye)

Fitur ini memungkinkan admin mengatur tampilan website tanpa masuk ke menu Edit.

- **Logika**: Tombol mengirim `update` ke database pada kolom `showOnHome`.
- **Filter**: Halaman depan (`page.jsx`) menggunakan query `.not('showOnHome', 'eq', false)` agar data lama (NULL) tetap muncul, namun data yang dimatikan (FALSE) akan hilang.

---

## 📩 Sistem Pesan & Notifikasi

- **Notifikasi**: Sidebar menampilkan badge merah `unreadCount` yang diambil dari query `.eq('isRead', false)`.
- **Real-time**: Menggunakan Supabase Realtime Channel agar angka notifikasi berubah otomatis saat ada orang mengirim pesan tanpa perlu refresh halaman admin.

---

## 🏗️ Halaman Standalone (Premium Pages)

Website telah diubah dari Single-Page menjadi Multi-Page untuk estetika premium:

- **`/projects`**: Menampilkan semua proyek dengan layout grid lebar.
- **`/experience`**: Menggabungkan riwayat kerja dan pendidikan dalam satu timeline.
- **`/blogs`**: Daftar artikel dengan kartu gaya medium yang elegan.
- **`/gallery`**: Galeri foto gaya Masonry (pecah-pecah rapi).

---

## 🚀 Panduan Deployment (Vercel)

1. Hubungkan repository GitHub ke Vercel.
2. Masukkan semua **Environment Variables** di dashboard Vercel.
3. Pastikan **Build Command** menggunakan `next build`.
4. **Build Errors Fix**: Jika muncul error `Github is not defined` atau ikon lain, pastikan import dari `lucide-react` sudah sesuai dengan yang terpasang di `package.json`.

---

## 🛠️ Pemecahan Masalah (Troubleshooting)

### 1. Konten Tidak Muncul di Home Page

**Sebab**: Kolom `showOnHome` bernilai `false`.
**Solusi**: Klik ikon Mata di admin sampai berwarna Hijau, atau jalankan SQL `UPDATE "Project" SET "showOnHome" = true`.

### 2. Gagal Kirim Pesan Kontak

**Sebab**: RLS Policy di Supabase memblokir `INSERT`.
**Solusi**: Jalankan SQL `CREATE POLICY "msg_insert" ON "Message" FOR INSERT TO public WITH CHECK (true);`.

### 3. Build Error pada Ikon

**Sebab**: Beberapa ikon Lucide (seperti Github, Instagram) terkadang hilang di versi tertentu.
**Solusi**: Gunakan ikon alternatif seperti `Globe`, `Users`, atau `Share2` jika terjadi error build yang memblokir deployment.

---

_Dokumentasi Terakhir Diperbarui: 26 April 2026 oleh Antigravity AI._
