import { useState } from "react";
import { toast } from "react-hot-toast";
import ImageUploader from "./ImageUploader";

interface GalleryFormModalProps {
  item?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GalleryFormModal({ item, onClose, onSuccess }: GalleryFormModalProps) {
  const isEditing = !!item;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: item?.title || "",
    category: item?.category || "Photography",
    date: item?.date || "",
    description: item?.description || "",
    showOnHome: item?.showOnHome ?? true,
    // Note: Database stores `images` as jsonb array. We use a single string for MVP here.
    imageUrl: item?.images?.[0] || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    const toastId = toast.loading(isEditing ? "Updating..." : "Creating...");

    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        date: formData.date,
        description: formData.description,
        showOnHome: formData.showOnHome,
        images: formData.imageUrl ? [formData.imageUrl] : [],
      };
      
      const finalPayload = isEditing ? { id: item.id, ...payload } : payload;
      
      const res = await fetch("/api/admin/gallery", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload),
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
      <div className="bg-white dark:bg-neutral-900 w-full max-w-md rounded-xl p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200">✕</button>
        <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Gallery Item" : "Add Gallery Item"}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <input name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input name="date" type="date" value={formData.date} onChange={handleChange} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={2} className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded bg-transparent" />
          </div>
          <div>
            <ImageUploader 
              label="Upload Photo"
              value={formData.imageUrl} 
              onChange={(url) => setFormData({...formData, imageUrl: url})} 
              path="gallery"
            />
          </div>

          <div className="flex gap-6 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="showOnHome" checked={formData.showOnHome} onChange={handleChange} className="w-4 h-4" />
              <span className="text-sm">Show on Home</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t dark:border-neutral-800">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
