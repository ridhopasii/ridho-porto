"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import LinkFormModal from "../LinkFormModal";
import { useAdminList } from "@/common/hooks/useAdminList";
import AdminSearchBar from "../AdminSearchBar";
import AdminPagination from "../AdminPagination";
import AdminBulkBar from "../AdminBulkBar";

const PAGE_SIZE = 12;

export default function LinkManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const list = useAdminList({ items, searchFields: ["title", "url", "type"], pageSize: PAGE_SIZE });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/links");
      if (res.ok) setItems(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus tautan ini?")) return;
    const toastId = toast.loading("Menghapus...");
    const res = await fetch(`/api/admin/links?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Berhasil dihapus!", { id: toastId }); fetchData(); }
    else toast.error("Gagal menghapus", { id: toastId });
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Yakin ingin menghapus ${list.selected.size} tautan?`)) return;
    setBulkDeleting(true);
    await Promise.all(Array.from(list.selected).map((id) => fetch(`/api/admin/links?id=${id}`, { method: "DELETE" })));
    toast.success(`${list.selected.size} tautan berhasil dihapus`);
    list.clearSelected();
    fetchData();
    setBulkDeleting(false);
  };

  return (
    <div className="space-y-4 p-6">
      {isModalOpen && <LinkFormModal item={editingItem} onClose={() => setIsModalOpen(false)} onSuccess={() => { setIsModalOpen(false); fetchData(); }} />}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <AdminSearchBar value={list.search} onChange={list.setSearch} placeholder="Cari judul, URL, tipe..." total={items.length} filtered={list.filtered.length} />
        <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="flex-shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          + Tambah Tautan
        </button>
      </div>

      <AdminBulkBar selectedCount={list.selected.size} onDelete={handleBulkDelete} onClear={list.clearSelected} isDeleting={bulkDeleting} />

      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 rounded-xl bg-neutral-100 dark:bg-neutral-800"/>)}</div>
      ) : (
        <>
          {list.paginated.length > 0 && (
            <label className="flex cursor-pointer items-center gap-2 text-xs text-neutral-500">
              <input type="checkbox" checked={list.allSelected} ref={(el) => { if (el) el.indeterminate = list.partialSelected; }} onChange={list.toggleAll} className="h-4 w-4 rounded accent-blue-600" />
              Pilih semua ({list.paginated.length})
            </label>
          )}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {list.paginated.map((item) => (
              <div key={item.id} className="group flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <input type="checkbox" checked={list.selected.has(item.id)} onChange={() => list.toggleSelect(item.id)} className="h-4 w-4 flex-shrink-0 rounded accent-blue-600" style={{ opacity: list.selected.has(item.id) ? 1 : 0 }} />
                <div className="flex-1 min-w-0">
                  <h4 className="truncate font-bold">{item.title}</h4>
                  <a href={item.url} target="_blank" rel="noreferrer" className="block truncate text-xs text-blue-600 hover:underline dark:text-blue-400">{item.url}</a>
                  {item.type && <span className="mt-0.5 inline-block text-[10px] font-semibold uppercase tracking-wide text-neutral-400">{item.type}</span>}
                </div>
                <div className="flex flex-shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">Hapus</button>
                </div>
              </div>
            ))}
            {list.paginated.length === 0 && <div className="col-span-2 py-12 text-center text-neutral-500">{list.search ? `Tidak ada hasil untuk "${list.search}"` : "Belum ada tautan."}</div>}
          </div>
          <AdminPagination currentPage={list.page} totalPages={list.totalPages} onPageChange={list.setPage} totalItems={list.filtered.length} pageSize={PAGE_SIZE} />
        </>
      )}
    </div>
  );
}
