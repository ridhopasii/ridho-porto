import { createClient } from '@/utils/supabase/server'
import AdminSidebar from '@/components/AdminSidebar'
import { Plus, Trash2, Trophy, Eye, EyeOff } from 'lucide-react'
import AwardForm from '@/components/AwardForm'
import VisibilityToggle from '@/components/VisibilityToggle'

export default async function AdminAwards() {
  const supabase = await createClient()
  const { data: awards } = await supabase
    .from('Award')
    .select('*')
    .order('year', { ascending: false })

  return (
    <div className="min-h-screen bg-background text-foreground flex font-jakarta">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold">Kelola Penghargaan</h1>
            <p className="text-gray-500 text-sm">Sertifikat dan pencapaian yang Anda raih.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="p-6 bg-white/5 border border-[var(--border-subtle)] rounded-3xl sticky top-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus size={20} className="text-yellow-500" /> Tambah Penghargaan
              </h2>
              <AwardForm />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {awards?.map((award) => (
                <div key={award.id} className="p-4 bg-white/5 border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between group hover:border-yellow-500/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg">
                      <Trophy size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold">{award.title}</h3>
                      <p className="text-xs text-gray-500">{award.issuer} • {award.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <VisibilityToggle 
                      id={award.id} 
                      tableName="Award" 
                      initialValue={award.showOnHome} 
                    />
                    <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {awards?.length === 0 && <p className="text-gray-600 italic">Belum ada data penghargaan.</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
