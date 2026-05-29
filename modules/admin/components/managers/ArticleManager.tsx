"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { TbEye, TbEyeOff, TbCircleCheck, TbCircle } from "react-icons/tb";
import Image from "next/image";
import ArticleFormModal from "../ArticleFormModal";
import { useAdminList } from "@/common/hooks/useAdminList";
import AdminSearchBar from "../AdminSearchBar";
import AdminPagination from "../AdminPagination";
import AdminBulkBar from "../AdminBulkBar";

const PAGE_SIZE = 10;

export default function ArticleManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const list = useAdminList({
    items,
    searchFields: ["title", "slug", "tags", "category"],
    pageSize: PAGE_SIZE,
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/articles");
      if (res.ok) setItems(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleToggle = async (id: number, field: "published" | "showOnHome", current: boolean) => {
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: !current } : a)));
    const res = await fetch("/api/admin/articles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, [field]: !current }),
    });
    if (!res.ok) {
      setItems((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: current } : a)));
      toast.error("Gagal memperbarui");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus artikel ini?")) return;
    const toastId = toast.loading("Menghapus...");
    const res = await fetch(`/api/admin/articles?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Berhasil dihapus!", { id: toastId }); fetchData(); }
    else toast.error("Gagal menghapus", { id: toastId });
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Yakin ingin menghapus ${list.selected.size} artikel?`)) return;
    setBulkDeleting(true);
    await Promise.all(Array.from(list.selected).map((id) => fetch(`/api/admin/articles?id=${id}`, { method: "DELETE" })));
    toast.success(`${list.selected.size} artikel berhasil dihapus`);
    list.clearSelected();
    fetchData();
    setBulkDeleting(false);
  };

  return (
    <div className="space-y-4 p-6">
      {isModalOpen && (
        <ArticleFormModal
          item={editingItem}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => { setIsModalOpen(false); fetchData(); }}
        />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <AdminSearchBar value={list.search} onChange={list.setSearch} placeholder="Cari judul, tag, kategori..." total={items.length} filtered={list.filtered.length} />
        <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="flex-shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          + Tambah Artikel
        </button>
      </div>

      <AdminBulkBar selectedCount={list.selected.size} onDelete={handleBulkDelete} onClear={list.clearSelected} isDeleting={bulkDeleting} />

      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-neutral-100 dark:bg-neutral-800" />)}
        </div>
      ) : (
        <>
          {list.paginated.length > 0 && (
            <label className="flex cursor-pointer items-center gap-2 text-xs text-neutral-500">
              <input type="checkbox" checked={list.allSelected} ref={(el) => { if (el) el.indeterminate = list.partialSelected; }} onChange={list.toggleAll} className="h-4 w-4 rounded accent-blue-600" />
              Pilih semua di halaman ini ({list.paginated.length})
            </label>
          )}

          <div className="space-y-2">
            {list.paginated.map((item) => (
              <div key={`art-${item.id}`} className="group flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <input type="checkbox" checked={list.selected.has(item.id)} onChange={() => list.toggleSelect(item.id)} className="h-4 w-4 flex-shrink-0 rounded accent-blue-600" style={{ opacity: list.selected.has(item.id) ? 1 : 0 }} />

                {item.imageUrl && (
                  <div className="relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate font-semibold">{item.title}</h4>
                    {!item.published && <span className="flex-shrink-0 rounded bg-yellow-100 px-1.5 py-0.5 text-[10px] font-medium text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Draft</span>}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-neutral-400">{item.slug}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {item.tags?.split(",").slice(0, 3).map((t: string) => (
                      <span key={t.trim()} className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] dark:bg-neutral-800">{t.trim()}</span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => handleToggle(item.id, "published", item.published)} title={item.published ? "Jadikan draft" : "Publikasikan"} className={`rounded-lg p-1.5 transition-colors ${item.published ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800"}`}>
                    {item.published ? <TbCircleCheck size={15} /> : <TbCircle size={15} />}
                  </button>
                  <button onClick={() => handleToggle(item.id, "showOnHome", item.showOnHome)} title={item.showOnHome ? "Sembunyikan dari beranda" : "Tampilkan di beranda"} className={`rounded-lg p-1.5 transition-colors ${item.showOnHome ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800"}`}>
                    {item.showOnHome ? <TbEye size={15} /> : <TbEyeOff size={15} />}
                  </button>
                  <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="rounded-lg bg-blue-50 px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="rounded-lg bg-red-50 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">Hapus</button>
                </div>
              </div>
            ))}

            {list.paginated.length === 0 && (
              <div className="py-12 text-center text-neutral-500">
                {list.search ? `Tidak ada artikel cocok dengan "${list.search}"` : "Belum ada artikel."}
              </div>
            )}
          </div>

          <AdminPagination currentPage={list.page} totalPages={list.totalPages} onPageChange={list.setPage} totalItems={list.filtered.length} pageSize={PAGE_SIZE} />
        </>
      )}
    </div>
  );
}
