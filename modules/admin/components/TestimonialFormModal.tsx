"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import ImageUploader from "./ImageUploader";
import { ModalShell, FormFooter, Field, inputCls, labelCls } from "./AdminFormUI";

interface TestimonialFormModalProps {
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TestimonialFormModal({ item, onClose, onSuccess }: TestimonialFormModalProps) {
  const isEditing = !!item;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: item?.name || "",
    role: item?.role || "",
    message: item?.message || "",
    avatarUrl: item?.avatarUrl || "",
    rating: item?.rating || 5,
  });

  const set = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(isEditing ? "Memperbarui..." : "Menyimpan...");
    try {
      const payload = isEditing ? { id: item.id, ...formData } : formData;
      const res = await fetch("/api/admin/testimonials", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    <ModalShell title={isEditing ? "Edit Testimonial" : "Tambah Testimonial"} maxWidth="max-w-lg" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nama" required>
            <input required value={formData.name} onChange={e => set("name", e.target.value)} className={inputCls} placeholder="Nama pemberi testimoni" />
          </Field>
          <Field label="Role / Jabatan" required>
            <input required value={formData.role} onChange={e => set("role", e.target.value)} className={inputCls} placeholder="e.g. CEO at Company" />
          </Field>
        </div>

        <Field label="Pesan Testimoni" required>
          <textarea required value={formData.message} onChange={e => set("message", e.target.value)} rows={4} className={inputCls} placeholder="Isi testimoni..." />
        </Field>

        {/* Star rating picker */}
        <div>
          <label className={labelCls}>Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type="button"
                onClick={() => set("rating", star)}
                className={`text-2xl transition-transform hover:scale-110 ${star <= formData.rating ? "text-yellow-400" : "text-neutral-300 dark:text-neutral-600"}`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 self-center text-sm font-medium text-neutral-500">{formData.rating}/5</span>
          </div>
        </div>

        <div>
          <label className={labelCls}>Foto Avatar</label>
          <ImageUploader value={formData.avatarUrl} onChange={url => set("avatarUrl", url)} path="testimonials" />
        </div>

        <FormFooter onClose={onClose} loading={loading} saveLabel="Simpan Testimoni" />
      </form>
    </ModalShell>
  );
}
