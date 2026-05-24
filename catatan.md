# Catatan Setup Vercel & Environment Variables

Agar semua fitur (terutama otentikasi dan AI) berfungsi dengan baik saat di-deploy ke Vercel, pastikan variabel-variabel lingkungan (*environment variables*) berikut telah ditambahkan di pengaturan project Vercel Anda (**Settings > Environment Variables**):

1. **`GEMINI_API_KEY`**
   * Kegunaan: Untuk fitur AI SmartTalk.
   * Contoh: `AIzaSy...`

2. **`NEXTAUTH_SECRET`**
   * Kegunaan: Kunci rahasia untuk enkripsi sesi login NextAuth.
   * *Cara buat:* Generate string acak (misal menggunakan `openssl rand -base64 32` di terminal).

3. **`NEXTAUTH_URL`**
   * Kegunaan: Base URL untuk NextAuth agar tau alamat domain *production*.
   * Contoh: `https://ridhorobbipasi.my.id`

4. **`GITHUB_ID` & `GITHUB_SECRET`**
   * Kegunaan: Kredensial OAuth App Github untuk fitur login user (misal di chat).

5. **`GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`**
   * Kegunaan: Kredensial OAuth App Google untuk fitur login user.

6. **Variabel Supabase (Opsional tapi penting jika dipakai)**
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   *(Pastikan nilainya sama dengan yang ada di file `.env.local` Anda)*

---
*Catatan: Jangan lupa untuk memastikan konfigurasi login GitHub di Dashboard Supabase (seperti yang dibahas sebelumnya) juga sudah disetel jika Anda ingin login ke panel admin menggunakan GitHub.*
