"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { createBrowserClient } from "@supabase/ssr";
import TestimonialFormModal from "../TestimonialFormModal";
import Image from "next/image";

export default function TestimonialManager() {
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
    const { data } = await supabase.from("Testimonial").select("*").order("id", { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    const toastId = toast.loading("Deleting...");
    const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
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
        <TestimonialFormModal 
          item={editingItem} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchData(); }} 
        />
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-500">Manage client and peer testimonials.</p>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Testimonial
        </button>
      </div>

      {loading ? (
        <p className="text-neutral-500 py-10 text-center">Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 rounded-lg flex flex-col gap-4 shadow-sm group">
              <div className="flex items-center gap-4">
                {item.avatarUrl ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-200 shrink-0">
                    <img src={item.avatarUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-neutral-500">{item.name?.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-base">{item.name}</h4>
                  <p className="text-xs text-neutral-500">{item.role}</p>
                </div>
              </div>
              <p className="text-sm italic text-neutral-600 dark:text-neutral-400">"{item.message}"</p>
              
              <div className="flex justify-between items-center mt-2 pt-4 border-t dark:border-neutral-800">
                <div className="text-yellow-500 text-xs">
                  {"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}
                </div>
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="text-xs text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-xs text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-neutral-500 italic col-span-2">No testimonials found.</p>}
        </div>
      )}
    </div>
  );
}
