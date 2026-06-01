"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import ImageUploader from "./ImageUploader";
import { ModalShell, FormFooter, ToggleSwitch, Field, inputCls, labelCls } from "./AdminFormUI";

interface ArticleFormModalProps {
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const ARTICLE_CATEGORIES = ["blog", "tutorial", "tips", "news", "review", "opinion", "project", "other"];

export default function ArticleFormModal({ item, onClose, onSuccess }: ArticleFormModalProps) {
  const isEditing = !!item;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: item?.title || "",
    slug: item?.slug || "",
    category: item?.category || "blog",
    excerpt: item?.excerpt || "",
    content: item?.content || "",
    imageUrl: item?.imageUrl || "",
    tags: item?.tags || "",
    published: item?.published ?? true,
    showOnHome: item?.showOnHome ?? false,
  });

  const set = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleTitleChange = (val: string) => {
    set("title", val);
    if (!isEditing) set("slug", val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(isEditing ? "Memperbarui..." : "Menyimpan...");
    try {
      const payload = isEditing ? { id: item.id, ...formData } : formData;
      const res = await fetch("/api/admin/articles", {
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
    <ModalShell title={isEditing ? "Edit Artikel" : "Tulis Artikel"} maxWidth="max-w-4xl" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title" required>
            <input required value={formData.title} onChange={e => handleTitleChange(e.target.value)} className={inputCls} placeholder="Judul artikel" />
          </Field>
          <Field label="Slug" required hint="Auto-generated dari title">
            <input required value={formData.slug} onChange={e => set("slug", e.target.value)} className={inputCls} />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Kategori">
            <select value={formData.category} onChange={e => set("category", e.target.value)} className={inputCls}>
              {ARTICLE_CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </Field>
          <Field label="Tags" hint="Pisahkan dengan koma">
            <input value={formData.tags} onChange={e => set("tags", e.target.value)} className={inputCls} placeholder="Next.js, React, Tips" />
          </Field>
        </div>

        <Field label="Excerpt / Ringkasan">
          <textarea value={formData.excerpt} onChange={e => set("excerpt", e.target.value)} rows={2} className={inputCls} placeholder="Ringkasan singkat artikel..." />
        </Field>

        <Field label="Konten (Markdown / HTML)" required>
          <textarea required value={formData.content} onChange={e => set("content", e.target.value)} rows={12} className={`${inputCls} font-mono text-xs`} placeholder="Tulis konten di sini..." />
        </Field>

        <div>
          <label className={labelCls}>Gambar Sampul</label>
          <ImageUploader value={formData.imageUrl} onChange={url => set("imageUrl", url)} path="blog" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ToggleSwitch
            checked={formData.published}
            onChange={v => set("published", v)}
            label={formData.published ? "Terbit (Published)" : "Draft"}
            description="Artikel dapat dilihat publik"
          />
          <ToggleSwitch
            checked={formData.showOnHome}
            onChange={v => set("showOnHome", v)}
            label="Tampilkan di Beranda"
            description="Muncul di section artikel"
          />
        </div>

        <FormFooter onClose={onClose} loading={loading} saveLabel="Simpan Artikel" />
      </form>
    </ModalShell>
  );
}
