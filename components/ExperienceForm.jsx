'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Save, Loader2, CheckCircle2, Link as LinkIcon, Camera, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MultiPhotoUpload from './MultiPhotoUpload';
import SinglePhotoUpload from './SinglePhotoUpload';

export default function ExperienceForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    period: '',
    description: '',
    logoUrl: '',
    proofUrl: '',
    images: [],
    showOnHome: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = initialData
      ? await supabase.from('Experience').update(formData).eq('id', initialData.id)
      : await supabase.from('Experience').insert([formData]);

    setLoading(false);
    if (error) {
      alert('Gagal menyimpan: ' + error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/experience');
        router.refresh();
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="flex items-center gap-2 p-4 bg-teal-500/10 border border-teal-500/50 text-teal-400 rounded-xl animate-fade-in-up">
          <CheckCircle2 size={20} />
          Pengalaman berhasil disimpan!
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
          Perusahaan
        </label>
        <input
          required
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-foreground"
          placeholder="Contoh: Google Indonesia"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center gap-2">
          <Camera size={14} /> Logo Perusahaan
        </label>
        <SinglePhotoUpload
          value={formData.logoUrl || ''}
          onChange={(url) => setFormData({ ...formData, logoUrl: url })}
          path="logos/experience"
          label="Upload Logo"
          shape="square"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
          Jabatan
        </label>
        <input
          required
          type="text"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-foreground"
          placeholder="Contoh: Senior Web Developer"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
          Periode
        </label>
        <input
          required
          type="text"
          value={formData.period}
          onChange={(e) => setFormData({ ...formData, period: e.target.value })}
          className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-foreground"
          placeholder="Contoh: Jan 2021 - Des 2023"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest flex items-center gap-2">
          <LinkIcon size={14} /> Link Bukti / Dokumentasi (Opsional)
        </label>
        <input
          type="text"
          value={formData.proofUrl || ''}
          onChange={(e) => setFormData({ ...formData, proofUrl: e.target.value })}
          className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-foreground"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest flex items-center gap-2">
          <Camera size={14} /> Foto Dokumentasi
        </label>
        <MultiPhotoUpload
          images={formData.images}
          onChange={(newImages) => setFormData((prev) => ({ ...prev, images: newImages }))}
          path="experience"
        />
      </div>

      {/* Visibility Toggle */}
      <div className="flex items-center justify-between p-6 bg-white/5 border border-[var(--border-subtle)] rounded-3xl">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl ${formData.showOnHome ? 'bg-teal-500/20 text-teal-500' : 'bg-gray-500/20 text-gray-500'}`}>
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
          className={`relative w-14 h-7 rounded-full transition-all ${formData.showOnHome ? 'bg-teal-500' : 'bg-white/10'}`}
        >
          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${formData.showOnHome ? 'left-8' : 'left-1'}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-4 bg-teal-500 text-black font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-teal-500/20"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {loading ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Tambah Pengalaman'}
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
