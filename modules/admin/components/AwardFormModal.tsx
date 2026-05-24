"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import ImageUploader from "./ImageUploader";

interface AwardFormModalProps {
  award?: any;
  onClose: () => void;
  onSuccess: () => void;
}

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
    showOnHome: award?.showOnHome ?? true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(isEditing ? "Updating achievement..." : "Creating achievement...");

    try {
      const payload = isEditing ? { id: award.id, ...formData } : formData;
      const res = await fetch("/api/admin/awards", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      toast.success(isEditing ? "Achievement updated!" : "Achievement created!", { id: toastId });
      onSuccess();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-xl p-6 shadow-xl relative my-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200">
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-6">{isEditing ? "Edit Achievement" : "Add New Achievement"}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent">
                <option value="penghargaan">Penghargaan</option>
                <option value="sertifikasi">Sertifikasi</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Organizer / Issuer</label>
              <input name="organizer" value={formData.organizer} onChange={handleChange} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input name="date" value={formData.date} onChange={handleChange} placeholder="Juni 2023" className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Credential ID</label>
              <input name="credentialId" value={formData.credentialId} onChange={handleChange} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <ImageUploader 
                label="Certificate Image"
                value={formData.certificateUrl} 
                onChange={(url) => setFormData({...formData, certificateUrl: url})} 
                path="awards"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Proof URL</label>
              <input name="proofUrl" value={formData.proofUrl} onChange={handleChange} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent" />
            </div>
          </div>

          <div className="flex gap-6 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="showOnHome" checked={formData.showOnHome} onChange={handleChange} className="w-4 h-4" />
              <span className="text-sm">Show on Home</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? "Saving..." : "Save Achievement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
