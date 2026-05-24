"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { createBrowserClient } from "@supabase/ssr";
import PageContentFormModal from "../PageContentFormModal";

interface Props {
  page: string;
}

export default function PageContentManager({ page }: Props) {
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
  }, [page]);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from("PageContent").select("*").eq("page", page).order("locale", { ascending: true }).order("key", { ascending: true });
    if (data) setItems(data);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {isModalOpen && (
        <PageContentFormModal 
          item={editingItem} 
          page={page}
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchData(); }} 
        />
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-500">Manage static text content for {page}.</p>
        <button 
          onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Add Content Key
        </button>
      </div>

      {loading ? (
        <p className="text-neutral-500 py-10 text-center">Loading data...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 p-4 rounded-lg flex justify-between items-start gap-4 shadow-sm group">
              <div className="w-full">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-base bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded text-xs">{item.key}</h4>
                  <span className="text-xs uppercase font-medium bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded">{item.locale}</span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">{item.value}</p>
              </div>
              
              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="text-xs text-blue-600 hover:underline">Edit</button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="text-neutral-500 italic">No content keys found.</p>}
        </div>
      )}
    </div>
  );
}
