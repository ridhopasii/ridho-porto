"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import ImageUploader from "./ImageUploader";
import { ModalShell, FormFooter, Field, inputCls, labelCls } from "./AdminFormUI";

interface UsesFormModalProps {
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const USES_CATEGORIES = [
  { value: "Hardware",  emoji: "💻" },
  { value: "Software",  emoji: "🖥️" },
  { value: "Audio",     emoji: "🎧" },
  { value: "Peripherals", emoji: "🖱️" },
  { value: "Tools",     emoji: "🔧" },
  { value: "Services",  emoji: "☁️" },
  { value: "Other",     emoji: "📦" },
];

export default function UsesFormModal({ item, onClose, onSuccess }: UsesFormModalProps) {
  const isEditing = !!item;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: item?.name || "",
    category: item?.category || "Hardware",
    description: item?.description || "",
    url: item?.url || "",
    iconUrl: item?.iconUrl || "",
  });

  const set = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(isEditing ? "Memperbarui..." : "Menyimpan...");
    try {
      const payload = isEditing ? { id: item.id, ...formData } : formData;
      const res = await fetch("/api/admin/uses", {
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
    <ModalShell title={isEditing ? "Edit Item Uses" : "Tambah Item Uses"} maxWidth="max-w-md" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nama Item" required>
          <input required value={formData.name} onChange={e => set("name", e.target.value)} className={inputCls} placeholder="e.g. MacBook Pro M2" />
        </Field>

        <Field label="Kategori">
          <div className="grid grid-cols-4 gap-1.5">
            {USES_CATEGORIES.map(cat => (
              <button
                key={cat.value}
                type="button"
                onClick={() => set("category", cat.value)}
                className={`rounded-lg border px-2 py-2 text-center text-xs transition-all ${
                  formData.category === cat.value
                    ? "border-blue-500 bg-blue-50 font-semibold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-blue-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                <div>{cat.emoji}</div>
                <div className="mt-0.5">{cat.value}</div>
              </button>
            ))}
          </div>
        </Field>

        <Field label="Deskripsi">
          <textarea value={formData.description} onChange={e => set("description", e.target.value)} rows={2} className={inputCls} placeholder="Keterangan singkat..." />
        </Field>

        <Field label="URL (opsional)">
          <input value={formData.url} onChange={e => set("url", e.target.value)} className={inputCls} placeholder="https://..." />
        </Field>

        <div>
          <label className={labelCls}>Icon / Gambar</label>
          <ImageUploader value={formData.iconUrl} onChange={url => set("iconUrl", url)} path="uses" />
        </div>

        <FormFooter onClose={onClose} loading={loading} saveLabel="Simpan Item" />
      </form>
    </ModalShell>
  );
}
