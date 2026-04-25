import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import AdminSidebar from '@/components/AdminSidebar'
import ProfileForm from '@/components/ProfileForm'
import { ArrowLeft } from 'lucide-react'

export default async function AdminProfile() {
  const supabase = await createClient()
  
  // Ambil data profil saat ini
  const { data: profile } = await supabase
    .from('Profile')
    .select('*')
    .single()

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-jakarta">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-3xl">
          <header className="mb-10 flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-white/5 rounded-full transition-all text-gray-400">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Edit Profil</h1>
              <p className="text-gray-500 text-sm">Perbarui informasi publik Anda yang muncul di halaman utama.</p>
            </div>
          </header>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <ProfileForm initialData={profile} />
          </div>
        </div>
      </main>
    </div>
  )
}
