"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { createBrowserClient } from "@supabase/ssr";
import ExperienceFormModal from "../ExperienceFormModal";

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingData, setEditingData] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const supabase = createBrowserClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder")
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("Experience").select("*").order("start_date", { ascending: false });
    if (data) setExperiences(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    const toastId = toast.loading("Deleting...");
    const res = await fetch(`/api/admin/experience?id=${id}`, { method: "DELETE" });
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
        <ExperienceFormModal 
          experience={editingData} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchData(); }} 
        />
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-500">Manage your work experience and career.</p>
        <button 
          onClick={() => { setEditingData(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Experience
        </button>
      </div>

      {loading ? (
        <p className="text-neutral-500 py-10 text-center">Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {experiences.map((item) => (
            <div key={`exp-${item.id}`} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-5 rounded-lg flex flex-col gap-4 shadow-sm relative group">
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-neutral-900 p-1 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-700">
                <button onClick={() => { setEditingData(item); setIsModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded">
                  ✎ Edit
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded">
                  🗑 Delete
                </button>
              </div>

              <div className="flex gap-4 items-start pr-20">
                {item.logoUrl && (
                  <img src={item.logoUrl} alt={item.company} className="w-12 h-12 rounded-full object-cover" />
                )}
                <div>
                  <h4 className="font-bold text-lg">{item.position}</h4>
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{item.company}</p>
                  <p className="text-xs text-neutral-500 mt-1">{item.type} • {item.location} ({item.location_type})</p>
                  <p className="text-xs text-neutral-400 mt-1">{item.start_date} - {item.end_date}</p>
                </div>
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 border-t pt-2 dark:border-neutral-800">
                <strong>Responsibilities:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {item.responsibilities?.map((r: string, i: number) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            </div>
          ))}
          {experiences.length === 0 && <p className="text-neutral-500 italic">No experience data found.</p>}
        </div>
      )}
    </div>
  );
}
