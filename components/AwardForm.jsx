'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Save, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AwardForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    year: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const supabase = createClient()
    const { error } = await supabase
      .from('Award')
      .insert([formData])

    setLoading(false)
    if (error) {
      alert('Gagal: ' + error.message)
    } else {
      setFormData({ title: '', issuer: '', year: '' })
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Judul Penghargaan</label>
        <input 
          required
          type="text" 
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-500 focus:outline-none transition-all"
          placeholder="Contoh: Juara 1 Web Design"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Penyelenggara / Issuer</label>
        <input 
          required
          type="text" 
          value={formData.issuer}
          onChange={(e) => setFormData({...formData, issuer: e.target.value})}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-500 focus:outline-none transition-all"
          placeholder="Nama Institusi"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Tahun</label>
        <input 
          required
          type="text" 
          value={formData.year}
          onChange={(e) => setFormData({...formData, year: e.target.value})}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-yellow-500 focus:outline-none transition-all"
          placeholder="Contoh: 2023"
        />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 bg-yellow-600 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
        {loading ? 'Menyimpan...' : 'Simpan Penghargaan'}
      </button>
    </form>
  )
}
