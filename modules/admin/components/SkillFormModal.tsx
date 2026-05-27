"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface SkillFormModalProps {
  skill: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SkillFormModal({ skill, onClose, onSuccess }: SkillFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    background: "",
    color: "",
    category: "",
    level: "Expert",
    percentage: 100,
    is_active: true,
  });

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || "",
        icon: skill.icon || "",
        background: skill.background || "",
        color: skill.color || "",
        category: skill.category || "",
        level: skill.level || "Expert",
        percentage: skill.percentage || 100,
        is_active: skill.is_active ?? true,
      });
    }
  }, [skill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Saving...");

    try {
      const payload = {
        ...formData,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        showOnHome: formData.is_active,
      };

      const res = await fetch("/api/admin/skills", {
        method: skill ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(skill ? { id: skill.id, ...payload } : payload),
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
      <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">{skill ? "Edit Skill" : "Add Skill"}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Skill Name</label>
            <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" placeholder="e.g. React.js" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Icon Name (react-icons)</label>
            <input required value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" placeholder="e.g. SiReact" />
            <p className="text-xs text-neutral-500 mt-1">Use exact component name from react-icons/si, fa, bs, etc.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Background Class</label>
              <input value={formData.background} onChange={(e) => setFormData({...formData, background: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" placeholder="e.g. bg-cyan-400" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Text Color Class</label>
              <input value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full border rounded-md px-3 py-2 text-sm dark:bg-neutral-800 dark:border-neutral-700" placeholder="e.g. text-cyan-400" />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} className="rounded text-blue-600" />
            <label htmlFor="is_active" className="text-sm">Is Active / Show on Home</label>
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
