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

Selanjutnya, apakah kita mau:

Melanjutkan fitur konversi webp ke modul admin yang lain (misal: halaman Admin Project/Blog/Gallery)?
Merombak UI publik yang sebelumnya menurut Anda "ga enak kali liatnya" atau "keputihan kali" (mungkin mendesain ulang layout publik dan membuat banner besar untuk heroImage)?

---

## [2026-03-15] - v2.4.0 Dashboard Expansion & TikTok Stats
### 🚀 Fitur Baru
- **GitHub Pinned Repositories**: Ditambahkan ke Dashboard, menampilkan hingga 6 repositori yang disematkan beserta bahasa pemrograman, jumlah *stars*, dan *forks*.
- **GitHub Profile Stats**: Ditambahkan ke Dashboard (jumlah *Followers*, *Following*, dan total *Repositories*).
- **Umami Traffic Chart**: Penambahan fitur *switcher* untuk mengubah tipe grafik antara *Stacked Bar* dan *Line chart*.
- **TikTok Aggregate Stats**: Ditambahkan ke profil Creations (Total *Views*, Total *Comments*, Total *Shares*).
- **Creations Sort Options**: Opsi pengurutan diperluas (*Most Views*, *Most Likes*, *Most Comments*, *Newest*, *Oldest*).
- **Dynamic OG Images**: Fitur `/api/og` untuk menghasilkan *Open Graph image* yang unik secara dinamis (berisi judul dan deskripsi) pada setiap halaman.
- **SEO Optimization**: Penambahan `sitemap.xml` dan `robots.txt` untuk meningkatkan cakupan SEO.

### 🎨 Ditingkatkan (Peningkatan)
- **Monkeytype Section**: Didesain ulang menjadi *grid* 3 kolom dengan pembatas vertikal, serta penambahan kolom *keyboard* dan *bio*.
- **WakaTime Section**: Bahasa pemrograman teratas dikurangi menjadi 4, dan bagian *Top Projects* dihapus agar lebih minimalis.
- **Email Templates**: Desain ulang secara menyeluruh pada *template* email untuk Notifikasi Contact Form dan Guestbook agar tampil lebih bersih dan minimalis.

### 🐛 Diperbaiki (Bug Fixes)
- **GitHub Contribution Calendar**: Memperbaiki kontainer *overflow* yang sebelumnya terpotong pada tampilan *mobile*.

---

## [2026-03-14] - v2.3.0 Project Filters & Changelog
### 🚀 Fitur Baru
- **Project Filter Pills**: Penambahan filter Tipe dan Kategori pada halaman Projects (*Web/Mobile*, *Personal/Internship/Freelance/Lomba*).
- **Changelog Page**: Penambahan halaman Catatan Perubahan (halaman ini).

### 🎨 Ditingkatkan
- **Animasi Project Card**: Menerapkan Framer Motion `AnimatePresence` sehingga kartu proyek bertransisi secara mulus saat difilter.
- **Client-Side Filtering**: *Metadata* proyek disimpan sebagai konstanta statis untuk mempercepat penyaringan di sisi klien tanpa perlu panggilan API tambahan.

---

## [2026-03-14] - v2.2.0 Sound Controls & Guestbook Rename
### 🚀 Fitur Baru
- **Sound Controls**: Penambahan kontrol suara di *Command Palette* untuk menyalakan/mematikan musik latar dan SFX (hanya terlihat di tema Yellow, Ramadan, dan Valentine).

### 🎨 Ditingkatkan
- **Pembaruan Istilah "Guestbook"**: Mengubah nama halaman "Chat Room" menjadi "Guestbook" pada seluruh navigasi, menu, dan file terjemahan.
- **Label Sound Toggle**: Teks pada tombol suara kini dinamis mengikuti *state* (misal: "Matikan suara latar" jika sedang aktif).

---

## [2026-03-13] - v2.1.0 Infinite Scroll & Project View Counter
### 🚀 Fitur Baru
- **Infinite Scroll Projects**: Kartu proyek baru akan dimuat secara otomatis ketika pengguna menggulir mendekati bagian bawah halaman.
- **Project View Counter**: Halaman detail proyek kini melacak dan menampilkan jumlah tayangan melalui Supabase.

### 🎨 Ditingkatkan
- **End-of-List Divider**: Menampilkan pembatas saat semua konten telah selesai dimuat, baik di halaman Projects maupun Creations.

### 🐛 Diperbaiki
- **Creations Infinite Scroll**: Memperbaiki implementasi `IntersectionObserver` yang sebelumnya tidak terpicu; beralih menggunakan pola *callback ref* untuk mendeteksi batas bawah.

---

## [2026-03-12] - v2.0.0 Command Palette & Achievement Sharing
### 🚀 Fitur Baru
- **Command Palette (Ctrl+K / ⌘K)**: Diluncurkan dengan fitur Navigasi, Tema, dan Tata Letak (Layout).
- **Achievement Sharing**: Tombol bagikan untuk menyalin *link* langsung menuju kartu pencapaian tertentu.
- **Achievement Deep-Linking**: Membuka tautan pencapaian yang dibagikan akan secara otomatis menyorot ( *highlight*) dan menggulir ke kartu yang dituju.

