'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Save, Loader2 } from 'lucide-center'
import { useRouter } from 'next/navigation'

export default function PublicationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    publisher: '',
    year: '',
    url: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const supabase = createClient()
    const { error } = await supabase
      .from('Publication')
      .insert([formData])

    setLoading(false)
    if (error) {
      alert('Gagal: ' + error.message)
    } else {
      setFormData({ title: '', publisher: '', year: '', url: '' })
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Judul Artikel / Karya Tulis</label>
        <input 
          required
          type="text" 
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
          placeholder="Judul Publikasi"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Penerbit / Jurnal</label>
        <input 
          required
          type="text" 
          value={formData.publisher}
          onChange={(e) => setFormData({...formData, publisher: e.target.value})}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
          placeholder="Nama Media / Publisher"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Tahun</label>
          <input 
            required
            type="text" 
            value={formData.year}
            onChange={(e) => setFormData({...formData, year: e.target.value})}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
            placeholder="2024"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Link (URL)</label>
          <input 
            type="text" 
            value={formData.url}
            onChange={(e) => setFormData({...formData, url: e.target.value})}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-blue-500 focus:outline-none transition-all"
            placeholder="https://..."
          />
        </div>
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? <span className="animate-spin text-lg">⌛</span> : <span className="text-lg">💾</span>}
        {loading ? 'Menyimpan...' : 'Simpan Publikasi'}
      </button>
    </form>
  )
}
