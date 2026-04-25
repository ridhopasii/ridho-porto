'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Save, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BlogForm({ initialData = null }) {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    cover_image: '',
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

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `blog-covers/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('portofolio').upload(filePath, file);

    if (uploadError) {
      alert('Gagal upload gambar: ' + uploadError.message);
    } else {
      const { data } = supabase.storage.from('portofolio').getPublicUrl(filePath);
      setFormData({ ...formData, cover_image: data.publicUrl });
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = initialData
      ? await supabase.from('blogs').update(formData).eq('id', initialData.id)
      : await supabase.from('blogs').insert([formData]);

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-400">Judul Artikel</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              className="mt-1 block w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
              className="mt-1 block w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400">Kategori</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Contoh: Tutorial, Review, Personal"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-400">Cover Image</label>
          <div className="relative aspect-video bg-[#1a1a1a] rounded-2xl border border-dashed border-white/10 flex items-center justify-center overflow-hidden group">
            {formData.cover_image ? (
              <>
                <img
                  src={formData.cover_image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, cover_image: '' })}
                  className="absolute top-2 right-2 p-2 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </>
            ) : (
              <label className="cursor-pointer text-center p-4">
                <ImageIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <span className="text-sm text-gray-500">
                  {uploading ? 'Sedang mengunggah...' : 'Klik untuk upload gambar'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-400">Ringkasan (Excerpt)</label>
        <textarea
          rows={2}
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          className="mt-1 block w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
          className="mt-1 block w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          placeholder="Tulis artikel Anda di sini..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        Simpan Artikel
      </button>
    </form>
  );
}
