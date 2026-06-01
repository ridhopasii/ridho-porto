"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import ImageUploader from "./ImageUploader";
import MarkdownEditor from "./MarkdownEditor";
import { ModalShell, FormFooter, ToggleSwitch, Field, inputCls, labelCls } from "./AdminFormUI";

interface EducationFormModalProps {
  education: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

const normalizeImages = (images: unknown): string[] => {
  if (!Array.isArray(images)) return [];
  return images.filter((url): url is string => typeof url === "string" && !!url);
};

export default function EducationFormModal({ education, onClose, onSuccess }: EducationFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    institution: "",
    major: "",
    degree: "",
    location: "",
    gpa: "",
    start_year: new Date().getFullYear() - 4,
    end_year: new Date().getFullYear(),
    link: "",
    logoUrl: "",
    description: "",
    images: [""],
    showOnHome: true,
  });

  useEffect(() => {
    if (education) {
      setFormData({
        institution: education.institution || "",
        major: education.major || "",
        degree: education.degree || "",
        location: education.location || "",
        gpa: education.gpa || "",
        start_year: education.start_year || new Date().getFullYear() - 4,
        end_year: education.end_year || new Date().getFullYear(),
        link: education.link || "",
        logoUrl: education.logoUrl || "",
        description: education.description || "",
        images: normalizeImages(education.images).length > 0 ? normalizeImages(education.images) : [""],
        showOnHome: education.showOnHome ?? true,
      });
    }
  }, [education]);

  const set = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Menyimpan...");
    try {
      const payload = {
        ...formData,
        images: formData.images.filter(Boolean),
        slug: formData.institution.toLowerCase().replace(/\s+/g, '-'),
      };
      const res = await fetch("/api/admin/education", {
        method: education ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(education ? { id: education.id, ...payload } : payload),
      });
      if (res.ok) {
        toast.success("Berhasil disimpan!", { id: toastId });
        onSuccess();
      } else {
        const err = await res.json();
        toast.error(`Error: ${err.error}`, { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to save", { id: toastId });
    }
    setLoading(false);
  };

  return (
    <ModalShell title={education ? "Edit Pendidikan" : "Tambah Pendidikan"} maxWidth="max-w-2xl" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Institution" required>
            <input required value={formData.institution} onChange={e => set("institution", e.target.value)} className={inputCls} placeholder="e.g. Universitas Jambi" />
          </Field>
          <Field label="Major" required>
            <input required value={formData.major} onChange={e => set("major", e.target.value)} className={inputCls} placeholder="e.g. Information Systems" />
          </Field>
          <Field label="Degree" required>
            <input required value={formData.degree} onChange={e => set("degree", e.target.value)} className={inputCls} placeholder="e.g. Bachelor's degree" />
          </Field>
          <Field label="Location">
            <input value={formData.location} onChange={e => set("location", e.target.value)} className={inputCls} placeholder="e.g. Jambi, Indonesia" />
          </Field>
          <Field label="Start Year" required>
            <input type="number" required value={formData.start_year} onChange={e => set("start_year", Number(e.target.value))} className={inputCls} />
          </Field>
          <Field label="End Year" required>
            <input type="number" required value={formData.end_year} onChange={e => set("end_year", Number(e.target.value))} className={inputCls} />
          </Field>
          <Field label="GPA">
            <input value={formData.gpa} onChange={e => set("gpa", e.target.value)} className={inputCls} placeholder="e.g. 3.80/4.00" />
          </Field>
          <Field label="Website Link">
            <input type="url" value={formData.link} onChange={e => set("link", e.target.value)} className={inputCls} placeholder="https://..." />
          </Field>
        </div>

        <div>
          <label className={labelCls}>Institution Logo</label>
          <ImageUploader value={formData.logoUrl} onChange={url => set("logoUrl", url)} path="education" />
        </div>

        <div>
          <label className={labelCls}>Description (Optional)</label>
          <MarkdownEditor value={formData.description} onChange={val => set("description", val)} rows={4} placeholder="Detailed description of the education (Markdown supported)..." />
        </div>

        <div className="space-y-3 rounded-xl border border-dashed border-neutral-300 p-4 dark:border-neutral-700 mt-4 bg-neutral-50/50 dark:bg-neutral-800/20">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Gallery Images</p>
              <p className="text-xs text-neutral-500">Upload multiple supporting images for this education.</p>
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
              <div key={`education-image-${index}`} className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
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
                }} path="education" />
              </div>
            ))}
          </div>
        </div>

        <ToggleSwitch
          checked={formData.showOnHome}
          onChange={v => set("showOnHome", v)}
          label="Tampilkan di Halaman Resume"
          description="Muncul di timeline pendidikan"
        />

        <FormFooter onClose={onClose} loading={loading} saveLabel="Simpan Pendidikan" />
      </form>
    </ModalShell>
  );
}
