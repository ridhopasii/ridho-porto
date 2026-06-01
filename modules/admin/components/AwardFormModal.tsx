"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import ImageUploader from "./ImageUploader";
import MarkdownEditor from "./MarkdownEditor";
import { ModalShell, FormFooter, ToggleSwitch, Field, inputCls, labelCls } from "./AdminFormUI";

interface AwardFormModalProps {
  award?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const normalizeImages = (images: unknown): string[] => {
  if (!images) return [];
  if (Array.isArray(images)) return images.filter((url): url is string => typeof url === "string" && !!url);
  if (typeof images === "string" && images.trim()) return [images];
  return [];
};

const AWARD_CATEGORIES = [
  { value: "penghargaan", label: "Penghargaan" },
  { value: "sertifikasi", label: "Sertifikasi" },
  { value: "kompetisi",   label: "Kompetisi" },
  { value: "lainnya",     label: "Lainnya" },
];

export default function AwardFormModal({ award, onClose, onSuccess }: AwardFormModalProps) {
  const isEditing = !!award;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: award?.title || "",
    slug: award?.slug || "",
    category: award?.category || "penghargaan",
    description: award?.description || "",
    organizer: award?.organizer || "",
    date: award?.date || "",
    certificateUrl: award?.certificateUrl || "",
    proofUrl: award?.proofUrl || "",
    credentialId: award?.credentialId || "",
    images: normalizeImages(award?.images).length > 0 ? normalizeImages(award?.images) : [""],
    showOnHome: award?.showOnHome ?? true,
  });

  const set = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(isEditing ? "Memperbarui pencapaian..." : "Menyimpan pencapaian...");
    try {
      const payload = isEditing ? { id: award.id, ...formData } : formData;
      payload.images = formData.images.filter(Boolean);
      const res = await fetch("/api/admin/awards", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(isEditing ? "Pencapaian diperbarui!" : "Pencapaian dibuat!", { id: toastId });
      onSuccess();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell title={isEditing ? "Edit Pencapaian" : "Tambah Pencapaian Baru"} maxWidth="max-w-2xl" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title" required>
            <input required value={formData.title} onChange={e => set("title", e.target.value)} className={inputCls} placeholder="Nama penghargaan..." />
          </Field>
          <Field label="Slug" required>
            <input required value={formData.slug} onChange={e => set("slug", e.target.value)} className={inputCls} placeholder="e.g. juara-1-lomba" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <select value={formData.category} onChange={e => set("category", e.target.value)} className={inputCls}>
              {AWARD_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </Field>
          <Field label="Organizer / Issuer">
            <input value={formData.organizer} onChange={e => set("organizer", e.target.value)} className={inputCls} placeholder="Penyelenggara" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Date" hint="e.g. Juni 2023">
            <input value={formData.date} onChange={e => set("date", e.target.value)} className={inputCls} placeholder="Juni 2023" />
          </Field>
          <Field label="Credential ID">
            <input value={formData.credentialId} onChange={e => set("credentialId", e.target.value)} className={inputCls} placeholder="ID Sertifikat" />
          </Field>
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <MarkdownEditor value={formData.description} onChange={val => set("description", val)} rows={4} placeholder="Description (Markdown supported)..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Certificate Image</label>
            <ImageUploader value={formData.certificateUrl} onChange={url => set("certificateUrl", url)} path="awards" />
          </div>
          <Field label="Proof URL">
            <input value={formData.proofUrl} onChange={e => set("proofUrl", e.target.value)} className={inputCls} placeholder="https://..." />
          </Field>
        </div>

        <div className="space-y-3 rounded-xl border border-dashed border-neutral-300 p-4 dark:border-neutral-700 mt-4 bg-neutral-50/50 dark:bg-neutral-800/20">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Gallery Images</p>
              <p className="text-xs text-neutral-500">Upload multiple supporting images for this achievement.</p>
            </div>
            <button
              type="button"
              onClick={() => set("images", [...formData.images, ""])}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
            >
              + Add Image
            </button>
          </div>

          <div className="space-y-3">
            {formData.images.map((imageUrl, index) => (
              <div key={`award-image-${index}`} className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-neutral-500">Image {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextImages = formData.images.filter((_, i) => i !== index);
                      set("images", nextImages.length > 0 ? nextImages : [""]);
                    }}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
                <ImageUploader value={imageUrl} onChange={url => {
                  const nextImages = [...formData.images];
                  nextImages[index] = url;
                  set("images", nextImages);
                }} path="awards" />
              </div>
            ))}
          </div>
        </div>

        <ToggleSwitch
          checked={formData.showOnHome}
          onChange={v => set("showOnHome", v)}
          label="Tampilkan di Beranda"
          description="Muncul di section achievements"
        />

        <FormFooter onClose={onClose} loading={loading} saveLabel="Simpan Pencapaian" />
      </form>
    </ModalShell>
  );
}
