'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Save, Loader2, CheckCircle2, Link as LinkIcon, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MultiPhotoUpload from './MultiPhotoUpload';

export default function ExperienceForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    period: '',
    description: '',
    proofUrl: '',
    images: [],
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
          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-white"
          placeholder="Contoh: Google Indonesia"
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
          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-white"
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
          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-white"
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
          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-white"
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

      <div className="pt-4 flex gap-4">
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
          className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
