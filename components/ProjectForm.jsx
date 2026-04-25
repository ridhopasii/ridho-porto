'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Save, Loader2, CheckCircle2, Image as ImageIcon, X, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProjectForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectUrl: '',
    images: [], // Sekarang menggunakan array untuk banyak foto
    tags: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        images: Array.isArray(initialData.images)
          ? initialData.images
          : initialData.imageUrl
            ? [initialData.imageUrl]
            : [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const supabase = createClient();
    const newImages = [...formData.images];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);

      if (!uploadError) {
        const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);
        newImages.push(data.publicUrl);
      }
    }

    setFormData((prev) => ({ ...prev, images: newImages }));
    setUploading(false);
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();

    const payload = {
      title: formData.title,
      description: formData.description,
      projectUrl: formData.projectUrl,
      images: formData.images, // Simpan array gambar
      imageUrl: formData.images[0] || '', // Fallback untuk kompatibilitas
      tags: formData.tags,
    };

    const { error } = initialData
      ? await supabase.from('Project').update(payload).eq('id', initialData.id)
      : await supabase.from('Project').insert([payload]);

    setLoading(false);
    if (error) {
      alert('Gagal menyimpan proyek: ' + error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/projects');
        router.refresh();
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {success && (
        <div className="flex items-center gap-2 p-4 bg-teal-500/10 border border-teal-500/50 text-teal-400 rounded-xl animate-fade-in-up">
          <CheckCircle2 size={20} />
          Proyek berhasil disimpan! Mengalihkan...
        </div>
      )}

      {/* Upload Banyak Foto */}
      <div>
        <label className="block text-sm font-bold text-gray-400 mb-4 uppercase tracking-[0.2em]">
          Galeri Foto Proyek
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formData.images.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group"
            >
              <img src={url} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all"
              >
                <X size={14} />
              </button>
              {index === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-teal-500 text-black text-[10px] font-bold text-center py-1">
                  COVER
                </div>
              )}
            </div>
          ))}
          <label className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-teal-500/50 hover:bg-teal-500/5 transition-all">
            {uploading ? (
              <Loader2 className="animate-spin text-teal-500" />
            ) : (
              <>
                <Plus className="text-gray-500 mb-2" />
                <span className="text-[10px] text-gray-500 font-bold uppercase">Tambah Foto</span>
              </>
            )}
            <input
              type="file"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
              accept="image/*"
            />
          </label>
        </div>
        <p className="mt-2 text-[10px] text-gray-500 italic">
          * Foto pertama akan menjadi cover utama.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
            Judul Proyek
          </label>
          <input
            required
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-[#111] border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-white"
            placeholder="Contoh: Aplikasi E-Commerce"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
            Deskripsi Singkat
          </label>
          <textarea
            required
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full bg-[#111] border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all resize-none text-white"
            placeholder="Jelaskan apa yang Anda kerjakan di proyek ini..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
              Link Proyek (URL)
            </label>
            <input
              type="text"
              name="projectUrl"
              value={formData.projectUrl}
              onChange={handleChange}
              className="w-full bg-[#111] border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-white"
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
              Tags / Teknologi
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full bg-[#111] border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-white"
              placeholder="React, Supabase, Tailwind"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 flex gap-4">
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex-1 py-4 bg-teal-500 text-black font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-teal-500/20"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
          {loading ? 'Sedang Menyimpan...' : initialData ? 'Simpan Perubahan' : 'Terbitkan Proyek'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-4 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
