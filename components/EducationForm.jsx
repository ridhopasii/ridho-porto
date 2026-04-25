'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Save, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function EducationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    year: '',
    description: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const supabase = createClient()
    const { error } = await supabase
      .from('Education')
      .insert([formData])

    setLoading(false)
    if (error) {
      alert('Gagal: ' + error.message)
    } else {
      setFormData({ institution: '', degree: '', year: '', description: '' })
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Institusi</label>
        <input 
          required
          type="text" 
          value={formData.institution}
          onChange={(e) => setFormData({...formData, institution: e.target.value})}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-all"
          placeholder="Nama Sekolah / Universitas"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Gelar / Bidang</label>
        <input 
          required
          type="text" 
          value={formData.degree}
          onChange={(e) => setFormData({...formData, degree: e.target.value})}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-all"
          placeholder="Contoh: S1 Teknik Informatika"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Tahun</label>
        <input 
          required
          type="text" 
          value={formData.year}
          onChange={(e) => setFormData({...formData, year: e.target.value})}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 focus:outline-none transition-all"
          placeholder="Contoh: 2017 - 2021"
        />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 bg-purple-500 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
        {loading ? 'Menyimpan...' : 'Simpan Pendidikan'}
      </button>
    </form>
  )
}
