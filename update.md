# Catatan Pembaruan (Update Log)

## **Pembaruan Terbaru: 29 Mei 2026**

Berikut adalah ringkasan lengkap dari refaktorisasi, penambahan fitur visual, optimalisasi SEO, dan perbaikan infrastruktur yang diselesaikan pada sesi ini:

### 1. Desain Ulang & Restrukturisasi "Private Hub"
- **Pemisahan Layout Mandiri**: Melakukan pemisahan jalur secara tuntas antara `/admin` (khusus kelola konten publik) dan `/private-hub` (dashboard produktivitas pribadi) dengan meluncurkan layout baru `PrivateHubLayout.tsx`.
- **Navigasi Bilah Samping (Sidebar)**: Menghadirkan sidebar mandiri yang responsif di Private Hub untuk mengorganisasi sub-menu penting: Harian, Riwayat, Tracker, Rencana, Tabungan, Pengaturan Hari.
- **Fitur Edit Mode Toggle**: Menambahkan tombol toggle visual **Edit Mode** (View / Edit) yang mulus di dashboard. Kini pengguna dapat dengan nyaman melihat laporan ringkas (*view mode*) atau beralih ke form input penuh (*edit mode*) dalam satu klik.

### 2. Peningkatan Galeri Foto Interaktif (Hero Section)
- **Mouse Drag-to-Scroll (Desktop)**: Memprogram fungsionalitas geser menggunakan *mouse drag* alami pada komputer desktop, dibantu pembatasan seleksi bawaan (`select-none` & `draggable={false}`) demi menjamin pergerakan yang mulus.
- **Tombol Navigasi Glassmorphic**: Menyematkan panah navigasi kiri/kanan kustom berpenampilan premium (`backdrop-blur-md` dan `bg-black/40`) yang muncul secara dinamis saat kursor menyentuh area galeri (*hover*).
- **Interactive Slide Indicator Dots**: Menyisipkan barisan titik penanda dinamis di bawah galeri yang menyala dan bergeser secara sinkron mengikuti gambar yang sedang aktif secara waktu nyata.

### 3. Infrastruktur Branding & Sistem Logo Dinamis
- **API Logo Dinamis (`/api/logo`)**: Membangun rute API pintar yang menghubungkan metadata dengan database. Ikon situs akan memuat logo kustom hasil unggahan Admin secara dinamis, dengan *fallback* favicon neon kustom jika belum diatur.
- **Uploader Logo Instan di Admin Settings**: Memodifikasi `SiteSettingsManager.tsx` sehingga kunci konfigurasi `site_logo` otomatis berubah menjadi tombol uploader berkas gambar lengkap dengan pratinjau lingkaran.
- **PWA Web Manifest (`manifest.json`)**: Membuat manifes aplikasi lengkap untuk mendefinisikan identitas brand, warna tema, serta resolusi ikon perangkat secara formal bagi peramban dan mesin pencari.

### 4. Optimalisasi SEO Google Sitelinks & Koreksi USU
- **Unified Multi-Graph Schema (JSON-LD)**: Merancang skema data terstruktur canggih menggabungkan objek `Person` (profil karir), `WebSite` (Sitelinks Searchbox), dan `SiteNavigationElement` (peta menu utama) guna merangsang kemunculan sitelinks profesional di Google Search.
- **Pembaruan Pendidikan (USU)**: Memperbarui seluruh entitas data karir dan pendidikan Anda dari *UNIMAL* menjadi **Universitas Sumatera Utara (USU)** di seluruh dokumen data terstruktur.

### 5. Penyelesaian Eror Konsol (Hydration Mismatch)
- **Penyelamatan Hydration**: Memindahkan posisi rendering tag `<script>` JSON-LD dari `<head>` ke urutan pertama di dalam `<body>` pada `app/[locale]/layout.tsx`. Hal ini sukses menghindarkan situs dari pemicu galat *Hydration Mismatch* akibat manipulasi/suntikan skrip oleh berbagai jenis ekstensi peramban (seperti pemalsu lokasi, ad blocker, dll).
- **Verifikasi Build**: Proyek berhasil dikompilasi statis secara sukses (`npx tsc --noEmit` menghasilkan 0 eror) dan telah sukses diunggah ke repositori GitHub utama (`branch main`).

---

## **Pembaruan Sebelumnya: 28 Mei 2026**

