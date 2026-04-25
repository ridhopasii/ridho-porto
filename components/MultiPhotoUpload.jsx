'use client';
import { useState } from 'react';
import { Plus, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function MultiPhotoUpload({
  images = [],
  onChange,
  bucket = 'portofolio',
  path = 'general',
}) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const supabase = createClient();
    const newImages = [...(Array.isArray(images) ? images : [])];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);

      if (!uploadError) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        newImages.push(data.publicUrl);
      } else {
        console.error('Upload error:', uploadError);
      }
    }

    onChange(newImages);
    setUploading(false);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images?.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group bg-[#111]"
          >
            <img src={url} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg"
            >
              <X size={14} />
            </button>
            {index === 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-teal-500 text-black text-[10px] font-bold text-center py-1 uppercase">
                Utama
              </div>
            )}
          </div>
        ))}

        <label className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-teal-500/50 hover:bg-teal-500/5 transition-all group">
          {uploading ? (
            <Loader2 className="animate-spin text-teal-500" />
          ) : (
            <>
              <Plus className="text-gray-500 group-hover:text-teal-500 mb-2" />
              <span className="text-[10px] text-gray-500 font-bold uppercase group-hover:text-teal-500">
                Tambah Foto
              </span>
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
    </div>
  );
}
