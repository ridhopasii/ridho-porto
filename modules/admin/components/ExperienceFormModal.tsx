"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import ImageUploader from "./ImageUploader";
import MarkdownEditor from "./MarkdownEditor";

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

  const handleArrayChange = (field: keyof typeof formData, index: number, value: string) => {
    const newArr = [...(formData[field] as string[])];
    newArr[index] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addArrayItem = (field: keyof typeof formData) => {
    setFormData({ ...formData, [field]: [...(formData[field] as string[]), ""] });
  };

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    const newArr = [...(formData[field] as string[])];
    newArr.splice(index, 1);
    setFormData({ ...formData, [field]: newArr });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Saving...");

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
        toast.success("Saved successfully!", { id: toastId });
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">{experience ? "Edit Experience" : "Add Experience"}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input required value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Position</label>
              <input required value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location Type</label>
              <select value={formData.location_type} onChange={(e) => setFormData({...formData, location_type: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700">
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Employment Type</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <input value={formData.industry} onChange={(e) => setFormData({...formData, industry: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date (YYYY-MM)</label>
              <input value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date (YYYY-MM or Present)</label>
              <input value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company Link</label>
              <input type="url" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" />
            </div>
            <div className="col-span-2">
              <ImageUploader 
                label="Company Logo"
                value={formData.logoUrl} 
                onChange={(url) => setFormData({...formData, logoUrl: url})} 
                path="experience"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description (Optional)</label>
            <MarkdownEditor
              value={formData.description}
              onChange={(val) => setFormData({...formData, description: val})}
              rows={4}
              placeholder="Detailed description of the role (Markdown supported)..."
            />
          </div>

          {/* Dynamic Array Fields */}
          {(['responsibilities', 'lessons_learned', 'impact'] as const).map((field) => (
            <div key={field} className="border-t pt-3 dark:border-neutral-700">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium capitalize">{field.replace('_', ' ')}</label>
                <button type="button" onClick={() => addArrayItem(field)} className="text-xs text-blue-600 hover:underline">+ Add</button>
              </div>
              {formData[field].map((val, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input value={val} onChange={(e) => handleArrayChange(field, idx, e.target.value)} className="flex-1 border rounded-md px-3 py-1.5 text-sm dark:bg-neutral-800 dark:border-neutral-700" />
                  <button type="button" onClick={() => removeArrayItem(field, idx)} className="text-red-500 hover:text-red-700">✕</button>
                </div>
              ))}
            </div>
          ))}

          <div className="space-y-3 rounded-xl border border-dashed border-neutral-300 p-4 dark:border-neutral-700 mt-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Gallery Images</p>
                <p className="text-xs text-neutral-500">Upload multiple supporting images for this experience.</p>
              </div>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }))}
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                + Add Image
              </button>
            </div>

            <div className="space-y-3">
              {formData.images.map((imageUrl, index) => (
                <div key={`experience-image-${index}`} className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-500">Image {index + 1}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => {
                          const nextImages = prev.images.filter((_, imageIndex) => imageIndex !== index);
                          return { ...prev, images: nextImages.length > 0 ? nextImages : [""] };
                        })
                      }
                      className="text-xs font-medium text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <ImageUploader
                    label={`Upload Image ${index + 1}`}
                    value={imageUrl}
                    onChange={(url) =>
                      setFormData((prev) => {
                        const nextImages = [...prev.images];
                        nextImages[index] = url;
                        return { ...prev, images: nextImages };
                      })
                    }
                    path="experience"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" id="showOnHome" checked={formData.showOnHome} onChange={(e) => setFormData({...formData, showOnHome: e.target.checked})} className="rounded text-blue-600" />
            <label htmlFor="showOnHome" className="text-sm">Show on About Page</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t dark:border-neutral-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg dark:text-neutral-300 dark:hover:bg-neutral-800">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
