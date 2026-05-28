"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

import ImageUploader from "./ImageUploader";
import MarkdownEditor from "./MarkdownEditor";

interface OrganizationFormModalProps {
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeImages = (images: unknown): string[] => {
  if (!Array.isArray(images)) return [];
  return images.filter(
    (url): url is string => typeof url === "string" && !!url,
  );
};

export default function OrganizationFormModal({
  item,
  onClose,
  onSuccess,
}: OrganizationFormModalProps) {
  const isEditing = !!item;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: item?.name || "",
    role: item?.role || "",
    period: item?.period || "",
    description: item?.description || "",
    website: item?.website || "",
    slug: item?.slug || "",
    order: item?.order ?? 0,
    logoUrl: item?.logoUrl || "",
    proofUrl: item?.proofUrl || "",
    images:
      normalizeImages(item?.images).length > 0
        ? normalizeImages(item?.images)
        : [""],
    showOnHome: item?.showOnHome ?? true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(
      isEditing ? "Updating organization..." : "Creating organization...",
    );

    try {
      const payload = {
        ...formData,
        order: Number(formData.order) || 0,
        slug: formData.slug.trim() || slugify(formData.name),
        images: formData.images.filter(Boolean),
      };

      const res = await fetch("/api/admin/organization", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isEditing ? { id: item.id, ...payload } : payload),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      toast.success(
        isEditing ? "Organization updated!" : "Organization created!",
        { id: toastId },
      );
      onSuccess();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="relative my-8 w-full max-w-3xl rounded-xl bg-white p-6 shadow-xl dark:bg-neutral-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
        >
          ✕
        </button>

        <h2 className="mb-6 text-2xl font-bold">
          {isEditing ? "Edit Organization" : "Add New Organization"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded border border-neutral-300 bg-transparent p-2 dark:border-neutral-700"
                placeholder="e.g. Google Developer Student Clubs"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Role</label>
              <input
                required
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded border border-neutral-300 bg-transparent p-2 dark:border-neutral-700"
                placeholder="e.g. Core Team"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Period</label>
              <input
                required
                name="period"
                value={formData.period}
                onChange={handleChange}
                className="w-full rounded border border-neutral-300 bg-transparent p-2 dark:border-neutral-700"
                placeholder="e.g. 2025 - Now"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                className="w-full rounded border border-neutral-300 bg-transparent p-2 dark:border-neutral-700"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Slug</label>
            <input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full rounded border border-neutral-300 bg-transparent p-2 dark:border-neutral-700"
              placeholder="Auto-generated if left empty"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Website</label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full rounded border border-neutral-300 bg-transparent p-2 dark:border-neutral-700"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <MarkdownEditor
              value={formData.description}
              onChange={(val) => setFormData({...formData, description: val})}
              rows={4}
              placeholder="Detailed description of the organization (Markdown supported)..."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Proof URL
              </label>
              <input
                name="proofUrl"
                value={formData.proofUrl}
                onChange={handleChange}
                className="w-full rounded border border-neutral-300 bg-transparent p-2 dark:border-neutral-700"
                placeholder="https://..."
              />
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                name="showOnHome"
                id="showOnHome"
                checked={formData.showOnHome}
                onChange={handleChange}
                className="h-4 w-4 rounded text-blue-600"
              />
              <label htmlFor="showOnHome" className="text-sm">
                Show on About Page
              </label>
            </div>
          </div>

          <div>
            <ImageUploader
              label="Organization Logo"
              value={formData.logoUrl}
              onChange={(url) => setFormData({ ...formData, logoUrl: url })}
              path="organization"
            />
          </div>

          <div className="space-y-3 rounded-xl border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Organization Images</p>
                <p className="text-xs text-neutral-500">
                  Upload multiple supporting images for this organization.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, ""],
                  }))
                }
                className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                + Add Image
              </button>
            </div>

            <div className="space-y-3">
              {formData.images.map((imageUrl, index) => (
                <div
                  key={`organization-image-${index}`}
                  className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-neutral-500">
                      Image {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => {
                          const nextImages = prev.images.filter(
                            (_, imageIndex) => imageIndex !== index,
                          );

                          return {
                            ...prev,
                            images: nextImages.length > 0 ? nextImages : [""],
                          };
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
                    path="organization"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Organization"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
