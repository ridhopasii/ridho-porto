# Changelog & Updates

Semua perubahan dan perkembangan pada proyek ini akan dicatat di sini.

## [2026-05-27] - Perbaikan Build & UI/UX Admin
### 🚀 Fitur & Peningkatan
- **Admin Panel Dark Mode**: Mengubah tema antarmuka panel admin menjadi *dark mode* (latar `#0a0a0a` dan kartu `#121212`) agar lebih elegan dan nyaman di mata ("tidak keputihan").
- **Konversi Gambar WebP**: Mengimplementasikan konversi gambar otomatis ke format `.webp` menggunakan pustaka `sharp` pada *endpoint* `/api/admin/upload` sebelum disimpan ke Supabase Storage. Form profil kini sudah terintegrasi penuh dengan sistem *upload* gambar baru ini.

### 🐛 Perbaikan Bug (Bug Fixes)
- **Supabase Profile Save Error**: Memperbaiki logika penyimpanan profil di `/api/admin/profile` agar memetakan *field* dengan tepat ke skema kolom Supabase. Menyelesaikan error HTTP 500 "Failed to save profile".
- **Vercel Build Error - Route Handlers**: Memperbaiki rute statis `app/og/route.tsx` yang sebelumnya menggunakan `export default` (tidak valid di Turbopack Next.js 16) menjadi `export async function GET()`.
- **TypeScript Type Error**: Memperbaiki tipe data parameter `link` yang tadinya `any` di `modules/home/components/HeroSection.tsx` sehingga proses kompilasi TypeScript (*type check*) berhasil.
- **Jest Test Import Error**: Memperbarui path import file *middleware* (yang telah diubah namanya menjadi `proxy.ts`) pada pengujian `tests/preservation-property.test.ts`.
- **Prerendering Error (Event handlers in Server Components)**: Menambahkan instruksi `"use client";` ke 17 file komponen (termasuk `MobileMenuButton.tsx`, `ThemeToggle.tsx`, dan file Modal Form di halaman admin) karena komponen-komponen tersebut memiliki interaksi (`onClick`, `useState`) yang membuat Next.js gagal saat memproses *build* statis untuk halaman `/id/about`.

### 📌 Catatan Tambahan
- `heroImage` saat ini telah tersimpan di Supabase lewat form admin profil, tetapi belum diimplementasikan untuk dimunculkan pada antarmuka halaman publik (hanya `avatarUrl` bulat yang muncul). Jika dibutuhkan, UI banner untuk Hero bisa ditambahkan di kemudian hari.
