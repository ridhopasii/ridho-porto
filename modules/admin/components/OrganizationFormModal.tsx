"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import ImageUploader from "./ImageUploader";
import MarkdownEditor from "./MarkdownEditor";
import { ModalShell, FormFooter, ToggleSwitch, Field, inputCls, labelCls } from "./AdminFormUI";

interface OrganizationFormModalProps {
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const normalizeImages = (images: unknown): string[] => {
  if (!Array.isArray(images)) return [];
  return images.filter((url): url is string => typeof url === "string" && !!url);
};

export default function OrganizationFormModal({ item, onClose, onSuccess }: OrganizationFormModalProps) {
  const isEditing = !!item;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: item?.name || "",
    role: item?.role || "",
    period: item?.period || "",
    description: item?.description || "",
    website: item?.website || "",
    slug: item?.slug || "",
    order: item?.order ?? 0,
    logoUrl: item?.logoUrl || "",
    proofUrl: item?.proofUrl || "",
    images: normalizeImages(item?.images).length > 0 ? normalizeImages(item?.images) : [""],
    showOnHome: item?.showOnHome ?? true,
  });

  const set = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(isEditing ? "Memperbarui organisasi..." : "Menyimpan organisasi...");
    try {
      const payload = {
        ...formData,
        order: Number(formData.order) || 0,
        slug: formData.slug.trim() || slugify(formData.name),
        images: formData.images.filter(Boolean),
      };
      const res = await fetch("/api/admin/organization", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEditing ? { id: item.id, ...payload } : payload),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(isEditing ? "Organisasi diperbarui!" : "Organisasi dibuat!", { id: toastId });
      onSuccess();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell title={isEditing ? "Edit Organisasi" : "Tambah Organisasi Baru"} maxWidth="max-w-3xl" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name" required>
            <input required value={formData.name} onChange={e => set("name", e.target.value)} className={inputCls} placeholder="e.g. Google Developer Student Clubs" />
          </Field>
          <Field label="Role" required>
            <input required value={formData.role} onChange={e => set("role", e.target.value)} className={inputCls} placeholder="e.g. Core Team" />
          </Field>
          <Field label="Period" required>
            <input required value={formData.period} onChange={e => set("period", e.target.value)} className={inputCls} placeholder="e.g. 2025 - Now" />
          </Field>
          <Field label="Order">
            <input type="number" value={formData.order} onChange={e => set("order", e.target.value)} className={inputCls} placeholder="0" />
          </Field>
          <Field label="Slug">
            <input value={formData.slug} onChange={e => set("slug", e.target.value)} className={inputCls} placeholder="Auto-generated if left empty" />
          </Field>
          <Field label="Website">
            <input type="url" value={formData.website} onChange={e => set("website", e.target.value)} className={inputCls} placeholder="https://..." />
          </Field>
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <MarkdownEditor value={formData.description} onChange={val => set("description", val)} rows={4} placeholder="Detailed description of the organization (Markdown supported)..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Organization Logo</label>
            <ImageUploader value={formData.logoUrl} onChange={url => set("logoUrl", url)} path="organization" />
          </div>
          <Field label="Proof URL">
            <input value={formData.proofUrl} onChange={e => set("proofUrl", e.target.value)} className={inputCls} placeholder="https://..." />
          </Field>
        </div>

        <div className="space-y-3 rounded-xl border border-dashed border-neutral-300 p-4 dark:border-neutral-700 mt-4 bg-neutral-50/50 dark:bg-neutral-800/20">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Organization Images</p>
              <p className="text-xs text-neutral-500">Upload multiple supporting images for this organization.</p>
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
              <div key={`organization-image-${index}`} className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
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
                }} path="organization" />
              </div>
            ))}
          </div>
        </div>

        <ToggleSwitch
          checked={formData.showOnHome}
          onChange={v => set("showOnHome", v)}
          label="Tampilkan di Halaman Resume"
          description="Muncul di section organisasi"
        />

        <FormFooter onClose={onClose} loading={loading} saveLabel="Simpan Organisasi" />
      </form>
    </ModalShell>
  );
}
