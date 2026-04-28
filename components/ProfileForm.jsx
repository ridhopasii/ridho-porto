'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  Save,
  Loader2,
  Camera,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Globe,
  CheckCircle2,
  Facebook,
  User,
  Layout,
} from 'lucide-react';
import MultiPhotoUpload from './MultiPhotoUpload';
import { useRouter } from 'next/navigation';

export default function ProfileForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    name: '',
    title: '',
    bio: '',
    avatarUrl: '',
    badge: 'Duta Pemuda Global',
    status_text: 'Open for collaborations',
    quote: '',
    about_tag: 'Discovery',
    about_title: 'Beyond the Surface',
    location: 'Indonesia',
    education_level: 'Global Relations',
    availability: 'Ready to Work',
    instagram_url: '',
    twitter_url: '',
    tiktok_url: '',
    facebook_url: '',
    images: [],
    footer_title: "LET'S WORK TOGETHER",
    footer_sub: '',
    email: '',
    github_url: '',
    linkedin_url: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        // Pastikan images selalu berupa array, bukan string JSON
        images: Array.isArray(initialData.images)
          ? initialData.images
          : typeof initialData.images === 'string'
          ? JSON.parse(initialData.images || '[]')
          : [],
        // Sync fullName ke name
        name: initialData.fullName || initialData.name || '',
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // keep fullName in sync with name field
      ...(name === 'name' ? { fullName: value } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();

    try {
      let error;
      const payload = {
        ...formData,
        fullName: formData.name || formData.fullName,
      };

      if (initialData?.id) {
        // UPDATE — profil sudah ada
        ({ error } = await supabase
          .from('Profile')
          .update(payload)
          .eq('id', initialData.id));
      } else {
        // INSERT — profil belum ada sama sekali
        ({ error } = await supabase.from('Profile').insert([payload]));
      }

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.refresh();
      }, 2000);
    } catch (err) {
      alert('Gagal menyimpan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {success && (
        <div className="sticky top-0 z-50 flex items-center gap-2 p-4 bg-accent text-black font-bold rounded-xl shadow-2xl animate-bounce">
          <CheckCircle2 size={20} />
          Perubahan Disimpan & Langsung Aktif di Halaman Depan!
        </div>
      )}

      {/* SECTION 1: IDENTITAS UTAMA */}
      <div className="bg-white/5 p-8 rounded-3xl border border-[var(--border-subtle)]">
        <h3 className="text-accent font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
          <User size={14} /> Identitas & Foto
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Photo Upload with built-in preview */}
          <div className="lg:col-span-1">
            <div className="p-5 bg-white/5 border border-[var(--border-subtle)] rounded-3xl">
              <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                <Camera size={12} /> Foto Profil
              </p>
              <MultiPhotoUpload
                images={formData.images}
                onChange={(newImages) => setFormData((prev) => ({ ...prev, images: newImages }))}
                path="profile"
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">
                  Nama Lengkap
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-background/40 border border-[var(--border-subtle)] rounded-2xl px-5 py-4 focus:border-accent outline-none text-foreground transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">
                  Tagline (Hero)
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-background/40 border border-[var(--border-subtle)] rounded-2xl px-5 py-4 focus:border-accent outline-none text-foreground transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">
                  Badge Teks (Foto)
                </label>
                <input
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  className="w-full bg-background/40 border border-[var(--border-subtle)] rounded-2xl px-5 py-4 focus:border-accent outline-none text-foreground transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">
                  Status Kolaborasi
                </label>
                <input
                  name="status_text"
                  value={formData.status_text}
                  onChange={handleChange}
                  className="w-full bg-background/40 border border-[var(--border-subtle)] rounded-2xl px-5 py-4 focus:border-accent outline-none text-foreground transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: ABOUT & QUOTE */}
      <div className="bg-white/5 p-8 rounded-3xl border border-[var(--border-subtle)]">
        <h3 className="text-accent font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
          <Layout size={14} /> Konten Halaman Tentang
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">
              About Tag (Kecil)
            </label>
            <input
              name="about_tag"
              value={formData.about_tag}
              onChange={handleChange}
              className="w-full bg-background/40 border border-[var(--border-subtle)] rounded-2xl px-5 py-4 focus:border-accent outline-none text-foreground"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">
              About Title (Besar)
            </label>
            <input
              name="about_title"
              value={formData.about_title}
              onChange={handleChange}
              className="w-full bg-background/40 border border-[var(--border-subtle)] rounded-2xl px-5 py-4 focus:border-accent outline-none text-foreground"
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">
            Bio Utama
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="w-full bg-background/40 border border-[var(--border-subtle)] rounded-2xl px-5 py-4 focus:border-accent outline-none text-foreground resize-none"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">
              Lokasi
            </label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-background/40 border border-[var(--border-subtle)] rounded-2xl px-5 py-4 focus:border-accent outline-none text-foreground transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">
              Pendidikan (Tag)
            </label>
            <input
              name="education_level"
              value={formData.education_level}
              onChange={handleChange}
              className="w-full bg-background/40 border border-[var(--border-subtle)] rounded-2xl px-5 py-4 focus:border-accent outline-none text-foreground transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">
              Ketersediaan
            </label>
            <input
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full bg-background/40 border border-[var(--border-subtle)] rounded-2xl px-5 py-4 focus:border-accent outline-none text-foreground transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">
            Kutipan / Quote Personal
          </label>
          <input
            name="quote"
            value={formData.quote}
            onChange={handleChange}
            className="w-full bg-background/40 border border-[var(--border-subtle)] rounded-2xl px-5 py-4 focus:border-accent outline-none text-foreground"
          />
        </div>
      </div>

      {/* SECTION 3: SOCIALS & FOOTER */}
      <div className="bg-white/5 p-8 rounded-3xl border border-[var(--border-subtle)]">
        <h3 className="text-accent font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
          <Globe size={14} /> Kontak & Footer
        </h3>

        {/* Social Media Links */}
        <div className="p-8 bg-white/5 border border-[var(--border-subtle)] rounded-[2.5rem] mb-8">
          <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
            <Globe size={20} className="text-accent" /> Jejaring Sosial
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                <Instagram size={14} /> Instagram URL
              </label>
              <input
                type="text"
                name="instagram_url"
                value={formData.instagram_url}
                onChange={handleChange}
                className="w-full bg-background/40 border border-[var(--border-subtle)] rounded-2xl px-6 py-4 focus:border-accent focus:outline-none transition-all"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                <Linkedin size={14} /> LinkedIn URL
              </label>
              <input
                type="text"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                className="w-full bg-background/40 border border-[var(--border-subtle)] rounded-2xl px-6 py-4 focus:border-accent focus:outline-none transition-all"
                placeholder="https://linkedin.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                <Github size={14} /> GitHub URL
              </label>
              <input
                type="text"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                className="w-full bg-background/40 border border-[var(--border-subtle)] rounded-2xl px-6 py-4 focus:border-accent focus:outline-none transition-all"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                <Twitter size={14} /> Twitter URL
              </label>
              <input
                type="text"
                name="twitter_url"
                value={formData.twitter_url}
                onChange={handleChange}
                className="w-full bg-background/40 border border-[var(--border-subtle)] rounded-2xl px-6 py-4 focus:border-accent focus:outline-none transition-all"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                <Facebook size={14} /> Facebook URL
              </label>
              <input
                type="text"
                name="facebook_url"
                value={formData.facebook_url}
                onChange={handleChange}
                className="w-full bg-background/40 border border-[var(--border-subtle)] rounded-2xl px-6 py-4 focus:border-accent focus:outline-none transition-all"
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-black text-gray-600 uppercase border-b border-[var(--border-subtle)] pb-2">
            Pengaturan Footer
          </h4>
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">
              Judul Ajakan (CTA)
            </label>
            <input
              name="footer_title"
              value={formData.footer_title}
              onChange={handleChange}
              className="w-full bg-background/40 border border-[var(--border-subtle)] rounded-2xl px-5 py-4 focus:border-accent outline-none text-foreground"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">
              Deskripsi Footer
            </label>
            <textarea
              name="footer_sub"
              value={formData.footer_sub}
              onChange={handleChange}
              rows={3}
              className="w-full bg-background/40 border border-[var(--border-subtle)] rounded-2xl px-5 py-4 focus:border-accent outline-none text-foreground resize-none"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-6 bg-accent text-black font-black rounded-[2rem] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl shadow-accent/20 uppercase tracking-widest text-sm"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
        {loading ? 'Sedang Menyimpan Ke Database...' : 'Simpan Semua Perubahan'}
      </button>
    </form>
  );
}
