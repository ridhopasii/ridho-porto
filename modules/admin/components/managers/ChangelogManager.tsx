"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { createBrowserClient } from "@supabase/ssr";
import ChangelogFormModal from "../ChangelogFormModal";

export default function ChangelogManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
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
    try {
      const res = await fetch("/api/admin/changelogs");
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this changelog entry?")) return;
    const toastId = toast.loading("Deleting...");
    const res = await fetch(`/api/admin/changelogs?id=${id}`, { method: "DELETE" });
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
        <ChangelogFormModal 
          item={editingItem} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchData(); }} 
        />
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-500">Manage your website changelogs.</p>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Changelog
        </button>
      </div>

      {loading ? (
        <p className="text-neutral-500 py-10 text-center">Loading data...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 rounded-lg flex justify-between items-start gap-4 shadow-sm group">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-base bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded text-xs">{item.version}</h4>
                  <span className="text-sm text-neutral-500">{item.date}</span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">{item.description}</p>
              </div>
              
              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="text-xs text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-xs text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-neutral-500 italic">No changelogs found.</p>}
        </div>
      )}
    </div>
  );
}
