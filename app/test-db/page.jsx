import { createClient } from '@/utils/supabase/server'

export default async function TestDBPage() {
  const supabase = await createClient()
  
  // Ambil semua data (tanpa .single() dulu untuk cek jumlahnya)
  const { data: allProfiles, error: fetchError } = await supabase
    .from('Profile')
    .select('*')

  const profile = allProfiles?.[0]
  const count = allProfiles?.length || 0

  return (
    <div className="min-h-screen bg-black text-foreground p-10 font-jakarta">
      <h1 className="text-3xl font-bold text-accent mb-6">Supabase Diagnostic</h1>
      
      <div className="grid gap-6">
        {/* Status Koneksi */}
        <div className="p-6 bg-white/5 border border-[var(--border-subtle)] rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Database Info</h2>
          <p className="mb-2">Jumlah Baris Ditemukan: <span className="text-accent font-bold">{count}</span></p>
          
          {count === 0 && !fetchError && (
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg text-yellow-200 text-sm">
              <p className="font-bold">⚠️ Data Terdeteksi 0 Baris</p>
              <p className="mt-1">Ini biasanya karena <strong>RLS (Row Level Security)</strong> masih aktif dan belum ada Policy <strong>SELECT</strong> untuk publik.</p>
            </div>
          )}
        </div>

        {/* Detail Data */}
        {profile ? (
          <div className="p-6 bg-white/5 border border-[var(--border-subtle)] rounded-2xl border-teal-500/30">
            <p className="text-teal-400 font-bold mb-2">✅ Data Berhasil Dibaca!</p>
            <div className="space-y-2">
              <p><span className="text-gray-500">Nama:</span> {profile.fullName}</p>
              <p><span className="text-gray-500">Title:</span> {profile.title}</p>
            </div>
          </div>
        ) : fetchError ? (
          <div className="p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-200">
            <p className="font-bold">Error Terjadi:</p>
            <pre className="text-xs mt-2">{JSON.stringify(fetchError, null, 2)}</pre>
          </div>
        ) : null}
      </div>

      <div className="mt-10">
        <a href="/" className="text-accent hover:underline">← Kembali ke Beranda</a>
      </div>
    </div>
  )
}
