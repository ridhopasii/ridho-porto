"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import ImageUploader from "./ImageUploader";
import { ModalShell, FormFooter, ToggleSwitch, Field, inputCls, labelCls } from "./AdminFormUI";

interface GalleryFormModalProps {
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const GALLERY_CATEGORIES = ["Photography", "Design", "Travel", "Food", "Event", "Art", "Tech", "Other"];

export default function GalleryFormModal({ item, onClose, onSuccess }: GalleryFormModalProps) {
  const isEditing = !!item;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: item?.title || "",
    category: item?.category || "Photography",
    date: item?.date || "",
    description: item?.description || "",
    showOnHome: item?.showOnHome ?? true,
    imageUrl: item?.images?.[0] || "",
  });

  const set = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(isEditing ? "Memperbarui..." : "Menyimpan...");
    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        date: formData.date,
        description: formData.description,
        showOnHome: formData.showOnHome,
        images: formData.imageUrl ? [formData.imageUrl] : [],
      };
      const finalPayload = isEditing ? { id: item.id, ...payload } : payload;
      const res = await fetch("/api/admin/gallery", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(isEditing ? "Diperbarui!" : "Dibuat!", { id: toastId });
      onSuccess();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell title={isEditing ? "Edit Item Galeri" : "Tambah Item Galeri"} maxWidth="max-w-lg" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Judul" required>
          <input required value={formData.title} onChange={e => set("title", e.target.value)} className={inputCls} placeholder="Judul foto / gambar" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Kategori">
            <select value={formData.category} onChange={e => set("category", e.target.value)} className={inputCls}>
              {GALLERY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Tanggal">
            <input type="date" value={formData.date} onChange={e => set("date", e.target.value)} className={inputCls} />
          </Field>
        </div>

        <Field label="Deskripsi">
          <textarea value={formData.description} onChange={e => set("description", e.target.value)} rows={2} className={inputCls} placeholder="Keterangan foto..." />
        </Field>

        <div>
          <label className={labelCls}>Upload Foto</label>
          <ImageUploader value={formData.imageUrl} onChange={url => set("imageUrl", url)} path="gallery" />
        </div>

        <ToggleSwitch
          checked={formData.showOnHome}
          onChange={v => set("showOnHome", v)}
          label={formData.showOnHome ? "Tampilkan di Beranda" : "Disembunyikan"}
          description="Foto muncul di galeri beranda"
        />

        <FormFooter onClose={onClose} loading={loading} saveLabel="Simpan Foto" />
      </form>
    </ModalShell>
  );
}
