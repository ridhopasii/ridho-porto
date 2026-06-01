"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import ImageUploader from "./ImageUploader";
import { ModalShell, FormFooter, ToggleSwitch, Field, inputCls, labelCls } from "./AdminFormUI";

interface ProjectFormModalProps {
  project?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const PROJECT_CATEGORIES = [
  { value: "project",    label: "Project" },
  { value: "freelance",  label: "Freelance" },
  { value: "experiment", label: "Experiment" },
  { value: "open-source",label: "Open Source" },
];

export default function ProjectFormModal({ project, onClose, onSuccess }: ProjectFormModalProps) {
  const isEditing = !!project;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: project?.title || "",
    slug: project?.slug || "",
    category: project?.category || "project",
    description: project?.description || "",
    tags: project?.tags || "",
    demoUrl: project?.demoUrl || "",
    repoUrl: project?.repoUrl || "",
    showOnHome: project?.showOnHome ?? true,
    featured: project?.featured ?? false,
    imageUrl: project?.imageUrl || "",
  });

  const set = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    set("title", val);
    if (!isEditing) set("slug", val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(isEditing ? "Memperbarui proyek..." : "Menyimpan proyek...");
    try {
      const payload = isEditing ? { id: project.id, ...formData } : formData;
      const res = await fetch("/api/admin/projects", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(isEditing ? "Proyek diperbarui!" : "Proyek dibuat!", { id: toastId });
      onSuccess();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell title={isEditing ? "Edit Proyek" : "Tambah Proyek Baru"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title" required>
            <input required value={formData.title} onChange={e => handleTitleChange(e.target.value)} className={inputCls} placeholder="Nama proyek" />
          </Field>
          <Field label="Slug" required hint="Auto-generated dari title">
            <input required value={formData.slug} onChange={e => set("slug", e.target.value)} className={inputCls} placeholder="nama-proyek" />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Kategori">
            <select value={formData.category} onChange={e => set("category", e.target.value)} className={inputCls}>
              {PROJECT_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </Field>
          <Field label="Tags" hint="Pisahkan dengan koma">
            <input value={formData.tags} onChange={e => set("tags", e.target.value)} className={inputCls} placeholder="React, Next.js, Tailwind" />
          </Field>
        </div>

        <Field label="Deskripsi">
          <textarea value={formData.description} onChange={e => set("description", e.target.value)} rows={3} className={inputCls} placeholder="Deskripsi proyek..." />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Demo URL">
            <input value={formData.demoUrl} onChange={e => set("demoUrl", e.target.value)} className={inputCls} placeholder="https://demo.example.com" />
          </Field>
          <Field label="Repository URL">
            <input value={formData.repoUrl} onChange={e => set("repoUrl", e.target.value)} className={inputCls} placeholder="https://github.com/..." />
          </Field>
        </div>

        <div>
          <label className={labelCls}>Gambar Thumbnail</label>
          <ImageUploader value={formData.imageUrl} onChange={url => set("imageUrl", url)} path="projects" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ToggleSwitch
            checked={formData.showOnHome}
            onChange={v => set("showOnHome", v)}
            label="Tampilkan di Beranda"
            description="Muncul di section proyek"
          />
          <ToggleSwitch
            checked={formData.featured}
            onChange={v => set("featured", v)}
            label="Unggulan (Featured)"
            description="Highlight sebagai proyek utama"
          />
        </div>

        <FormFooter onClose={onClose} loading={loading} saveLabel="Simpan Proyek" />
      </form>
    </ModalShell>
  );
}
