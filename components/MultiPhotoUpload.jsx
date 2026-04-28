'use client';
import { useState } from 'react';
import { Upload, X, Loader2, GripVertical, Star, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function MultiPhotoUpload({
  images = [],
  onChange,
  bucket = 'portofolio',
  path = 'general',
}) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const safeImages = Array.isArray(images) ? images : [];

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const supabase = createClient();
    const newImages = [...safeImages];

    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `${path}/${fileName}`;
      const { error } = await supabase.storage.from(bucket).upload(filePath, file);
      if (!error) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        newImages.push(data.publicUrl);
      }
    }

    onChange(newImages);
    setPreviewIndex(newImages.length - 1);
    setUploading(false);
  };

  const handleFileInput = (e) => handleUpload(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  const removeImage = (index) => {
    const updated = safeImages.filter((_, i) => i !== index);
    onChange(updated);
    setPreviewIndex(Math.min(previewIndex, updated.length - 1));
  };

  const setAsMain = (index) => {
    const updated = [...safeImages];
    const [moved] = updated.splice(index, 1);
    updated.unshift(moved);
    onChange(updated);
    setPreviewIndex(0);
  };

  return (
    <div className="space-y-4">

      {/* Main Preview */}
      {safeImages.length > 0 && (
        <div className="relative rounded-2xl overflow-hidden bg-[#111] border border-[var(--border-subtle)]" style={{ aspectRatio: '4/3' }}>
          <img
            src={safeImages[previewIndex]}
            alt={`Preview ${previewIndex + 1}`}
            className="w-full h-full object-cover"
          />
          {/* Overlay info */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {previewIndex === 0 && (
              <span className="px-3 py-1 bg-accent text-black text-[10px] font-black uppercase rounded-full flex items-center gap-1">
                <Star size={10} /> Utama
              </span>
            )}
            <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-foreground text-[10px] font-bold rounded-full">
              {previewIndex + 1} / {safeImages.length}
            </span>
          </div>
          {/* Nav buttons */}
          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setPreviewIndex((i) => (i - 1 + safeImages.length) % safeImages.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full text-foreground flex items-center justify-center hover:bg-accent transition-all"
              >‹</button>
              <button
                type="button"
                onClick={() => setPreviewIndex((i) => (i + 1) % safeImages.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full text-foreground flex items-center justify-center hover:bg-accent transition-all"
              >›</button>
            </>
          )}
        </div>
      )}

      {/* Thumbnails strip */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {safeImages.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPreviewIndex(i)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                i === previewIndex ? 'border-accent scale-105' : 'border-[var(--border-subtle)] opacity-60 hover:opacity-100'
              }`}
            >
              <img src={url} className="w-full h-full object-cover" />
              {i === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-accent text-[8px] font-black text-black text-center py-0.5">
                  UTAMA
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Action buttons per photo */}
      {safeImages.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => removeImage(previewIndex)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[11px] font-bold hover:bg-red-500/20 transition-all"
          >
            <X size={12} /> Hapus Foto ini
          </button>
          {previewIndex !== 0 && (
            <button
              type="button"
              onClick={() => setAsMain(previewIndex)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 border border-accent/20 text-accent rounded-xl text-[11px] font-bold hover:bg-accent/20 transition-all"
            >
              <Star size={12} /> Jadikan Utama
            </button>
          )}
        </div>
      )}

      {/* Upload zone */}
      <label
        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
          dragOver
            ? 'border-accent bg-accent/10 scale-[1.01]'
            : 'border-[var(--border-subtle)] hover:border-accent/40 hover:bg-white/5'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="flex items-center gap-2 text-accent">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm font-bold">Mengupload foto...</span>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
              <Upload size={20} className="text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-foreground">
                {safeImages.length > 0 ? 'Tambah Foto Lagi' : 'Upload Foto'}
              </p>
              <p className="text-[11px] text-gray-500 mt-1">
                Drag & drop atau klik untuk pilih · Bisa pilih banyak sekaligus
              </p>
            </div>
          </>
        )}
        <input
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInput}
          disabled={uploading}
          accept="image/*"
        />
      </label>

      {/* Count badge */}
      {safeImages.length > 0 && (
        <div className="flex items-center gap-2 text-[11px] text-accent font-bold">
          <CheckCircle2 size={14} />
          {safeImages.length} foto tersimpan · foto pertama tampil sebagai utama
        </div>
      )}
    </div>
  );
}
