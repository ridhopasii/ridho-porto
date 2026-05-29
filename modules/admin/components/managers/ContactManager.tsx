"use client";

import { createClient } from "@/common/utils/client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAdminList } from "@/common/hooks/useAdminList";
import AdminSearchBar from "../AdminSearchBar";
import AdminPagination from "../AdminPagination";

const PAGE_SIZE = 10;

export default function ContactManager() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const list = useAdminList({ items: messages, searchFields: ["name", "email", "subject", "message"], pageSize: PAGE_SIZE });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase.from("Message").select("*").order("createdAt", { ascending: false });
    if (fetchError) { console.error("Message fetch error:", fetchError); toast.error("Gagal memuat data"); }
    else if (data) setMessages(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus pesan ini?")) return;
    const toastId = toast.loading("Menghapus...");
    const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Berhasil dihapus!", { id: toastId }); fetchData(); }
    else toast.error("Gagal menghapus", { id: toastId });
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <AdminSearchBar value={list.search} onChange={list.setSearch} placeholder="Cari nama, email, subject..." total={messages.length} filtered={list.filtered.length} />
        <span className="flex-shrink-0 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
          {messages.length} pesan
        </span>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3].map(i=><div key={i} className="h-24 rounded-xl bg-neutral-100 dark:bg-neutral-800"/>)}</div>
      ) : (
        <>
          <div className="space-y-3">
            {list.paginated.map((msg) => (
              <div key={msg.id} className="group flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900 sm:flex-row sm:items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold">{msg.name}</h4>
                    <a href={`mailto:${msg.email}`} className="text-xs text-blue-600 hover:underline dark:text-blue-400">{msg.email}</a>
                  </div>
                  {msg.subject && <p className="mt-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400">Re: {msg.subject}</p>}
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{msg.message}</p>
                  <p className="mt-2 text-xs text-neutral-400">{new Date(msg.createdAt).toLocaleString("id-ID")}</p>
                </div>
                <button onClick={() => handleDelete(msg.id)} className="flex-shrink-0 self-start rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 opacity-0 transition-opacity hover:bg-red-100 group-hover:opacity-100 dark:bg-red-900/20 dark:text-red-400">
                  Hapus
                </button>
              </div>
            ))}
            {list.paginated.length === 0 && (
              <div className="py-12 text-center text-neutral-500">
                {list.search ? `Tidak ada pesan cocok dengan "${list.search}"` : "Belum ada pesan masuk."}
              </div>
            )}
          </div>
          <AdminPagination currentPage={list.page} totalPages={list.totalPages} onPageChange={list.setPage} totalItems={list.filtered.length} pageSize={PAGE_SIZE} />
        </>
      )}
    </div>
  );
}
