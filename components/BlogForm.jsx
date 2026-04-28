'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Save, Loader2, Image as ImageIcon, X, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MultiPhotoUpload from './MultiPhotoUpload';

export default function BlogForm({ initialData = null }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    imageUrl: '',
    images: [],
    showOnHome: true,
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Otomatis buat slug dari judul
  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
    setFormData({ ...formData, title, slug });
  };

  // Multi photo upload handled by component

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = initialData
      ? await supabase.from('Article').update(formData).eq('id', initialData.id)
      : await supabase.from('Article').insert([formData]);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Artikel berhasil disimpan!' });
      setTimeout(() => router.push('/admin/blogs'), 1500);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
        >
          {message.text}
        </div>
      )}

      {/* Visibility Toggle */}
      <div className="flex items-center justify-between p-6 bg-white/5 border border-[var(--border-subtle)] rounded-3xl">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl ${formData.showOnHome ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-500/20 text-gray-500'}`}>
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
          className={`relative w-14 h-7 rounded-full transition-all ${formData.showOnHome ? 'bg-blue-500' : 'bg-white/10'}`}
        >
          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${formData.showOnHome ? 'left-8' : 'left-1'}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-400">Judul Artikel</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              className="mt-1 block w-full bg-[#1a1a1a] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Contoh: Cara Belajar Next.js"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400">Slug (URL)</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="mt-1 block w-full bg-[#1a1a1a] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400">Kategori</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full bg-[#1a1a1a] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Contoh: Tutorial, Review, Personal"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <ImageIcon size={14} className="text-blue-500" /> Galeri Foto Artikel
          </label>
          <MultiPhotoUpload
            images={formData.images}
            onChange={(newImages) =>
              setFormData((prev) => ({
                ...prev,
                images: newImages,
                imageUrl: newImages[0] || '',
              }))
            }
            path="blog"
          />
          <p className="text-[10px] text-gray-500 italic">
            * Foto pertama otomatis menjadi cover utama.
          </p>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-400">Ringkasan (Excerpt)</label>
        <textarea
          rows={2}
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          className="mt-1 block w-full bg-[#1a1a1a] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          placeholder="Ringkasan singkat artikel..."
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-400">Isi Artikel (Markdown/Text)</label>
        <textarea
          required
          rows={10}
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="mt-1 block w-full bg-[#1a1a1a] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          placeholder="Tulis artikel Anda di sini..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-foreground font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        Simpan Artikel
      </button>
    </form>
  );
}
