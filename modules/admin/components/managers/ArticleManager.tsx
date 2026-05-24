"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { createBrowserClient } from "@supabase/ssr";
import ArticleFormModal from "../ArticleFormModal";
import Image from "next/image";

export default function ArticleManager() {
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
    const { data } = await supabase.from("Article").select("*").order("createdAt", { ascending: false });
    if (data) setItems(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    const toastId = toast.loading("Deleting...");
    const res = await fetch(`/api/admin/articles?id=${id}`, { method: "DELETE" });
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
        <ArticleFormModal 
          item={editingItem} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchData(); }} 
        />
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-500">Manage your blog articles and posts.</p>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Write Article
        </button>
      </div>

      {loading ? (
        <p className="text-neutral-500 py-10 text-center">Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 rounded-lg flex gap-4 shadow-sm group">
              {item.imageUrl && (
                <div className="w-32 h-24 shrink-0 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-lg">{item.title}</h4>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="text-xs text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-xs text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.published ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-700'}`}>
                    {item.published ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  {item.category && (
                    <span className="text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 rounded">
                      {item.category}
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-2">
                  {item.excerpt || item.content?.substring(0, 150) + "..."}
                </p>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-neutral-500 italic">No articles found.</p>}
        </div>
      )}
    </div>
  );
}