## 1. Migrasi ke "Private Hub"
- **Pemusatan Akses Admin**: Memindahkan dan menyatukan seluruh _manager_ admin (seperti `FinanceManager`, `ProductivityManager`, `HabitsManager`, `PlanningManager`) dari panel Admin lama ke dalam satu ekosistem terpadu bernama **Private Hub** (`/id/private-hub`).
- **Sistem Tab yang Terstruktur**: Membangun antarmuka _Dashboard_ yang mengorkestrasi navigasi berdasarkan dua kategori utama: **Produktif** dan **Keuangan**.
- **Perbaikan Autentikasi**: Menyempurnakan akses keamanan pada _Private Hub_ sehingga pengguna yang tidak memiliki otorisasi tidak dapat melihat panel data.

## 2. Refaktorisasi "Guestbook" (Buku Tamu)
- **Tampilan Publik Modern (Chat UI)**: Menghapus tema "Terminal / Hacker" (yang sebelumnya menggunakan elemen kursor `guest@ridhopasii:~$` dan *header wscat*) menjadi desain **Modern Chat Interface** layaknya aplikasi *messaging* profesional. Dilengkapi dengan form input yang responsif (hanya membesar saat diklik).
- **Manajemen Admin yang Rapi (`GuestbookManager.tsx`)**: Merombak tampilan kelola pesan menjadi _Compact Card Design_. 
  - Mengganti tombol besar bergaya lama dengan *pill badges* (untuk status) dan ikon (untuk aksi).
  - Mengimplementasikan fitur **Inline Reply Form**, yang mana kolom balasan admin muncul di bawah pesan secara instan (tanpa modal pop-up), dan langsung disematkan sebagai balasan _threaded_ ke dalam obrolan utama (ditandai dengan label "👑 Balasan Anda").

## 3. Peningkatan Modul "Produktivitas Harian"
- **Pemisahan Tab Analitik & Riwayat**: Memecah halaman `ProductivityManager` agar tidak kepenuhan.
  - *Tab Analitik (Ringkasan)*: Hanya difokuskan untuk menampilkan metrik dan performa makro (Total Pomodoro, Hari Produktif, Rata-rata Harian).
  - *Tab Riwayat*: Khusus untuk input form *Produktivitas Harian* dan _list_ riwayat masa lalu.
- **Visualisasi Data Tasks (Raw JSON Parser)**: Memperbaiki masalah pada *Riwayat Terakhir* di mana data tugas (dari *PlanningManager*) yang tersimpan sebagai tipe *Raw JSON array* ditampilkan langsung apa adanya (contoh: `[{"name":"Tahajud","completed":true}]`). Kini data tersebut diparsing otomatis menjadi **Badges/Label Visual**, dengan indikator centang hijau (✓) untuk yang selesai dan bulat abu-abu (○) untuk yang tertunda.

## 4. Perbaikan _Bugs_ & Infrastruktur Kode
- **Resolusi JSX Syntax Error**: Menyelesaikan _error_ pada *Turbopack build* (`npm run build`) yang sebelumnya gagal akibat kesalahan struktur penutupan tag HTML (`</div>`) dan kurung kurawal pada pembungkus ekspresi _conditional rendering_ `&&` di dalam file `FinanceManager` dan `HabitsManager`.
- **Resolusi ChunkLoadError Turbopack**: Memperbaiki masalah muat ikon `react-icons/di` dengan mengatur `optimizePackageImports: ["react-icons"]` di `next.config.mjs` dan membersihkan *cache* lokal `.next`.
- Kode secara keseluruhan berhasil di-kompilasi dan sukses di-_push_ ke repositori GitHub (`ridhopasii/ridho-porto` branch `main`).

## 5. Peningkatan Performa (Performance Tuning)
- **Pembersihan Komponen UI Berlebih**: Menghapus puluhan komponen animasi dekoratif (sekitar 3.400 baris kode) seperti `MagicBento`, `GlitchText`, dan komponen abstrak lainnya dari `common/components/elements` yang tidak memberikan nilai fungsional pada UI/UX inti (mengikuti prinsip *Growth Hacker & Performance Optimization*).
- **Migrasi Data Ke Supabase**: Membersihkan 13 data dummy sertifikat, mengimpor 15 sertifikat nyata dari Google Drive, mengubah gambar menjadi `.webp` yang super-ringan, dan membuat tata kelola sertifikat lebih cepat. Data pendidikan lama yang tidak relevan juga ikut diganti dengan rekam jejak nyata (USU, PP Arraudlatul Hasanah, dsb).