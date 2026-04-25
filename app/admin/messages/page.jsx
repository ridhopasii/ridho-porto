import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import AdminSidebar from '@/components/AdminSidebar'
import { Trash2, Mail, Calendar } from 'lucide-react'

export default async function AdminMessages() {
  const supabase = await createClient()
  const { data: messages, error } = await supabase
    .from('Message')
    .select('*')
    .order('createdAt', { ascending: false })

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-jakarta">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-2xl font-bold">Pesan Masuk</h1>
          <p className="text-gray-500 text-sm">Anda memiliki {messages?.length || 0} pesan dari pengunjung website.</p>
        </header>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 mb-6">
            Error: {error.message} (Cek RLS di Supabase)
          </div>
        )}

        {/* Messages List */}
        <div className="grid gap-6">
          {messages?.map((msg) => (
            <div key={msg.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl hover:border-teal-500/30 transition-all relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{msg.name}</h3>
                    <p className="text-sm text-gray-500">{msg.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-black/30 rounded-2xl mb-4 border border-white/5">
                <p className="text-gray-300 leading-relaxed italic">"{msg.message}"</p>
              </div>

              <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all">
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                  <Trash2 size={16} />
                  Hapus Pesan
                </button>
              </div>
            </div>
          ))}

          {messages?.length === 0 && (
            <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
              <p className="text-gray-500 text-sm italic">Belum ada pesan masuk.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
