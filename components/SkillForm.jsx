'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Save, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SkillForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [level, setLevel] = useState('Expert')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    const supabase = createClient()
    const { error } = await supabase
      .from('Skill')
      .insert([{ name, level }])

    setLoading(false)
    if (error) {
      alert('Gagal: ' + error.message)
    } else {
      setName('')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Nama Teknologi</label>
        <input 
          required
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-all text-sm"
          placeholder="Contoh: Next.js"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-widest">Tingkat Kemahiran</label>
        <select 
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:border-teal-500 focus:outline-none transition-all text-sm appearance-none"
        >
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
          <option value="Expert">Expert</option>
        </select>
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 bg-teal-500 text-black font-bold rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
        {loading ? 'Menyimpan...' : 'Tambah Skill'}
      </button>
    </form>
  )
}
