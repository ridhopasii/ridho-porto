"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { ModalShell, FormFooter, Field, inputCls, labelCls } from "./AdminFormUI";

interface LinkFormModalProps {
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const LINK_TYPES = [
  { value: "social",    label: "Social Media" },
  { value: "portfolio", label: "Portfolio / Project" },
  { value: "other",     label: "Lainnya" },
];

export default function LinkFormModal({ item, onClose, onSuccess }: LinkFormModalProps) {
  const isEditing = !!item;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: item?.title || "",
    url: item?.url || "",
    type: item?.type || "social",
    icon: item?.icon || "",
  });

  const set = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(isEditing ? "Memperbarui..." : "Menyimpan...");
    try {
      const payload = isEditing ? { id: item.id, ...formData } : formData;
      const res = await fetch("/api/admin/links", {
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
    <ModalShell title={isEditing ? "Edit Tautan" : "Tambah Tautan Baru"} maxWidth="max-w-md" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Title" required>
          <input required value={formData.title} onChange={e => set("title", e.target.value)} className={inputCls} placeholder="e.g. GitHub Profile" />
        </Field>

        <Field label="URL" required>
          <input required value={formData.url} onChange={e => set("url", e.target.value)} className={inputCls} placeholder="https://..." />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Tipe Tautan">
            <select value={formData.type} onChange={e => set("type", e.target.value)} className={inputCls}>
              {LINK_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>
          <Field label="Icon (opsional)" hint="Nama react-icon atau kode">
            <input value={formData.icon} onChange={e => set("icon", e.target.value)} className={inputCls} placeholder="e.g. BsGithub" />
          </Field>
        </div>

        <FormFooter onClose={onClose} loading={loading} saveLabel="Simpan Tautan" />
      </form>
    </ModalShell>
  );
}
