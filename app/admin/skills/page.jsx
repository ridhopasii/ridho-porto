import { createClient } from '@/utils/supabase/server'
import AdminSidebar from '@/components/AdminSidebar'
import { Plus, Trash2, Cpu } from 'lucide-react'
import SkillForm from '@/components/SkillForm'

export default async function AdminSkills() {
  const supabase = await createClient()
  const { data: skills } = await supabase.from('Skill').select('*')

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-jakarta">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold">Kelola Keterampilan</h1>
            <p className="text-gray-500 text-sm">Daftar teknologi yang Anda tampilkan di website.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Tambah Skill */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl sticky top-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus size={20} className="text-teal-500" /> Tambah Skill
              </h2>
              <SkillForm />
            </div>
          </div>

          {/* List Skill */}
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills?.map((skill) => (
                <div key={skill.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-teal-500/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-500/10 text-teal-500 rounded-lg">
                      <Cpu size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold">{skill.name}</h3>
                      <p className="text-xs text-gray-500">{skill.level || 'Expert'}</p>
                    </div>
                  </div>
                  <button className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/10 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {skills?.length === 0 && <p className="text-gray-600 italic">Belum ada data skill.</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
