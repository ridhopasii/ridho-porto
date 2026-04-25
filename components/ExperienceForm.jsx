'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Save, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ExperienceForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    period: '',
    description: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const supabase = createClient()
    const { error } = await supabase
      .from('Experience')
      .insert([formData])

    setLoading(false)
    if (error) {
      alert('Gagal: ' + error.message)
    } else {
      setFormData({ company: '', position: '', period: '', description: '' })
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Perusahaan</label>
        <input 
          required
          type="text" 
          value={formData.company}
          onChange={(e) => setFormData({...formData, company: e.target.value})}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-all"
          placeholder="Nama Perusahaan"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Jabatan</label>
        <input 
          required
          type="text" 
          value={formData.position}
          onChange={(e) => setFormData({...formData, position: e.target.value})}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-all"
          placeholder="Posisi Pekerjaan"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Periode</label>
        <input 
          required
          type="text" 
          value={formData.period}
          onChange={(e) => setFormData({...formData, period: e.target.value})}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-all"
          placeholder="Contoh: 2021 - 2023"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Deskripsi</label>
        <textarea 
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={3}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-all resize-none"
          placeholder="Apa saja yang Anda kerjakan?"
        />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 bg-teal-500 text-black font-bold rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
        {loading ? 'Menyimpan...' : 'Simpan Pengalaman'}
      </button>
    </form>
  )
}
