'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Save, Loader2, CheckCircle2, Image as ImageIcon, Eye, EyeOff, Camera, Tag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MultiPhotoUpload from './MultiPhotoUpload';

export default function GalleryForm({ initialData = null, onSuccess }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    date: '',
    description: '',
    images: [],
    showOnHome: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData, images: initialData.images || [] });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = initialData
      ? await supabase.from('Gallery').update(formData).eq('id', initialData.id)
      : await supabase.from('Gallery').insert([formData]);

    setLoading(false);
    if (error) {
      alert('Gagal: ' + error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/admin/gallery');
          router.refresh();
        }
      }, 1200);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="flex items-center gap-2 p-4 bg-purple-500/10 border border-purple-500/50 text-purple-400 rounded-xl animate-fade-in-up">
          <CheckCircle2 size={20} />
          Galeri berhasil disimpan!
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest text-foreground/60">
          Judul Kegiatan / Album
        </label>
        <input
          required
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-xl px-5 py-4 focus:border-purple-500 focus:outline-none transition-all text-foreground"
          placeholder="Contoh: Kunjungan Global Relations"
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
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest text-foreground/60 flex items-center gap-2">
            <Tag size={14} /> Kategori
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-xl px-5 py-4 focus:border-purple-500 focus:outline-none transition-all text-foreground appearance-none"
          >
            <option value="" className="bg-background">
              Pilih Kategori
            </option>
            <option value="kegiatan" className="bg-background">Kegiatan</option>
            <option value="prestasi" className="bg-background">Prestasi</option>
            <option value="organisasi" className="bg-background">Organisasi</option>
            <option value="pendidikan" className="bg-background">Pendidikan</option>
            <option value="lainnya" className="bg-background">Lainnya</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest text-foreground/60">
            Tanggal
          </label>
          <input
            type="text"
            value={formData.date || ''}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-xl px-5 py-4 focus:border-purple-500 focus:outline-none transition-all text-foreground"
            placeholder="Contoh: 2024"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest text-foreground/60">
          Keterangan Tambahan
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-xl px-5 py-4 focus:border-purple-500 focus:outline-none transition-all resize-none text-foreground"
          placeholder="Jelaskan sedikit tentang momen ini..."
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest flex items-center gap-2 text-foreground/60">
          <Camera size={14} /> Upload Foto Galeri
        </label>
        <MultiPhotoUpload
          images={formData.images}
          onChange={(newImages) => setFormData((prev) => ({ ...prev, images: newImages }))}
          path="gallery"
        />
      </div>

      <div className="pt-4 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-4 bg-purple-600 text-foreground font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-purple-500/20"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {loading ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Tambah ke Galeri'}
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
