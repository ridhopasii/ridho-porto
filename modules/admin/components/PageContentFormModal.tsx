"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

interface PageContentFormModalProps {
  item?: any;
  page: string;
  existingKeys?: string[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function PageContentFormModal({
  item,
  page,
  existingKeys = [],
  onClose,
  onSuccess,
}: PageContentFormModalProps) {
  const isEditing = !!item;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    page: item?.page || page,
    locale: item?.locale || "id",
    key: item?.key || "",
    value: item?.value || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(isEditing ? "Updating..." : "Creating...");

    try {
      const dedupeKey = `${formData.locale}:${formData.key}`;
      if (!isEditing && existingKeys.includes(dedupeKey)) {
        throw new Error(
          "This locale and key already exist. Edit the existing item instead.",
        );
      }

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
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
        >
          ✕
        </button>
        <h2 className="mb-4 text-xl font-bold">
          {isEditing ? "Edit Content" : "Add New Content Key"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Locale</label>
              <select
                required
                name="locale"
                value={formData.locale}
                onChange={handleChange}
                className="w-full rounded border border-neutral-300 bg-transparent p-2 dark:border-neutral-700"
              >
                <option value="id">Indonesian (id)</option>
                <option value="en">English (en)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Key Name</label>
              <input
                required
                name="key"
                value={formData.key}
                onChange={handleChange}
                placeholder="e.g. intro"
                disabled={isEditing}
                className="w-full rounded border border-neutral-300 bg-transparent p-2 disabled:opacity-50 dark:border-neutral-700"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Value (Text Content)
            </label>
            <textarea
              required
              name="value"
              value={formData.value}
              onChange={handleChange}
              rows={6}
              className="w-full rounded border border-neutral-300 bg-transparent p-2 dark:border-neutral-700"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-300 px-4 py-2 hover:bg-neutral-100 dark:border-neutral-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
