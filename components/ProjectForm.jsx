'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Save, Loader2, CheckCircle2, Image as ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ProjectForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectUrl: '',
    imageUrl: '',
    tags: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const supabase = createClient()
    
    // Insert data ke tabel Project
    const { error } = await supabase
      .from('Project')
      .insert([
        { 
          ...formData,
          // Ubah string tags menjadi array jika database Anda menggunakan array
          // tags: formData.tags.split(',').map(tag => tag.trim()) 
        }
      ])

    setLoading(false)
    if (error) {
      alert('Gagal menambah proyek: ' + error.message)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/admin/projects')
        router.refresh()
      }, 1500)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="flex items-center gap-2 p-4 bg-teal-500/10 border border-teal-500/50 text-teal-400 rounded-xl animate-fade-in-up">
          <CheckCircle2 size={20} />
          Proyek berhasil ditambahkan! Mengalihkan...
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Judul Proyek</label>
        <input 
          required
          type="text" 
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-all"
          placeholder="Nama aplikasi atau website Anda"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Deskripsi Singkat</label>
        <textarea 
          required
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-all resize-none"
          placeholder="Jelaskan secara singkat tentang proyek ini..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Link Proyek (Live)</label>
          <input 
            type="text" 
            name="projectUrl"
            value={formData.projectUrl}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-all"
            placeholder="https://proyek-anda.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">URL Gambar (Preview)</label>
          <input 
            type="text" 
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-all"
            placeholder="https://.../gambar.jpg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Tags / Teknologi (Pisahkan dengan koma)</label>
        <input 
          type="text" 
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-all"
          placeholder="React, Next.js, Tailwind..."
        />
      </div>

      <div className="pt-4 flex gap-4">
        <button 
          type="submit" 
          disabled={loading}
          className="flex-1 py-4 bg-teal-500 text-black font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {loading ? 'Menyimpan...' : 'Simpan Proyek'}
        </button>
        <button 
          type="button"
          onClick={() => router.back()}
          className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all"
        >
          Batal
        </button>
      </div>
    </form>
  )
}
