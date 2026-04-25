'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import {
  Save,
  Loader2,
  User,
  Camera,
  CheckCircle2,
  Globe,
  MessageSquare,
  Layout,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfileForm({ initialData = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
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
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar-${Math.random()}.${fileExt}`;
    const filePath = `profile/${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('portofolio')
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('portofolio').getPublicUrl(filePath);
      setFormData((prev) => ({ ...prev, avatarUrl: data.publicUrl }));
    } catch (error) {
      alert('Gagal upload: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!initialData?.id) {
      alert('ID Profil tidak ditemukan. Pastikan data sudah ada di database.');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.from('Profile').update(formData).eq('id', initialData.id);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.refresh();
      }, 3000);
    } catch (error) {
      alert('Gagal menyimpan perubahan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {success && (
        <div className="sticky top-0 z-50 flex items-center gap-2 p-4 bg-teal-500 text-black font-bold rounded-xl shadow-2xl animate-bounce">
          <CheckCircle2 size={20} />
          Perubahan Disimpan & Langsung Aktif di Halaman Depan!
        </div>
      )}

      {/* SECTION 1: IDENTITAS UTAMA */}
      <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
        <h3 className="text-teal-500 font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
          <User size={14} /> Identitas & Foto
        </h3>

        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="relative group mx-auto md:mx-0">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-teal-500/30 bg-white/5 flex items-center justify-center">
              {formData.avatarUrl ? (
                <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-gray-700" />
              )}
            </div>
            <label className="absolute bottom-2 right-2 p-3 bg-teal-500 text-black rounded-full cursor-pointer hover:scale-110 transition-all shadow-xl">
              {uploading ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
              <input
                type="file"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
                accept="image/*"
              />
            </label>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">
                Nama Lengkap
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 outline-none text-white transition-all"
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
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 outline-none text-white transition-all"
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
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 outline-none text-white transition-all"
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
                className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 outline-none text-white transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: ABOUT & QUOTE */}
      <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
        <h3 className="text-teal-500 font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
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
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 outline-none text-white"
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
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 outline-none text-white"
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
            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 outline-none text-white resize-none"
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
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 outline-none text-white transition-all"
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
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 outline-none text-white transition-all"
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
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 outline-none text-white transition-all"
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
            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 outline-none text-white"
          />
        </div>
      </div>

      {/* SECTION 3: SOCIALS & FOOTER */}
      <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
        <h3 className="text-teal-500 font-black uppercase tracking-widest text-xs mb-8 flex items-center gap-2">
          <Globe size={14} /> Kontak & Footer
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">
              Email
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 outline-none text-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">
              GitHub URL
            </label>
            <input
              name="github_url"
              value={formData.github_url}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 outline-none text-white"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">
              LinkedIn URL
            </label>
            <input
              name="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 outline-none text-white"
            />
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-[10px] font-black text-gray-600 uppercase border-b border-white/5 pb-2">
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
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 outline-none text-white"
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
              className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 outline-none text-white resize-none"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || uploading}
        className="w-full py-6 bg-teal-500 text-black font-black rounded-[2rem] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-2xl shadow-teal-500/20 uppercase tracking-widest text-sm"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
        {loading ? 'Sedang Menyimpan Ke Database...' : 'Simpan Semua Perubahan'}
      </button>
    </form>
  );
}
