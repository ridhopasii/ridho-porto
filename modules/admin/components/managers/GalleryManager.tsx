"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { createBrowserClient } from "@supabase/ssr";
import GalleryFormModal from "../GalleryFormModal";

export default function GalleryManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
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
    try {
      const res = await fetch("/api/admin/gallery");
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
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    const toastId = toast.loading("Deleting...");
    const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
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
        <GalleryFormModal 
          item={editingItem} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchData(); }} 
        />
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-500">Manage your photo gallery.</p>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Photo
        </button>
      </div>

      {loading ? (
        <p className="text-neutral-500 py-10 text-center">Loading data...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item) => {
            const imgUrl = item.images?.[0];
            return (
              <div key={item.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden flex flex-col shadow-sm group">
                <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 relative w-full">
                  {imgUrl ? (
                    <img src={imgUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-3">
                    <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="text-sm text-white hover:underline bg-blue-600/80 px-3 py-1 rounded-full">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-sm text-white hover:underline bg-red-600/80 px-3 py-1 rounded-full">Delete</button>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-sm truncate" title={item.title}>{item.title}</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">{item.category}</p>
                </div>
              </div>
            );
          })}
          {items.length === 0 && <p className="text-neutral-500 italic col-span-4">No gallery items found.</p>}
        </div>
      )}
    </div>
  );
}
