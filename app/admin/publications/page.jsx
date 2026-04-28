import { createClient } from '@/utils/supabase/server'
import AdminSidebar from '@/components/AdminSidebar'
import { Plus, Trash2, FileText, ExternalLink, Eye, EyeOff } from 'lucide-react'
import PublicationForm from '@/components/PublicationForm'
import VisibilityToggle from '@/components/VisibilityToggle'

export default async function AdminPublications() {
  const supabase = await createClient()
  const { data: publications } = await supabase
    .from('Publication')
    .select('*')
    .order('year', { ascending: false })

  return (
    <div className="min-h-screen bg-background text-foreground flex font-jakarta">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold">Kelola Publikasi</h1>
            <p className="text-gray-500 text-sm">Artikel, Jurnal, atau Karya Tulis Anda.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="p-6 bg-white/5 border border-[var(--border-subtle)] rounded-3xl sticky top-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus size={20} className="text-accent" /> Tambah Publikasi
              </h2>
              <PublicationForm />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {publications?.map((pub) => (
              <div key={pub.id} className="p-4 bg-white/5 border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between group hover:border-accent/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-accent/10 text-accent rounded-lg">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">{pub.title}</h3>
                    <p className="text-xs text-gray-500">{pub.publisher} • {pub.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <VisibilityToggle 
                    id={pub.id} 
                    tableName="Publication" 
                    initialValue={pub.showOnHome} 
                  />
                  <a href={pub.url} target="_blank" className="p-2 text-accent hover:bg-accent/10 rounded-lg">
                    <ExternalLink size={18} />
                  </a>
                  <button className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {publications?.length === 0 && <p className="text-gray-600 italic">Belum ada data publikasi.</p>}
          </div>
        </div>
      </main>
    </div>
  )
}
