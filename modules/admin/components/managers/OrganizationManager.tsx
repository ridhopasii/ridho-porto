"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { toast } from "react-hot-toast";

import OrganizationFormModal from "../OrganizationFormModal";

export default function OrganizationManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("Organization")
      .select("*")
      .order("order", { ascending: true });

    if (data) setItems(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this organization?"))
      return;

    const toastId = toast.loading("Deleting...");
    const res = await fetch(`/api/admin/organization?id=${id}`, {
      method: "DELETE",
    });

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
        <OrganizationFormModal
          item={editingItem}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchData();
          }}
        />
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          Manage your organization and community involvement.
        </p>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsModalOpen(true);
          }}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          + Add Organization
        </button>
      </div>

      {loading ? (
        <p className="py-10 text-center text-neutral-500">Loading data...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative flex gap-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => {
                    setEditingItem(item);
                    setIsModalOpen(true);
                  }}
                  className="rounded-md px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                >
                  Delete
                </button>
              </div>

              <div className="flex-shrink-0">
                {item.logoUrl ? (
                  <img
                    src={item.logoUrl}
                    alt={item.name}
                    className="h-14 w-14 rounded-xl border border-neutral-200 object-contain p-1 dark:border-neutral-700"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-dashed border-neutral-300 text-xl text-neutral-400 dark:border-neutral-700">
                    🏢
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 pr-20">
                <h4 className="truncate text-lg font-bold">{item.name}</h4>
                <p className="text-sm font-medium text-primary">{item.role}</p>
                <p className="mt-1 text-xs text-neutral-500">{item.period}</p>
                {item.website ? (
                  <a
                    href={item.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block break-all text-xs text-blue-600 hover:underline"
                  >
                    {item.website}
                  </a>
                ) : null}
                {item.description ? (
                  <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                    {item.description}
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-neutral-500">
                  <span className="rounded-full bg-neutral-100 px-2 py-1 dark:bg-neutral-800">
                    Order: {item.order}
                  </span>
                  <span className="rounded-full bg-neutral-100 px-2 py-1 dark:bg-neutral-800">
                    {item.showOnHome ? "Shown on About" : "Hidden"}
                  </span>
                  <span className="rounded-full bg-neutral-100 px-2 py-1 dark:bg-neutral-800">
                    Images:{" "}
                    {Array.isArray(item.images) ? item.images.length : 0}
                  </span>
                  {item.slug ? (
                    <span className="rounded-full bg-neutral-100 px-2 py-1 font-mono dark:bg-neutral-800">
                      {item.slug}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 ? (
            <p className="italic text-neutral-500">No organizations found.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
