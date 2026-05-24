"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { createBrowserClient } from "@supabase/ssr";
import SocialFormModal from "../SocialFormModal";

export default function SocialManager() {
  const [socials, setSocials] = useState<any[]>([]);
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
    const { data } = await supabase.from("Social").select("*").order("id", { ascending: true });
    if (data) setSocials(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this social link?")) return;
    const toastId = toast.loading("Deleting...");
    const res = await fetch(`/api/admin/social?id=${id}`, { method: "DELETE" });
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
        <SocialFormModal 
          social={editingData} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchData(); }} 
        />
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-500">Manage your social media and contact links.</p>
        <button 
          onClick={() => { setEditingData(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Social
        </button>
      </div>

      {loading ? (
        <p className="text-neutral-500 py-10 text-center">Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socials.map((item) => (
            <div key={`social-${item.id}`} className={`border border-neutral-200 dark:border-neutral-700 p-5 rounded-lg flex flex-col gap-2 shadow-sm relative group ${item.background_color} ${item.text_color} bg-opacity-10 dark:bg-opacity-20`}>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-neutral-900 rounded-md shadow-sm border border-neutral-200 dark:border-neutral-700">
                <button onClick={() => { setEditingData(item); setIsModalOpen(true); }} className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded text-xs">
                  ✎ Edit
                </button>
                <button onClick={() => handleDelete(item.id)} className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded text-xs">
                  🗑 Delete
                </button>
              </div>

              <h4 className="font-bold text-lg">{item.title}</h4>
              <p className="text-sm opacity-80">{item.description}</p>
              <p className="text-xs font-mono mt-2 truncate max-w-[200px]" title={item.url}>{item.url}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs px-2 py-0.5 bg-black/10 rounded-full font-mono">{item.icon}</span>
                {!item.is_show && (
                  <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Hidden</span>
                )}
              </div>
            </div>
          ))}
          {socials.length === 0 && <p className="text-neutral-500 italic col-span-full">No social media links found.</p>}
        </div>
      )}
    </div>
  );
}
