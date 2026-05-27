"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import ImageUploader from "./ImageUploader";

interface TestimonialFormModalProps {
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function TestimonialFormModal({ item, onClose, onSuccess }: TestimonialFormModalProps) {
  const isEditing = !!item;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: item?.name || "",
    role: item?.role || "",
    message: item?.message || "",
    avatarUrl: item?.avatarUrl || "",
    rating: item?.rating || 5,
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
      const res = await fetch("/api/admin/testimonials", {
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
        <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Testimonial" : "Add Testimonial"}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role / Position</label>
            <input required name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea required name="message" value={formData.message} onChange={handleChange} rows={3} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
            <input type="number" min="1" max="5" required name="rating" value={formData.rating} onChange={handleChange} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent" />
          </div>
          <div>
            <ImageUploader 
              label="Avatar Image"
              value={formData.avatarUrl} 
              onChange={(url) => setFormData({...formData, avatarUrl: url})} 
              path="testimonials"
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
