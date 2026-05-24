"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

interface PageContentFormModalProps {
  item?: any;
  page: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PageContentFormModal({ item, page, onClose, onSuccess }: PageContentFormModalProps) {
  const isEditing = !!item;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    page: item?.page || page,
    locale: item?.locale || "id",
    key: item?.key || "",
    value: item?.value || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(isEditing ? "Updating..." : "Creating...");

    try {
      const payload = isEditing ? { id: item.id, ...formData } : formData;
      const res = await fetch("/api/admin/page-content", {
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
        <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Content" : "Add New Content Key"}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Locale</label>
              <select required name="locale" value={formData.locale} onChange={handleChange} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent">
                <option value="id">Indonesian (id)</option>
                <option value="en">English (en)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Key Name</label>
              <input required name="key" value={formData.key} onChange={handleChange} placeholder="e.g. intro" disabled={isEditing} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent disabled:opacity-50" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Value (Text Content)</label>
            <textarea required name="value" value={formData.value} onChange={handleChange} rows={6} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent" />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
