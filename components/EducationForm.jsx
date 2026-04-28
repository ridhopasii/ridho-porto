'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Save, Loader2, CheckCircle2, Link as LinkIcon, Camera, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MultiPhotoUpload from './MultiPhotoUpload';
import SinglePhotoUpload from './SinglePhotoUpload';

export default function EducationForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    institution: '',
    degree: '',
    major: '',
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
      ? await supabase.from('Education').update(formData).eq('id', initialData.id)
      : await supabase.from('Education').insert([formData]);

    setLoading(false);
    if (error) {
      alert('Gagal menyimpan: ' + error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/education');
        router.refresh();
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="flex items-center gap-2 p-4 bg-accent/10 border border-accent/50 text-accent rounded-xl animate-fade-in-up">
          <CheckCircle2 size={20} />
          Data pendidikan berhasil disimpan!
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
          Institusi / Sekolah
        </label>
        <input
          required
          type="text"
          value={formData.institution}
          onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
          className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-xl px-5 py-4 focus:border-accent focus:outline-none transition-all text-foreground"
          placeholder="Contoh: Universitas Indonesia"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center gap-2">
          <Camera size={14} /> Logo Institusi
        </label>
        <SinglePhotoUpload
          value={formData.logoUrl || ''}
          onChange={(url) => setFormData({ ...formData, logoUrl: url })}
          path="logos/education"
          label="Upload Logo"
          shape="square"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
          Gelar
        </label>
        <input
          required
          type="text"
          value={formData.degree}
          onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
          className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-xl px-5 py-4 focus:border-accent focus:outline-none transition-all text-foreground"
          placeholder="Contoh: Sarjana Komputer"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
          Jurusan / Bidang Studi
        </label>
        <input
          required
          type="text"
          value={formData.major}
          onChange={(e) => setFormData({ ...formData, major: e.target.value })}
          className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-xl px-5 py-4 focus:border-accent focus:outline-none transition-all text-foreground"
          placeholder="Contoh: Teknik Informatika"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
          Periode / Tahun
        </label>
        <input
          required
          type="text"
          value={formData.period}
          onChange={(e) => setFormData({ ...formData, period: e.target.value })}
          className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-xl px-5 py-4 focus:border-accent focus:outline-none transition-all text-foreground"
          placeholder="Contoh: 2018 - 2022"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
          Keterangan / Prestasi
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-xl px-5 py-4 focus:border-accent focus:outline-none transition-all resize-none text-foreground"
          placeholder="Jelaskan konsentrasi studi atau pencapaian akademik..."
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest flex items-center gap-2">
          <LinkIcon size={14} /> Link Bukti / Ijazah (Opsional)
        </label>
        <input
          type="text"
          value={formData.proofUrl || ''}
          onChange={(e) => setFormData({ ...formData, proofUrl: e.target.value })}
          className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-xl px-5 py-4 focus:border-accent focus:outline-none transition-all text-foreground"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest flex items-center gap-2">
          <Camera size={14} /> Foto Dokumentasi / Sertifikat
        </label>
        <MultiPhotoUpload
          images={formData.images}
          onChange={(newImages) => setFormData((prev) => ({ ...prev, images: newImages }))}
          path="education"
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
          {loading ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Tambah Pendidikan'}
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
