'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Save, Loader2, User, Camera, CheckCircle2 } from 'lucide-react';
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
    github: '',
    linkedin: '',
    email: '',
    resumeUrl: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `avatar-${Math.random()}.${fileExt}`;
    const filePath = `profile/${fileName}`;

    const { error: uploadError } = await supabase.storage.from('portfolio').upload(filePath, file);

    if (uploadError) {
      alert('Gagal upload: ' + uploadError.message);
    } else {
      const { data } = supabase.storage.from('portfolio').getPublicUrl(filePath);
      setFormData((prev) => ({ ...prev, avatarUrl: data.publicUrl }));
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.from('Profile').update(formData).eq('id', initialData.id);

    setLoading(false);
    if (error) {
      alert('Gagal menyimpan profil: ' + error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        router.refresh();
      }, 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {success && (
        <div className="flex items-center gap-2 p-4 bg-teal-500/10 border border-teal-500/50 text-teal-400 rounded-xl animate-fade-in-up">
          <CheckCircle2 size={20} />
          Profil berhasil diperbarui secara real-time!
        </div>
      )}

      {/* Profile Photo Upload */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 bg-white/5 flex items-center justify-center">
            {formData.avatarUrl ? (
              <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={48} className="text-gray-600" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-2 bg-teal-500 text-black rounded-full cursor-pointer hover:scale-110 transition-all shadow-lg">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
            <input
              type="file"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
              accept="image/*"
            />
          </label>
        </div>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          Foto Profil (Duta Pemuda Global)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
            Nama Lengkap
          </label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
            Tagline / Pekerjaan
          </label>
          <input
            required
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
          Bio Singkat (About)
        </label>
        <textarea
          required
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={5}
          className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all resize-none text-white leading-relaxed"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
            LinkedIn URL
          </label>
          <input
            type="text"
            value={formData.linkedin}
            onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
            className="w-full bg-black/40 border border-white/5 rounded-2xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-white"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || uploading}
        className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-teal-500 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
        {loading ? 'Menyimpan...' : 'Perbarui Profil'}
      </button>
    </form>
  );
}
