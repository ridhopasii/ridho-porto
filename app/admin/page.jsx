import { createClient } from '@/utils/supabase/server'
import AdminSidebar from '@/components/AdminSidebar'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  const { count: projectCount } = await supabase.from('Project').select('*', { count: 'exact', head: true })
  const { count: messageCount } = await supabase.from('Message').select('*', { count: 'exact', head: true })
  const { count: skillCount } = await supabase.from('Skill').select('*', { count: 'exact', head: true })

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-jakarta">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center font-bold text-black">R</div>
            <div>
              <p className="text-sm font-bold">Ridho Robbi Pasi</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Proyek', value: projectCount || 0, color: 'text-teal-400' },
            { label: 'Pesan Baru', value: messageCount || 0, color: 'text-purple-400' },
            { label: 'Total Skill', value: skillCount || 0, color: 'text-blue-400' },
          ].map((stat) => (
            <div key={stat.label} className="p-6 bg-white/5 border border-white/10 rounded-3xl">
              <p className="text-gray-500 text-sm mb-2">{stat.label}</p>
              <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="p-10 bg-gradient-to-br from-teal-500/10 to-purple-500/10 border border-white/10 rounded-3xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Panel Kendali Penuh</h2>
            <p className="text-gray-400 max-w-md">
              Sekarang Anda bisa mengelola seluruh aspek portofolio Anda: dari Skill, Pengalaman, hingga Publikasi karya ilmiah Anda.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 blur-[100px] rounded-full -mr-20 -mt-20"></div>
        </div>
      </main>
    </div>
  )
}
