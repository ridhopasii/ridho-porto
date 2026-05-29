"use client";

import { createClient } from "@/common/utils/client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { TbEye, TbEyeOff } from "react-icons/tb";
import OrganizationFormModal from "../OrganizationFormModal";
import { useAdminList } from "@/common/hooks/useAdminList";
import AdminSearchBar from "../AdminSearchBar";
import AdminPagination from "../AdminPagination";
import AdminBulkBar from "../AdminBulkBar";

const PAGE_SIZE = 10;

export default function OrganizationManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const supabase = createClient();

  const list = useAdminList({ items, searchFields: ["name", "role", "description", "period"], pageSize: PAGE_SIZE });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase.from("Organization").select("*").order("order", { ascending: true });
    if (fetchError) { console.error("Organization fetch error:", fetchError); toast.error("Gagal memuat data"); }
    else if (data) setItems(data);
    setLoading(false);
  };

  const handleToggle = async (id: number, current: boolean) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, showOnHome: !current } : i)));
    const { error } = await supabase.from("Organization").update({ showOnHome: !current }).eq("id", id);
    if (error) {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, showOnHome: current } : i)));
      toast.error("Gagal memperbarui");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus organisasi ini?")) return;
    const toastId = toast.loading("Menghapus...");
    const res = await fetch(`/api/admin/organization?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Berhasil dihapus!", { id: toastId }); fetchData(); }
    else toast.error("Gagal menghapus", { id: toastId });
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Yakin ingin menghapus ${list.selected.size} organisasi?`)) return;
    setBulkDeleting(true);
    await Promise.all(Array.from(list.selected).map((id) => fetch(`/api/admin/organization?id=${id}`, { method: "DELETE" })));
    toast.success(`${list.selected.size} item berhasil dihapus`);
    list.clearSelected();
    fetchData();
    setBulkDeleting(false);
  };

  return (
    <div className="space-y-4 p-6">
      {isModalOpen && <OrganizationFormModal item={editingItem} onClose={() => setIsModalOpen(false)} onSuccess={() => { setIsModalOpen(false); fetchData(); }} />}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <AdminSearchBar value={list.search} onChange={list.setSearch} placeholder="Cari nama, peran, periode..." total={items.length} filtered={list.filtered.length} />
        <button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="flex-shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          + Tambah Organisasi
        </button>
      </div>

      <AdminBulkBar selectedCount={list.selected.size} onDelete={handleBulkDelete} onClear={list.clearSelected} isDeleting={bulkDeleting} />

      {loading ? (
        <div className="animate-pulse grid grid-cols-1 gap-4 lg:grid-cols-2">{[1,2,3,4].map(i=><div key={i} className="h-28 rounded-xl bg-neutral-100 dark:bg-neutral-800"/>)}</div>
      ) : (
        <>
          {list.paginated.length > 0 && (
            <label className="flex cursor-pointer items-center gap-2 text-xs text-neutral-500">
              <input type="checkbox" checked={list.allSelected} ref={(el) => { if (el) el.indeterminate = list.partialSelected; }} onChange={list.toggleAll} className="h-4 w-4 rounded accent-blue-600" />
              Pilih semua ({list.paginated.length})
            </label>
          )}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {list.paginated.map((item) => (
              <div key={item.id} className="group relative flex gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <input type="checkbox" checked={list.selected.has(item.id)} onChange={() => list.toggleSelect(item.id)} className="absolute left-3 top-3 h-4 w-4 rounded accent-blue-600" style={{ opacity: list.selected.has(item.id) ? 1 : 0 }} />
                <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => handleToggle(item.id, item.showOnHome)} title={item.showOnHome ? "Sembunyikan" : "Tampilkan"} className={`rounded-lg p-1.5 transition-colors ${item.showOnHome ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800"}`}>
                    {item.showOnHome ? <TbEye size={13} /> : <TbEyeOff size={13} />}
                  </button>
                  <button onClick={() => { setEditingItem(item); setIsModalOpen(true); }} className="rounded-lg bg-blue-50 px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="rounded-lg bg-red-50 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">Hapus</button>
                </div>
                <div className="flex-shrink-0">
                  {item.logoUrl
                    ? <img src={item.logoUrl} alt={item.name} className="h-12 w-12 rounded-xl border border-neutral-200 object-contain p-1 dark:border-neutral-700" />
                    : <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-dashed border-neutral-300 text-2xl dark:border-neutral-700">🏢</div>
                  }
                </div>
                <div className="flex-1 min-w-0 pr-20">
                  <h4 className="truncate font-bold">{item.name}</h4>
                  <p className="text-sm font-medium text-primary">{item.role}</p>
                  <p className="text-xs text-neutral-500">{item.period}</p>
                  {item.description && <p className="mt-1 line-clamp-2 text-xs text-neutral-500">{item.description}</p>}
                  {!item.showOnHome && <span className="mt-1 inline-block rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-500 dark:bg-neutral-800">Tersembunyi</span>}
                </div>
              </div>
            ))}
            {list.paginated.length === 0 && <div className="col-span-2 py-12 text-center text-neutral-500">{list.search ? `Tidak ada hasil untuk "${list.search}"` : "Belum ada organisasi."}</div>}
          </div>
          <AdminPagination currentPage={list.page} totalPages={list.totalPages} onPageChange={list.setPage} totalItems={list.filtered.length} pageSize={PAGE_SIZE} />
        </>
      )}
    </div>
  );
}
