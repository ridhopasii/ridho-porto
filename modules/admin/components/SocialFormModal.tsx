import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface SocialFormModalProps {
  social: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SocialFormModal({ social, onClose, onSuccess }: SocialFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    name: "",
    url: "",
    icon: "",
    text_color: "",
    background_color: "",
    border_color: "",
    background_gradient_color: "",
    col_span: "md:col-span-1",
    is_show: true,
  });

  useEffect(() => {
    if (social) {
      setFormData({
        title: social.title || "",
        description: social.description || "",
        name: social.name || "",
        url: social.url || "",
        icon: social.icon || "",
        text_color: social.text_color || "",
        background_color: social.background_color || "",
        border_color: social.border_color || "",
        background_gradient_color: social.background_gradient_color || "",
        col_span: social.col_span || "md:col-span-1",
        is_show: social.is_show ?? true,
      });
    }
  }, [social]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Saving...");

    try {
      const payload = {
        ...formData,
        platform: formData.name, // Ensure platform maps to name for compatibility
      };

      const res = await fetch("/api/admin/social", {
        method: social ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(social ? { id: social.id, ...payload } : payload),
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
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">{social ? "Edit Social Media" : "Add Social Media"}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" placeholder="e.g. Stay in Touch" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Platform ID (name)</label>
              <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" placeholder="e.g. gmail, github" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <input required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" placeholder="Short description..." />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Target URL</label>
              <input required type="url" value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">React Icon Name</label>
              <input required value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" placeholder="e.g. SiGmail" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Col Span (Tailwind)</label>
              <input value={formData.col_span} onChange={(e) => setFormData({...formData, col_span: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" placeholder="e.g. md:col-span-2" />
            </div>
          </div>

          <div className="border-t pt-4 mt-4 dark:border-neutral-700">
            <h4 className="text-sm font-bold mb-2">Styling Classes (Tailwind)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1">Text Color</label>
                <input value={formData.text_color} onChange={(e) => setFormData({...formData, text_color: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" placeholder="text-red-300" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Background Color</label>
                <input value={formData.background_color} onChange={(e) => setFormData({...formData, background_color: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" placeholder="bg-red-300" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Border Color</label>
                <input value={formData.border_color} onChange={(e) => setFormData({...formData, border_color: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" placeholder="border-red-300" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Background Gradient</label>
                <input value={formData.background_gradient_color} onChange={(e) => setFormData({...formData, background_gradient_color: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" placeholder="bg-gradient-to-b ..." />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 border-t pt-4 dark:border-neutral-700">
            <input type="checkbox" id="is_show" checked={formData.is_show} onChange={(e) => setFormData({...formData, is_show: e.target.checked})} className="rounded text-blue-600" />
            <label htmlFor="is_show" className="text-sm">Is Active / Show on Contact Page</label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t dark:border-neutral-800 mt-4">
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