### 🎨 Ditingkatkan
- **Command Palette Theme-Aware**: Penyesuaian gaya dinamis yang beradaptasi dengan tema Yellow, Ramadan, maupun Valentine.

---

## [2026-03-10] - v1.6.0 Creations Page (TikTok Integration)
### 🚀 Fitur Baru
- **Creations Page (TikTok)**: Menampilkan video TikTok beserta *cursor-based pagination*.
- **TikTok Profile Header**: Menampilkan statistik pengikut ( *followers*), mengikuti ( *following*), *likes*, dan total video.
- **Video Sorting**: Mengurutkan video berdasarkan Penayangan Terbanyak atau Suka Terbanyak.
- **Token Auto-Refresh**: Pembaruan otomatis *OAuth token* TikTok yang tersimpan di Supabase.

---

## [2026-03-05] - v1.5.0 Projects Page with Emoji Reactions
### 🚀 Fitur Baru
- **Projects Page**: Menampilkan kartu proyek dengan ikon *tech stack*, deskripsi, dan tautan.
- **Emoji Reactions (Projects)**: Fitur reaksi emoji dengan kewajiban masuk ( *sign in*) melalui Google atau GitHub (maksimal 5 reaksi per pengguna).
- **Project Detail Pages**: Halaman detail berbasis MDX, dilengkapi *tooltip* untuk *tech stack*, serta tautan demo langsung dan *source code*.

### 🎨 Ditingkatkan
- **Optimistic UI Updates**: Pembaruan antarmuka secara instan untuk reaksi emoji dengan sistem *error rollback* jika gagal.

---

## [2026-02-28] - v1.4.0 Achievements Page
### 🚀 Fitur Baru
- **Achievements Page**: Daftar sertifikat dan *badge* lengkap dengan modal *lightbox* untuk gambar.
- **Achievement Filters**: Menyaring pencapaian berdasarkan tipe dan kategori menggunakan *dropdown* tersinkronisasi URL.
- **Emoji Reactions (Achievements)**: Sistem reaksi emoji yang sama seperti proyek.
- **Search Filter**: Fitur pencarian khusus untuk pencapaian.

---

## [2026-02-20] - v1.3.0 Theme System
### 🚀 Fitur Baru
- **Sistem 5 Tema**: Light, Dark, Yellow, Ramadan, Valentine — masing-masing dengan palet warna unik.
- **Theme-Specific Effects**: Efek partikel klik dan efek suara khusus pada tema Yellow, Ramadan, dan Valentine.
- **Background Music Player**: Pemutar musik latar yang mematuhi kebijakan *autoplay* peramban.
- **Theme Toggle**: Pengalih tema pada perangkat *mobile* (siklus putar) dan *desktop* (berbentuk *pill* berisi semua opsi).

---

## [2026-02-15] - v1.2.0 Dashboard & Stats
### 🚀 Fitur Baru
- **Dashboard Page**: Halaman *dashboard* publik dengan statistik kontribusi GitHub dan ringkasan repositori.
- **WakaTime Chart**: Grafik aktivitas pengodean yang menampilkan bahasa dan editor utama.
- **Monkeytype Integration**: Menampilkan metrik dan kecepatan mengetik.
- **Umami Analytics**: Ringkasan jumlah pengunjung secara langsung.

---

## [2026-02-10] - v1.1.0 Guestbook (Real-time Chat)
### 🚀 Fitur Baru
- **Guestbook Page**: Halaman buku tamu dengan pembaruan pesan seketika ( *real-time*) lewat langganan (*subscriptions*) Supabase.
- **Autentikasi Sosial**: Opsi masuk dengan Google atau GitHub untuk memposting pesan.
- **Fitur Balasan & Notifikasi**: Fungsionalitas balas ( *reply-to*) yang otomatis memicu notifikasi email.
- **Floating Chat Widget**: Mengakses *guestbook* dari *widget* melayang di *desktop* tanpa harus meninggalkan halaman.

---

## [2026-02-01] - v1.0.0 Initial Launch
### 🚀 Fitur Baru
- **Home Page**: Halaman utama dengan introduksi animasi dan pameran *tech stack*.
- **About Page**: Halaman tentang yang berisi lini masa karir dan riwayat pendidikan.
- **Contact Page**: Halaman kontak dengan tautan sosial dan formulir pesan otomatis via Nodemailer.
- **i18n Support**: Dukungan sistem dwibahasa (Inggris dan Bahasa Indonesia).
- **Layout Toggle**: Pengalih tata letak *Sidebar* atau *Topbar* yang tersimpan lewat Zustand.
- **Mobile-First Design**: Desain responsif yang dioptimalkan untuk seluler sebagai prioritas navigasi.