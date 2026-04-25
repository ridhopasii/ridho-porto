'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Save, Loader2, CheckCircle2 } from 'lucide-react'

export default function ProfileForm({ initialData }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || '',
    title: initialData?.title || '',
    bio: initialData?.bio || '',
    location: initialData?.location || '',
    avatarUrl: initialData?.avatarUrl || '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    const supabase = createClient()
    
    // Update data ke Supabase
    const { error } = await supabase
      .from('Profile')
      .update(formData)
      .eq('id', initialData?.id)

    setLoading(false)
    if (error) {
      alert('Gagal menyimpan: ' + error.message)
    } else {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="flex items-center gap-2 p-4 bg-teal-500/10 border border-teal-500/50 text-teal-400 rounded-xl animate-fade-in-up">
          <CheckCircle2 size={20} />
          Profil berhasil diperbarui!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Nama Lengkap</label>
          <input 
            type="text" 
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-all"
            placeholder="Contoh: Ridho Robbi Pasi"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Gelar / Role</label>
          <input 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-all"
            placeholder="Contoh: TechnoPreneur"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Bio Singkat</label>
        <textarea 
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-all resize-none"
          placeholder="Ceritakan sedikit tentang Anda..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">Lokasi</label>
          <input 
            type="text" 
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-all"
            placeholder="Contoh: Indonesia"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">URL Avatar (Foto)</label>
          <input 
            type="text" 
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-all"
            placeholder="https://..."
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-4 bg-teal-500 text-black font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>
    </form>
  )
}
