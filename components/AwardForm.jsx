'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Save, Loader2, CheckCircle2, Link as LinkIcon, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MultiPhotoUpload from './MultiPhotoUpload';

export default function AwardForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    organizer: '',
    date: '',
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
      ? await supabase.from('Award').update(formData).eq('id', initialData.id)
      : await supabase.from('Award').insert([formData]);

    setLoading(false);
    if (error) {
      alert('Gagal: ' + error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/awards');
        router.refresh();
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="flex items-center gap-2 p-4 bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 rounded-xl animate-fade-in-up">
          <CheckCircle2 size={20} />
          Penghargaan berhasil disimpan!
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
          Judul Penghargaan
        </label>
        <input
          required
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-yellow-500 focus:outline-none transition-all text-white"
          placeholder="Contoh: Juara 1 Web Design"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
            Penyelenggara / Issuer
          </label>
          <input
            required
            type="text"
            value={formData.organizer}
            onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-yellow-500 focus:outline-none transition-all text-white"
            placeholder="Nama Institusi"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
            Tanggal / Tahun
          </label>
          <input
            required
            type="text"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-yellow-500 focus:outline-none transition-all text-white"
            placeholder="Contoh: Des 2023"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">
          Keterangan / Detail
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-yellow-500 focus:outline-none transition-all resize-none text-white"
          placeholder="Jelaskan tentang penghargaan ini..."
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest flex items-center gap-2">
          <LinkIcon size={14} /> Link Sertifikat / Bukti (Opsional)
        </label>
        <input
          type="text"
          value={formData.proofUrl || ''}
          onChange={(e) => setFormData({ ...formData, proofUrl: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:border-yellow-500 focus:outline-none transition-all text-white"
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
          path="awards"
        />
      </div>

      <div className="pt-4 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-4 bg-yellow-600 text-white font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-yellow-500/20"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {loading ? 'Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Tambah Penghargaan'}
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
