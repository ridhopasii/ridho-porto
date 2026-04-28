'use client';
import { useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function SinglePhotoUpload({
  value = '',
  onChange,
  bucket = 'portofolio',
  path = 'logos',
  label = 'Upload Foto',
  shape = 'square', // 'square' | 'circle'
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = `${path}/${fileName}`;

    const { error } = await supabase.storage.from(bucket).upload(filePath, file, { upsert: true });

    if (!error) {
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      onChange(data.publicUrl);
    } else {
      alert('Gagal upload: ' + error.message);
    }
    setUploading(false);
  };

  const isCircle = shape === 'circle';

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Preview */}
      <div className={`relative overflow-hidden border-2 border-[var(--border-subtle)] bg-white/5 flex items-center justify-center ${isCircle ? 'w-24 h-24 rounded-full' : 'w-24 h-24 rounded-2xl'}`}>
        {value ? (
          <>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-foreground hover:scale-110 transition-all"
            >
              <X size={10} />
            </button>
          </>
        ) : (
          <ImageIcon size={24} className="text-gray-600" />
        )}
      </div>

      {/* Status */}
      {value ? (
        <span className="text-[10px] text-teal-500 font-black uppercase tracking-widest">✓ Foto Tersimpan</span>
      ) : (
        <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Belum ada foto</span>
      )}

      {/* Upload Button */}
      <label className="cursor-pointer px-4 py-2 bg-white/5 border border-[var(--border-subtle)] rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-teal-500/50 hover:text-teal-400 transition-all flex items-center gap-2">
        {uploading ? (
          <><Loader2 size={12} className="animate-spin" /> Mengupload...</>
        ) : (
          <><Upload size={12} /> {value ? 'Ganti Foto' : label}</>
        )}
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
        />
      </label>

      {/* Or paste URL */}
      <div className="w-full">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Atau paste URL foto..."
          className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-[10px] text-gray-400 focus:outline-none focus:border-teal-500 transition-all"
        />
      </div>
    </div>
  );
}
