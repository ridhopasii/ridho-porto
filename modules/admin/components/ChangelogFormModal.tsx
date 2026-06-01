"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { ModalShell, FormFooter, Field, inputCls } from "./AdminFormUI";

interface ChangelogFormModalProps {
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const CHANGE_TYPES = [
  { emoji: "✨", label: "Feature" },
  { emoji: "🐛", label: "Bug Fix" },
  { emoji: "⚡", label: "Performance" },
  { emoji: "🎨", label: "Design" },
  { emoji: "🔒", label: "Security" },
  { emoji: "📦", label: "Dependency" },
  { emoji: "🗑️", label: "Removed" },
  { emoji: "📝", label: "Docs" },
];

export default function ChangelogFormModal({ item, onClose, onSuccess }: ChangelogFormModalProps) {
  const isEditing = !!item;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    version: item?.version || "",
    date: item?.date || new Date().toISOString().split("T")[0],
    description: item?.description || "",
  });

  const set = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

  const insertEmoji = (emoji: string) => set("description", formData.description + `\n${emoji} `);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(isEditing ? "Memperbarui..." : "Menyimpan...");
    try {
      const payload = isEditing ? { id: item.id, ...formData } : formData;
      const res = await fetch("/api/admin/changelogs", {
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
    <ModalShell title={isEditing ? "Edit Changelog" : "Tambah Changelog Baru"} maxWidth="max-w-lg" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Versi" required hint="Format: v1.0.0">
            <input required value={formData.version} onChange={e => set("version", e.target.value)} className={inputCls} placeholder="v1.2.0" />
          </Field>
          <Field label="Tanggal" required>
            <input required type="date" value={formData.date} onChange={e => set("date", e.target.value)} className={inputCls} />
          </Field>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-neutral-500">Quick insert emoji:</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {CHANGE_TYPES.map(t => (
              <button
                key={t.label}
                type="button"
                onClick={() => insertEmoji(t.emoji)}
                className="rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                title={t.label}
              >
                {t.emoji} {t.label}
              </button>
            ))}
          </div>
          <Field label="Deskripsi (Markdown)" required>
            <textarea
              required
              value={formData.description}
              onChange={e => set("description", e.target.value)}
              rows={6}
              className={`${inputCls} font-mono text-xs`}
              placeholder={"✨ Fitur baru: ...\n🐛 Fix: ...\n⚡ Performa: ..."}
            />
          </Field>
        </div>

        <FormFooter onClose={onClose} loading={loading} saveLabel="Simpan Changelog" />
      </form>
    </ModalShell>
  );
}
