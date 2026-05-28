import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateProject() {
  const content = `## Mobile Attendance App

Aplikasi absensi mobile yang dirancang untuk mempermudah pelacakan kehadiran karyawan secara real-time berbasis lokasi (GPS) dan validasi biometrik.

### Masalah yang Diselesaikan
Banyak perusahaan masih menggunakan sistem absensi manual atau mesin fingerprint yang mengharuskan karyawan hadir secara fisik di satu titik. Hal ini tidak efektif untuk karyawan lapangan (sales, teknisi) atau yang bekerja secara WFH.

### Solusi
Aplikasi ini memungkinkan karyawan melakukan *clock-in* dan *clock-out* langsung dari smartphone mereka, dilengkapi dengan validasi geofencing untuk memastikan mereka berada di lokasi yang disetujui, serta deteksi wajah (liveness detection) untuk mencegah kecurangan.

### Fitur Utama
- **Geofencing & GPS Tracking**: Absen hanya valid jika berada dalam radius kantor/lokasi proyek.
- **Liveness Detection**: Menggunakan kamera depan untuk memvalidasi wajah secara real-time.
- **Offline Mode**: Tetap bisa absen meski koneksi terputus, data akan disinkronisasi otomatis.
- **Dashboard Admin**: Laporan kehadiran, keterlambatan, dan cuti secara komprehensif.`;

  const { data, error } = await supabase
    .from("Project")
    .update({
      content: content,
      tags: ["Flutter", "Firebase", "Node.js", "PostgreSQL"],
      repoUrl: "https://github.com/ridhopasii/mobile-attendance",
      demoUrl: "https://play.google.com/store/apps/details?id=com.attendance.app"
    })
    .eq("slug", "project-attendance-app");

  if (error) {
    console.error("Error updating project:", error);
  } else {
    console.log("Project updated successfully.");
  }
}

updateProject();
