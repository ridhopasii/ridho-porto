import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import ImageUploader from "./ImageUploader";

interface EducationFormModalProps {
  education: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EducationFormModal({ education, onClose, onSuccess }: EducationFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    institution: "",
    major: "",
    degree: "",
    location: "",
    gpa: "",
    start_year: new Date().getFullYear() - 4,
    end_year: new Date().getFullYear(),
    link: "",
    logoUrl: "",
    showOnHome: true,
  });

  useEffect(() => {
    if (education) {
      setFormData({
        institution: education.institution || "",
        major: education.major || "",
        degree: education.degree || "",
        location: education.location || "",
        gpa: education.gpa || "",
        start_year: education.start_year || new Date().getFullYear() - 4,
        end_year: education.end_year || new Date().getFullYear(),
        link: education.link || "",
        logoUrl: education.logoUrl || "",
        showOnHome: education.showOnHome ?? true,
      });
    }
  }, [education]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Saving...");

    try {
      const payload = {
        ...formData,
        slug: formData.institution.toLowerCase().replace(/\s+/g, '-'),
      };

      const res = await fetch("/api/admin/education", {
        method: education ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(education ? { id: education.id, ...payload } : payload),
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
        <h3 className="text-xl font-bold mb-4">{education ? "Edit Education" : "Add Education"}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Institution</label>
              <input required value={formData.institution} onChange={(e) => setFormData({...formData, institution: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" placeholder="e.g. Universitas Jambi" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Major</label>
              <input required value={formData.major} onChange={(e) => setFormData({...formData, major: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" placeholder="e.g. Information Systems" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Degree</label>
              <input required value={formData.degree} onChange={(e) => setFormData({...formData, degree: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" placeholder="e.g. Bachelor's degree" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" placeholder="e.g. Jambi, Indonesia" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Year</label>
              <input type="number" required value={formData.start_year} onChange={(e) => setFormData({...formData, start_year: Number(e.target.value)})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Year</label>
              <input type="number" required value={formData.end_year} onChange={(e) => setFormData({...formData, end_year: Number(e.target.value)})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">GPA</label>
              <input value={formData.gpa} onChange={(e) => setFormData({...formData, gpa: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" placeholder="e.g. 3.80/4.00" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Website Link</label>
              <input type="url" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" placeholder="https://..." />
            </div>
          </div>

          <div>
            <ImageUploader 
              label="Institution Logo"
              value={formData.logoUrl} 
              onChange={(url) => setFormData({...formData, logoUrl: url})} 
              path="education"
            />
          </div>

          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" id="showOnHome" checked={formData.showOnHome} onChange={(e) => setFormData({...formData, showOnHome: e.target.checked})} className="rounded text-blue-600" />
            <label htmlFor="showOnHome" className="text-sm">Show on About Page</label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
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
