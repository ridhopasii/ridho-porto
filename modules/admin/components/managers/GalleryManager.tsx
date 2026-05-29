"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import GalleryFormModal from "../GalleryFormModal";
import { useAdminList } from "@/common/hooks/useAdminList";
import AdminSearchBar from "../AdminSearchBar";
import AdminPagination from "../AdminPagination";
import AdminBulkBar from "../AdminBulkBar";

const PAGE_SIZE = 12;

export default function GalleryManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const list = useAdminList({ items, searchFields: ["title", "category"], pageSize: PAGE_SIZE });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      if (res.ok) setItems(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus foto ini?")) return;
    const toastId = toast.loading("Menghapus...");
    const res = await fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Berhasil dihapus!", { id: toastId }); fetchData(); }
    else toast.error("Gagal menghapus", { id: toastId });
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Yakin ingin menghapus ${list.selected.size} foto?`)) return;
    setBulkDeleting(true);
    await Promise.all(Array.from(list.selected).map((id) => fetch(`/api/admin/gallery?id=${id}`, { method: "DELETE" })));
    toast.success(`${list.selected.size} foto berhasil dihapus`);
    list.clearSelected();
    fetchData();
    setBulkDeleting(false);
  };

  return (
    <div className="space-y-4 p-6">
      {isModalOpen && <GalleryFormModal item={editingItem} onClose={() => setIsModalOpen(false)} onSuccess={() => { setIsModalOpen(false); fetchData(); }} />}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <AdminSearchBar value={list.search} onChange={list.setSearch} placeholder="Cari judul, kategori..." total={items.length} filtered={list.filtered.length} />
        <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="flex-shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          + Tambah Foto
        </button>
      </div>

      <AdminBulkBar selectedCount={list.selected.size} onDelete={handleBulkDelete} onClear={list.clearSelected} isDeleting={bulkDeleting} />

      {loading ? (
        <div className="animate-pulse grid grid-cols-2 gap-3 md:grid-cols-4">{Array.from({length:8}).map((_,i)=><div key={i} className="aspect-square rounded-xl bg-neutral-100 dark:bg-neutral-800"/>)}</div>
      ) : (
        <>
          {list.paginated.length > 0 && (
            <label className="flex cursor-pointer items-center gap-2 text-xs text-neutral-500">
              <input type="checkbox" checked={list.allSelected} ref={(el) => { if (el) el.indeterminate = list.partialSelected; }} onChange={list.toggleAll} className="h-4 w-4 rounded accent-blue-600" />
              Pilih semua ({list.paginated.length})
            </label>
          )}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {list.paginated.map((item) => {
              const imgUrl = item.images?.[0];
              return (
                <div key={item.id} className="group relative overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                  <input type="checkbox" checked={list.selected.has(item.id)} onChange={() => list.toggleSelect(item.id)} className="absolute left-2 top-2 z-10 h-4 w-4 rounded accent-blue-600" style={{ opacity: list.selected.has(item.id) ? 1 : 0 }} />
                  <div className="relative aspect-square w-full bg-neutral-100 dark:bg-neutral-800">
                    {imgUrl ? <img src={imgUrl} alt={item.title} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-neutral-400">Tidak ada gambar</div>}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="rounded-full bg-blue-600/90 px-3 py-1 text-sm text-white hover:bg-blue-700">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="rounded-full bg-red-600/90 px-3 py-1 text-sm text-white hover:bg-red-700">Hapus</button>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <h4 className="truncate text-sm font-bold">{item.title}</h4>
                    <p className="text-[11px] text-neutral-500">{item.category}</p>
                  </div>
                </div>
              );
            })}
            {list.paginated.length === 0 && <div className="col-span-4 py-12 text-center text-neutral-500">{list.search ? `Tidak ada hasil untuk "${list.search}"` : "Belum ada foto."}</div>}
          </div>
          <AdminPagination currentPage={list.page} totalPages={list.totalPages} onPageChange={list.setPage} totalItems={list.filtered.length} pageSize={PAGE_SIZE} />
        </>
      )}
    </div>
  );
}
