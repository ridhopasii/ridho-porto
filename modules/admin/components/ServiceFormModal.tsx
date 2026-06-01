"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import ImageUploader from "./ImageUploader";
import { ModalShell, FormFooter, ToggleSwitch, Field, inputCls, labelCls } from "./AdminFormUI";

interface ServiceFormModalProps {
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ServiceFormModal({ item, onClose, onSuccess }: ServiceFormModalProps) {
  const isEditing = !!item;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    icon: item?.icon || "",
    order: item?.order || 0,
  });

  const set = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(isEditing ? "Memperbarui..." : "Menyimpan...");
    try {
      const payload = isEditing ? { id: item.id, ...formData } : formData;
      const res = await fetch("/api/admin/services", {
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
    <ModalShell title={isEditing ? "Edit Layanan" : "Tambah Layanan"} maxWidth="max-w-lg" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Title" required>
          <input required value={formData.title} onChange={e => set("title", e.target.value)} className={inputCls} placeholder="e.g. Web Development" />
        </Field>

        <Field label="Description" required>
          <textarea required value={formData.description} onChange={e => set("description", e.target.value)} rows={3} className={inputCls} placeholder="Deskripsi layanan..." />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Icon Name / URL" hint="React icon string (SiReact) atau URL gambar">
            <input value={formData.icon} onChange={e => set("icon", e.target.value)} className={inputCls} placeholder="e.g. SiReact" />
          </Field>
          <Field label="Order (Urutan)">
            <input type="number" value={formData.order} onChange={e => set("order", Number(e.target.value))} className={inputCls} />
          </Field>
        </div>

        <div>
          <label className={labelCls}>Upload Icon Image (Override URL)</label>
          <ImageUploader
            value={formData.icon?.startsWith("http") || formData.icon?.startsWith("/") ? formData.icon : ""}
            onChange={url => set("icon", url)}
            path="services"
          />
        </div>

        <FormFooter onClose={onClose} loading={loading} saveLabel="Simpan Layanan" />
      </form>
    </ModalShell>
  );
}
