"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import ImageUploader from "./ImageUploader";
import MarkdownEditor from "./MarkdownEditor";
import { ModalShell, FormFooter, ToggleSwitch, Field, inputCls, labelCls } from "./AdminFormUI";

interface ExperienceFormModalProps {
  experience: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

const normalizeImages = (images: unknown): string[] => {
  if (!Array.isArray(images)) return [];
  return images.filter((url): url is string => typeof url === "string" && !!url);
};

export default function ExperienceFormModal({ experience, onClose, onSuccess }: ExperienceFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    location: "",
    location_type: "Remote",
    type: "Full-time",
    start_date: "",
    end_date: "",
    industry: "",
    link: "",
    logoUrl: "",
    responsibilities: [""],
    lessons_learned: [""],
    impact: [""],
    description: "",
    images: [""],
    showOnHome: true,
  });

  useEffect(() => {
    if (experience) {
      setFormData({
        company: experience.company || "",
        position: experience.position || "",
        location: experience.location || "",
        location_type: experience.location_type || "Remote",
        type: experience.type || "Full-time",
        start_date: experience.start_date || "",
        end_date: experience.end_date || "",
        industry: experience.industry || "",
        link: experience.link || "",
        logoUrl: experience.logoUrl || "",
        responsibilities: experience.responsibilities?.length ? experience.responsibilities : [""],
        lessons_learned: experience.lessons_learned?.length ? experience.lessons_learned : [""],
        impact: experience.impact?.length ? experience.impact : [""],
        description: experience.description || "",
        images: normalizeImages(experience.images).length > 0 ? normalizeImages(experience.images) : [""],
        showOnHome: experience.showOnHome ?? true,
      });
    }
  }, [experience]);

  const set = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

  const handleArrayChange = (field: keyof typeof formData, index: number, value: string) => {
    const newArr = [...(formData[field] as string[])];
    newArr[index] = value;
    set(field, newArr);
  };

  const addArrayItem = (field: keyof typeof formData) => {
    set(field, [...(formData[field] as string[]), ""]);
  };

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    const newArr = [...(formData[field] as string[])];
    newArr.splice(index, 1);
    set(field, newArr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Menyimpan...");
    try {
      const payload = {
        ...formData,
        responsibilities: formData.responsibilities.filter(x => x.trim()),
        lessons_learned: formData.lessons_learned.filter(x => x.trim()),
        impact: formData.impact.filter(x => x.trim()),
        images: formData.images.filter(Boolean),
        slug: formData.company.toLowerCase().replace(/\s+/g, '-'),
      };
      const res = await fetch("/api/admin/experience", {
        method: experience ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(experience ? { id: experience.id, ...payload } : payload),
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
    <ModalShell title={experience ? "Edit Pengalaman" : "Tambah Pengalaman"} maxWidth="max-w-3xl" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Company" required>
            <input required value={formData.company} onChange={e => set("company", e.target.value)} className={inputCls} placeholder="e.g. Google" />
          </Field>
          <Field label="Position" required>
            <input required value={formData.position} onChange={e => set("position", e.target.value)} className={inputCls} placeholder="e.g. Frontend Developer" />
          </Field>
          <Field label="Location">
            <input value={formData.location} onChange={e => set("location", e.target.value)} className={inputCls} placeholder="e.g. Jakarta, Indonesia" />
          </Field>
          <Field label="Location Type">
            <select value={formData.location_type} onChange={e => set("location_type", e.target.value)} className={inputCls}>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Onsite">Onsite</option>
            </select>
          </Field>
          <Field label="Employment Type">
            <select value={formData.type} onChange={e => set("type", e.target.value)} className={inputCls}>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
            </select>
          </Field>
          <Field label="Industry">
            <input value={formData.industry} onChange={e => set("industry", e.target.value)} className={inputCls} placeholder="e.g. Software Development" />
          </Field>
          <Field label="Start Date" hint="YYYY-MM">
            <input value={formData.start_date} onChange={e => set("start_date", e.target.value)} className={inputCls} placeholder="2023-01" />
          </Field>
          <Field label="End Date" hint="YYYY-MM or Present">
            <input value={formData.end_date} onChange={e => set("end_date", e.target.value)} className={inputCls} placeholder="Present" />
          </Field>
          <Field label="Company Link">
            <input type="url" value={formData.link} onChange={e => set("link", e.target.value)} className={inputCls} placeholder="https://..." />
          </Field>
          <div>
            <label className={labelCls}>Company Logo</label>
            <ImageUploader value={formData.logoUrl} onChange={url => set("logoUrl", url)} path="experience" />
          </div>
        </div>

        <div>
          <label className={labelCls}>Description (Optional)</label>
          <MarkdownEditor value={formData.description} onChange={val => set("description", val)} rows={4} placeholder="Detailed description of the role (Markdown supported)..." />
        </div>

        {/* Dynamic Array Fields */}
        {(['responsibilities', 'lessons_learned', 'impact'] as const).map(field => (
          <div key={field} className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-800/20">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-bold capitalize text-neutral-700 dark:text-neutral-300">
                {field.replace('_', ' ')}
              </label>
              <button type="button" onClick={() => addArrayItem(field)} className="text-xs font-semibold text-blue-600 hover:underline">
                + Add Item
              </button>
            </div>
            <div className="space-y-2">
              {formData[field].map((val, idx) => (
                <div key={idx} className="flex gap-2">
                  <input value={val} onChange={e => handleArrayChange(field, idx, e.target.value)} className={inputCls} placeholder={`Add ${field.replace('_', ' ')}...`} />
                  <button type="button" onClick={() => removeArrayItem(field, idx)} className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                    ✕
                  </button>
                </div>
              ))}
              {formData[field].length === 0 && <p className="text-xs text-neutral-400 italic">No items added yet.</p>}
            </div>
          </div>
        ))}

        <div className="space-y-3 rounded-xl border border-dashed border-neutral-300 p-4 dark:border-neutral-700 mt-4 bg-neutral-50/50 dark:bg-neutral-800/20">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Gallery Images</p>
              <p className="text-xs text-neutral-500">Upload multiple supporting images for this experience.</p>
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
              <div key={`experience-image-${index}`} className="rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
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
                }} path="experience" />
              </div>
            ))}
          </div>
        </div>

        <ToggleSwitch
          checked={formData.showOnHome}
          onChange={v => set("showOnHome", v)}
          label="Tampilkan di Halaman Resume"
          description="Muncul di timeline karir"
        />

        <FormFooter onClose={onClose} loading={loading} saveLabel="Simpan Pengalaman" />
      </form>
    </ModalShell>
  );
}
