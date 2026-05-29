"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { TbArrowUp, TbArrowDown } from "react-icons/tb";
import ServiceFormModal from "../ServiceFormModal";
import DynamicIcon from "@/common/components/DynamicIcon";
import { useAdminList } from "@/common/hooks/useAdminList";
import AdminSearchBar from "../AdminSearchBar";
import AdminPagination from "../AdminPagination";
import AdminBulkBar from "../AdminBulkBar";

const PAGE_SIZE = 12;

export default function ServiceManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const list = useAdminList({
    items,
    searchFields: ["title", "description"],
    pageSize: PAGE_SIZE,
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      if (res.ok) {
        const data = await res.json();
        setItems([...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleMove = async (idx: number, dir: "up" | "down") => {
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const updated = [...items];
    [updated[idx], updated[targetIdx]] = [updated[targetIdx], updated[idx]];
    const withOrder = updated.map((e, i) => ({ ...e, order: i }));
    setItems(withOrder);
    await Promise.all([
      fetch("/api/admin/services", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: withOrder[idx].id, order: idx }) }),
      fetch("/api/admin/services", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: withOrder[targetIdx].id, order: targetIdx }) }),
    ]);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus layanan ini?")) return;
    const toastId = toast.loading("Menghapus...");
    const res = await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Berhasil dihapus!", { id: toastId }); fetchData(); }
    else toast.error("Gagal menghapus", { id: toastId });
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Yakin ingin menghapus ${list.selected.size} layanan?`)) return;
    setBulkDeleting(true);
    await Promise.all(Array.from(list.selected).map((id) => fetch(`/api/admin/services?id=${id}`, { method: "DELETE" })));
    toast.success(`${list.selected.size} layanan berhasil dihapus`);
    list.clearSelected();
    fetchData();
    setBulkDeleting(false);
  };

  const isSearching = list.search.trim().length > 0;

  return (
    <div className="space-y-4 p-6">
      {isModalOpen && (
        <ServiceFormModal
          item={editingItem}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => { setIsModalOpen(false); fetchData(); }}
        />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <AdminSearchBar value={list.search} onChange={list.setSearch} placeholder="Cari judul, deskripsi..." total={items.length} filtered={list.filtered.length} />
        <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="flex-shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          + Tambah Layanan
        </button>
      </div>

      <AdminBulkBar selectedCount={list.selected.size} onDelete={handleBulkDelete} onClear={list.clearSelected} isDeleting={bulkDeleting} />

      {loading ? (
        <div className="animate-pulse grid grid-cols-1 gap-3 md:grid-cols-2">{[1, 2, 3, 4].map((i) => <div key={i} className="h-24 rounded-xl bg-neutral-100 dark:bg-neutral-800" />)}</div>
      ) : (
        <>
          {list.paginated.length > 0 && (
            <label className="flex cursor-pointer items-center gap-2 text-xs text-neutral-500">
              <input type="checkbox" checked={list.allSelected} ref={(el) => { if (el) el.indeterminate = list.partialSelected; }} onChange={list.toggleAll} className="h-4 w-4 rounded accent-blue-600" />
              Pilih semua ({list.paginated.length})
            </label>
          )}

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {list.paginated.map((item) => {
              const actualIdx = items.findIndex((s) => s.id === item.id);
              return (
                <div key={item.id} className="group flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                  <input type="checkbox" checked={list.selected.has(item.id)} onChange={() => list.toggleSelect(item.id)} className="h-4 w-4 flex-shrink-0 rounded accent-blue-600" style={{ opacity: list.selected.has(item.id) ? 1 : 0 }} />

                  {!isSearching && (
                    <div className="flex flex-shrink-0 flex-col gap-0.5">
                      <button onClick={() => handleMove(actualIdx, "up")} disabled={actualIdx === 0} className="rounded p-0.5 text-neutral-400 hover:bg-neutral-100 disabled:opacity-20 dark:hover:bg-neutral-800 transition-colors">
                        <TbArrowUp size={13} />
                      </button>
                      <button onClick={() => handleMove(actualIdx, "down")} disabled={actualIdx === items.length - 1} className="rounded p-0.5 text-neutral-400 hover:bg-neutral-100 disabled:opacity-20 dark:hover:bg-neutral-800 transition-colors">
                        <TbArrowDown size={13} />
                      </button>
                    </div>
                  )}

                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    {item.icon?.startsWith("http") || item.icon?.startsWith("/")
                      ? <img src={item.icon} alt={item.title} className="h-6 w-6 object-contain" />
                      : <DynamicIcon name={item.icon || "HiOutlineBriefcase"} size={20} />
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="truncate font-bold">{item.title}</h4>
                    <p className="truncate text-xs text-neutral-500">{item.description}</p>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">Hapus</button>
                  </div>
                </div>
              );
            })}

            {list.paginated.length === 0 && (
              <div className="col-span-2 py-12 text-center text-neutral-500">
                {list.search ? `Tidak ada hasil untuk "${list.search}"` : "Belum ada layanan."}
              </div>
            )}
          </div>

          <AdminPagination currentPage={list.page} totalPages={list.totalPages} onPageChange={list.setPage} totalItems={list.filtered.length} pageSize={PAGE_SIZE} />
        </>
      )}
    </div>
  );
}
