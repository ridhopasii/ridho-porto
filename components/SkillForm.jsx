'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Save, Loader2, CheckCircle2, Link as LinkIcon, Camera, Tag, Cpu, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MultiPhotoUpload from './MultiPhotoUpload';

export default function SkillForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'hardskill',
    level: 'Expert',
    percentage: 90,
    description: '',
    images: [],
    showOnHome: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        percentage: initialData.percentage || 90,
        images: initialData.images || [],
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const payload = { ...formData };

    const { error } = initialData
      ? await supabase.from('Skill').update(payload).eq('id', initialData.id)
      : await supabase.from('Skill').insert([payload]);

    setLoading(false);
    if (error) {
      alert('Gagal menyimpan: ' + error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/skills');
        router.refresh();
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="flex items-center gap-2 p-4 bg-accent/10 border border-accent/50 text-accent rounded-xl animate-fade-in-up">
          <CheckCircle2 size={20} />
          Skill berhasil disimpan!
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest flex items-center gap-2">
          <Cpu size={14} /> Nama Teknologi / Skill
        </label>
        <input
          required
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-xl px-5 py-4 focus:border-accent focus:outline-none transition-all text-foreground"
          placeholder="Contoh: Adobe Photoshop"
        />
      </div>

      {/* Category & Level */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
            Kategori
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-xl px-5 py-4 focus:border-accent focus:outline-none transition-all text-foreground appearance-none"
          >
            <option value="hardskill">Hard Skill</option>
            <option value="softskill">Soft Skill</option>
            <option value="bahasa">Bahasa</option>
            <option value="design">Design</option>
            <option value="tools">Tools</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
            Level
          </label>
          <select
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-xl px-5 py-4 focus:border-accent focus:outline-none transition-all text-foreground appearance-none"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
      </div>

      {/* Percentage */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
          Persentase Kemahiran: <span className="text-accent">{formData.percentage}%</span>
        </label>
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={formData.percentage}
          onChange={(e) => setFormData({ ...formData, percentage: parseInt(e.target.value) })}
          className="w-full accent-accent"
        />
        <div className="flex justify-between text-[10px] text-gray-600 mt-1 font-bold uppercase">
          <span>10%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
          Deskripsi Skill (Opsional)
        </label>
        <textarea
          rows={4}
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-xl px-5 py-4 focus:border-accent focus:outline-none transition-all text-foreground resize-none"
          placeholder="Jelaskan pengalaman Anda menggunakan skill ini..."
        />
      </div>

      {/* Documentation Photos */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest flex items-center gap-2">
          <Camera size={14} /> Foto Portofolio Terkait
        </label>
        <MultiPhotoUpload
          images={formData.images}
          onChange={(newImages) => setFormData((prev) => ({ ...prev, images: newImages }))}
          path="skills"
        />
      </div>

      {/* Visibility Toggle */}
      <div className="flex items-center justify-between p-6 bg-white/5 border border-[var(--border-subtle)] rounded-3xl">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl ${formData.showOnHome ? 'bg-accent/20 text-accent' : 'bg-gray-500/20 text-gray-500'}`}>
            {formData.showOnHome ? <Eye size={20} /> : <EyeOff size={20} />}
          </div>
          <div>
            <p className="text-sm font-bold">Tampilkan di Home Page</p>
            <p className="text-xs text-gray-500">Konten ini akan {formData.showOnHome ? 'muncul' : 'disembunyikan'} di halaman utama.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, showOnHome: !prev.showOnHome }))}
          className={`relative w-14 h-7 rounded-full transition-all ${formData.showOnHome ? 'bg-accent' : 'bg-white/10'}`}
        >
          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${formData.showOnHome ? 'left-8' : 'left-1'}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-4 bg-accent text-black font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-accent/20"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {loading ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Tambah Skill'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-4 bg-white/5 text-foreground font-bold rounded-xl border border-[var(--border-subtle)] hover:bg-white/10 transition-all"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
