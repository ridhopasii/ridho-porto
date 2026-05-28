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
    (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"),
  );

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/page-content?page=${page}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {isModalOpen && (
        <PageContentFormModal
          item={editingItem}
          page={page}
          existingKeys={items.map((item) => `${item.locale}:${item.key}`)}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchData();
          }}
        />
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          Manage static text content for {page}.
        </p>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          + Add Content Key
        </button>
      </div>

      {loading ? (
        <p className="py-10 text-center text-neutral-500">Loading data...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex items-start justify-between gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="w-full">
                <div className="mb-2 flex items-center gap-3">
                  <h4 className="rounded bg-blue-100 px-2 py-0.5 text-base text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {item.key}
                  </h4>
                  <span className="rounded bg-neutral-200 px-2 py-0.5 text-xs font-medium uppercase dark:bg-neutral-800">
                    {item.locale}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-neutral-600 dark:text-neutral-400">
                  {item.value}
                </p>
              </div>

              <div className="flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setIsModalOpen(true);
                  }}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="italic text-neutral-500">No content keys found.</p>
          )}
        </div>
      )}
    </div>
  );
}
