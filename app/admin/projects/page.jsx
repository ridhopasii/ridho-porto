import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import AdminSidebar from '@/components/AdminSidebar'
import { Plus, Edit, Trash2, ExternalLink, Folders } from 'lucide-react'

export default async function AdminProjects() {
  const supabase = await createClient()
  const { data: projects, error } = await supabase
    .from('Project')
    .select('*')
    .order('createdAt', { ascending: false })

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-jakarta">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold">Kelola Proyek</h1>
            <p className="text-gray-500 text-sm">Total: {projects?.length || 0} Proyek ditemukan</p>
          </div>
          <Link href="/admin/projects/new" className="px-6 py-3 bg-teal-500 text-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-all">
            <Plus size={20} />
            Tambah Proyek
          </Link>
        </header>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 mb-6">
            Error: {error.message} (Cek RLS di Supabase)
          </div>
        )}

        {/* Projects List */}
        <div className="grid gap-4">
          {projects?.map((project) => (
            <div key={project.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-teal-500/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white/10 overflow-hidden">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600"><Folders /></div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{project.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1 max-w-md">{project.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <Link href={`/admin/projects/edit/${project.id}`} className="p-2 hover:bg-white/10 rounded-lg text-blue-400" title="Edit">
                  <Edit size={20} />
                </Link>
                <button className="p-2 hover:bg-red-500/10 rounded-lg text-red-400" title="Hapus">
                  <Trash2 size={20} />
                </button>
                <a href={project.projectUrl} target="_blank" className="p-2 hover:bg-white/10 rounded-lg text-teal-400" title="Lihat">
                  <ExternalLink size={20} />
                </a>
              </div>
            </div>
          ))}

          {projects?.length === 0 && (
            <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
              <p className="text-gray-500">Belum ada proyek. Klik "Tambah Proyek" untuk memulai.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
