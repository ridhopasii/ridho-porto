"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { createBrowserClient } from "@supabase/ssr";
import UsesFormModal from "../UsesFormModal";

export default function UsesManager() {
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
      const res = await fetch("/api/admin/uses");
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
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    const toastId = toast.loading("Deleting...");
    const res = await fetch(`/api/admin/uses?id=${id}`, { method: "DELETE" });
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
        <UsesFormModal 
          item={editingItem} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchData(); }} 
        />
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-500">Manage the tools and hardware you use.</p>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Item
        </button>
      </div>

      {loading ? (
        <p className="text-neutral-500 py-10 text-center">Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 rounded-lg flex justify-between items-start gap-4 shadow-sm group">
              <div>
                <h4 className="font-bold text-base">{item.name}</h4>
                <p className="text-xs text-blue-600 font-medium mb-1">{item.category}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
              </div>
              
              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="text-xs text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(item.id)} className="text-xs text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-neutral-500 italic">No items found.</p>}
        </div>
      )}
    </div>
  );
}
