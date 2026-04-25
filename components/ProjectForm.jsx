'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  Save,
  Loader2,
  CheckCircle2,
  Image as ImageIcon,
  X,
  Plus,
  ExternalLink,
  Github,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import MultiPhotoUpload from './MultiPhotoUpload';

export default function ProjectForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectUrl: '',
    repoUrl: '',
    images: [],
    tags: '',
    category: 'project',
    featured: false,
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

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
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

      {/* Upload Galeri Proyek */}
      <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
        <label className="block text-sm font-bold text-gray-400 mb-6 uppercase tracking-widest flex items-center gap-2">
          <ImageIcon size={18} className="text-teal-500" /> Galeri Foto Proyek
        </label>
        <MultiPhotoUpload
          images={formData.images}
          onChange={(newImages) => setFormData((prev) => ({ ...prev, images: newImages }))}
          path="projects"
        />
        <p className="mt-4 text-[10px] text-gray-500 italic">
          * Foto pertama akan menjadi cover utama proyek.
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
