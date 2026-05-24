"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { createBrowserClient } from "@supabase/ssr";
import SkillFormModal from "../SkillFormModal";

export default function SkillManager() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingData, setEditingData] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("Skill").select("*").order("name", { ascending: true });
    if (data) setSkills(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    const toastId = toast.loading("Deleting...");
    const res = await fetch(`/api/admin/skills?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted!", { id: toastId });
      fetchData();
    } else {
      toast.error("Failed to delete", { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      {isModalOpen && (
        <SkillFormModal 
          skill={editingData} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchData(); }} 
        />
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-500">Manage your skills and tech stack.</p>
        <button 
          onClick={() => { setEditingData(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Skill
        </button>
      </div>

      {loading ? (
        <p className="text-neutral-500 py-10 text-center">Loading data...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.map((item) => (
            <div key={`skill-${item.id}`} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 rounded-lg flex flex-col shadow-sm relative group items-center text-center">
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-neutral-900 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-700">
                <button onClick={() => { setEditingData(item); setIsModalOpen(true); }} className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded text-xs">
                  ✎
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-xs">
                  🗑
                </button>
              </div>

              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${item.background} ${item.color} bg-opacity-20 dark:bg-opacity-20`}>
                <span className="text-xs font-bold">{item.icon.substring(0,2)}</span>
              </div>
              <h4 className="font-bold text-sm">{item.name}</h4>
              <p className="text-xs text-neutral-500 mt-1 font-mono truncate w-full px-2" title={item.icon}>{item.icon}</p>
              {!item.is_active && (
                <span className="mt-2 text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Hidden</span>
              )}
            </div>
          ))}
          {skills.length === 0 && <p className="text-neutral-500 italic col-span-full">No skills found.</p>}
        </div>
      )}
    </div>
  );
}
