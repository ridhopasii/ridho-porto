'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Save, Loader2, CheckCircle2, Camera, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MultiPhotoUpload from './MultiPhotoUpload';

export default function OrganizationForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    period: '',
    description: '',
    website: '',
    proofUrl: '',
    logoUrl: '',
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
      ? await supabase.from('Organization').update(formData).eq('id', initialData.id)
      : await supabase.from('Organization').insert([formData]);

    setLoading(false);
    if (error) {
      alert('Gagal: ' + error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/organizations');
        router.refresh();
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="flex items-center gap-2 p-4 bg-teal-500/10 border border-teal-500/50 text-teal-400 rounded-xl animate-fade-in-up">
          <CheckCircle2 size={20} />
          Organisasi berhasil disimpan!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo Section */}
        <div className="md:col-span-1">
          <label className="block text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest text-white/60 flex items-center gap-2">
            <Camera size={14} /> Logo Organisasi
          </label>
          <MultiPhotoUpload
            images={formData.logoUrl ? [formData.logoUrl] : []}
            onChange={(imgs) => setFormData((prev) => ({ ...prev, logoUrl: imgs[0] || '' }))}
            path="organizations"
          />
          <p className="text-[10px] text-gray-500 mt-2 italic">* Unggah 1 foto untuk logo.</p>
        </div>

        {/* Main Fields Section */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest text-white/60">
              Nama Organisasi
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-white"
              placeholder="Contoh: BUMP Pesantren"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest text-white/60">
                Jabatan / Role
              </label>
              <input
                required
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-white"
                placeholder="Contoh: Ketua Bagian Dokumentasi"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest text-white/60">
                Periode
              </label>
              <input
                required
                type="text"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-white"
                placeholder="Jan 2024 - Jan 2025"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest text-white/60">
            Website / Link (Opsional)
          </label>
          <input
            type="text"
            value={formData.website || ''}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-white"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest text-white/60">
            Link Bukti / Dokumentasi Online
          </label>
          <input
            type="text"
            value={formData.proofUrl || ''}
            onChange={(e) => setFormData({ ...formData, proofUrl: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-white"
            placeholder="https://google-drive.com/sertifikat"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest text-white/60">
          Deskripsi / Kegiatan
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all resize-none text-white"
          placeholder="Jelaskan kontribusi Anda di organisasi ini..."
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest flex items-center gap-2 text-white/60">
          <Camera size={14} /> Foto Dokumentasi & Sertifikat (Multi-foto)
        </label>
        <MultiPhotoUpload
          images={formData.images}
          onChange={(newImages) => setFormData((prev) => ({ ...prev, images: newImages }))}
          path="organizations"
        />
      </div>

      <div className="pt-4 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-4 bg-teal-500 text-black font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-teal-500/20"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {loading ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Tambah Organisasi'}
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
