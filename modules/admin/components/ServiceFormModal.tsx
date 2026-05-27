"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import ImageUploader from "./ImageUploader";

interface ServiceFormModalProps {
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ServiceFormModal({ item, onClose, onSuccess }: ServiceFormModalProps) {
  const isEditing = !!item;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: item?.title || "",
    description: item?.description || "",
    icon: item?.icon || "",
    order: item?.order || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(isEditing ? "Updating..." : "Creating...");

    try {
      const payload = isEditing ? { id: item.id, ...formData } : formData;
      const res = await fetch("/api/admin/services", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());

      toast.success(isEditing ? "Updated!" : "Created!", { id: toastId });
      onSuccess();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-xl p-6 shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200">✕</button>
        <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Service" : "Add Service"}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order (Position)</label>
            <input type="number" name="order" value={formData.order} onChange={handleChange} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Icon Name / URL</label>
            <input name="icon" value={formData.icon} onChange={handleChange} placeholder="e.g. SiReact or https://..." className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent" />
            <p className="text-xs text-neutral-500 mt-1">Can be a React Icon string or an image URL. Or upload below:</p>
          </div>
          <div>
            <ImageUploader 
              label="Upload Icon Image (Overrides URL)"
              value={formData.icon?.startsWith("http") || formData.icon?.startsWith("/") ? formData.icon : ""} 
              onChange={(url) => setFormData({...formData, icon: url})} 
              path="services"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
