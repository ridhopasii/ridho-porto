"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { TbEye, TbEyeOff } from "react-icons/tb";
import TestimonialFormModal from "../TestimonialFormModal";
import { useAdminList } from "@/common/hooks/useAdminList";
import AdminSearchBar from "../AdminSearchBar";
import AdminPagination from "../AdminPagination";
import AdminBulkBar from "../AdminBulkBar";

const PAGE_SIZE = 10;

export default function TestimonialManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const list = useAdminList({ items, searchFields: ["name", "role", "message"], pageSize: PAGE_SIZE });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      if (res.ok) setItems(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleToggleShow = async (id: number, current: boolean) => {
    const next = !current;
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, showOnHome: next } : it)));
    const res = await fetch("/api/admin/testimonials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, showOnHome: next }),
    });
    if (!res.ok) {
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, showOnHome: current } : it)));
      toast.error("Gagal memperbarui status tampil");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus testimoni ini?")) return;
    const toastId = toast.loading("Menghapus...");
    const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Berhasil dihapus!", { id: toastId }); fetchData(); }
    else toast.error("Gagal menghapus", { id: toastId });
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Yakin ingin menghapus ${list.selected.size} testimoni?`)) return;
    setBulkDeleting(true);
    await Promise.all(Array.from(list.selected).map((id) => fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" })));
    toast.success(`${list.selected.size} testimoni berhasil dihapus`);
    list.clearSelected();
    fetchData();
    setBulkDeleting(false);
  };

  return (
    <div className="space-y-4 p-6">
      {isModalOpen && <TestimonialFormModal item={editingItem} onClose={() => setIsModalOpen(false)} onSuccess={() => { setIsModalOpen(false); fetchData(); }} />}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <AdminSearchBar value={list.search} onChange={list.setSearch} placeholder="Cari nama, peran, pesan..." total={items.length} filtered={list.filtered.length} />
        <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="flex-shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          + Tambah Testimoni
        </button>
      </div>

      <AdminBulkBar selectedCount={list.selected.size} onDelete={handleBulkDelete} onClear={list.clearSelected} isDeleting={bulkDeleting} />

      {loading ? (
        <div className="animate-pulse grid grid-cols-1 gap-4 md:grid-cols-2">{[1,2,3,4].map(i=><div key={i} className="h-36 rounded-xl bg-neutral-100 dark:bg-neutral-800"/>)}</div>
      ) : (
        <>
          {list.paginated.length > 0 && (
            <label className="flex cursor-pointer items-center gap-2 text-xs text-neutral-500">
              <input type="checkbox" checked={list.allSelected} ref={(el) => { if (el) el.indeterminate = list.partialSelected; }} onChange={list.toggleAll} className="h-4 w-4 rounded accent-blue-600" />
              Pilih semua ({list.paginated.length})
            </label>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {list.paginated.map((item) => (
              <div key={item.id} className="group flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={list.selected.has(item.id)} onChange={() => list.toggleSelect(item.id)} className="h-4 w-4 flex-shrink-0 rounded accent-blue-600" style={{ opacity: list.selected.has(item.id) ? 1 : 0 }} />
                  {item.avatarUrl
                    ? <img src={item.avatarUrl} alt={item.name} className="h-10 w-10 flex-shrink-0 rounded-full object-cover" />
                    : <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700 text-lg font-bold text-neutral-500">{item.name?.charAt(0)}</div>
                  }
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-xs text-neutral-500">{item.role}</p>
                  </div>
                  {item.showOnHome === false && (
                    <span className="flex-shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500 dark:bg-neutral-800">
                      Disembunyikan
                    </span>
                  )}
                </div>
                <p className="flex-1 italic text-sm text-neutral-600 dark:text-neutral-400">"{item.message}"</p>
                <div className="flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
                  <div className="text-sm text-yellow-500">{"★".repeat(item.rating ?? 5)}{"☆".repeat(5 - (item.rating ?? 5))}</div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleShow(item.id, item.showOnHome !== false)}
                      title={item.showOnHome === false ? "Tampilkan di beranda" : "Sembunyikan dari beranda"}
                      className={`rounded-lg p-1.5 transition-colors ${item.showOnHome === false ? "text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800" : "text-green-600 hover:bg-green-50 dark:text-green-500 dark:hover:bg-green-900/20"}`}
                    >
                      {item.showOnHome === false ? <TbEyeOff size={15} /> : <TbEye size={15} />}
                    </button>
                    <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">Hapus</button>
                  </div>
                </div>
              </div>
            ))}
            {list.paginated.length === 0 && <div className="col-span-2 py-12 text-center text-neutral-500">{list.search ? `Tidak ada hasil untuk "${list.search}"` : "Belum ada testimoni."}</div>}
          </div>
          <AdminPagination currentPage={list.page} totalPages={list.totalPages} onPageChange={list.setPage} totalItems={list.filtered.length} pageSize={PAGE_SIZE} />
        </>
      )}
    </div>
  );
}
