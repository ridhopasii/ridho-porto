"use client";

import { createClient } from "@/common/utils/client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { TbArrowUp, TbArrowDown, TbEye, TbEyeOff } from "react-icons/tb";
import ExperienceFormModal from "../ExperienceFormModal";
import { useAdminList } from "@/common/hooks/useAdminList";
import AdminSearchBar from "../AdminSearchBar";
import AdminPagination from "../AdminPagination";
import AdminBulkBar from "../AdminBulkBar";

const PAGE_SIZE = 10;

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingData, setEditingData] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const supabase = createClient();

  const list = useAdminList({
    items: experiences,
    searchFields: ["company", "position", "type", "location"],
    pageSize: PAGE_SIZE,
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Experience")
      .select("*")
      .order("start_date", { ascending: false });
    if (error) {
      toast.error("Gagal memuat data pengalaman");
      console.error("Experience fetch error:", error);
    } else if (data) {
      const sorted = data.sort((a: any, b: any) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999));
      setExperiences(sorted);
    }
    setLoading(false);
  };

  const handleMove = async (idx: number, dir: "up" | "down") => {
    const targetIdx = dir === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= experiences.length) return;
    const updated = [...experiences];
    [updated[idx], updated[targetIdx]] = [updated[targetIdx], updated[idx]];
    const withOrder = updated.map((e, i) => ({ ...e, sort_order: i }));
    setExperiences(withOrder);
    const results = await Promise.allSettled([
      fetch("/api/admin/experience", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: withOrder[idx].id, sort_order: idx }) }),
      fetch("/api/admin/experience", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: withOrder[targetIdx].id, sort_order: targetIdx }) }),
    ]);
    const anyFailed = results.some(r => r.status === "rejected");
    if (anyFailed) toast.error("Urutan tidak tersimpan — kolom sort_order mungkin belum ada di DB");
  };

  const handleToggle = async (id: number, current: boolean) => {
    const next = !current;
    setExperiences((prev) => prev.map((e) => (e.id === id ? { ...e, showOnHome: next } : e)));
    const { error } = await supabase.from("Experience").update({ showOnHome: next }).eq("id", id);
    if (error) {
      setExperiences((prev) => prev.map((e) => (e.id === id ? { ...e, showOnHome: current } : e)));
      toast.error("Gagal memperbarui");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    const toastId = toast.loading("Menghapus...");
    const res = await fetch(`/api/admin/experience?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Berhasil dihapus!", { id: toastId }); fetchData(); }
    else toast.error("Gagal menghapus", { id: toastId });
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Yakin ingin menghapus ${list.selected.size} pengalaman?`)) return;
    setBulkDeleting(true);
    await Promise.all(Array.from(list.selected).map((id) => fetch(`/api/admin/experience?id=${id}`, { method: "DELETE" })));
    toast.success(`${list.selected.size} item berhasil dihapus`);
    list.clearSelected();
    fetchData();
    setBulkDeleting(false);
  };

  const isSearching = list.search.trim().length > 0;

  return (
    <div className="space-y-4 p-6">
      {isModalOpen && (
        <ExperienceFormModal
          experience={editingData}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => { setIsModalOpen(false); fetchData(); }}
        />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <AdminSearchBar value={list.search} onChange={list.setSearch} placeholder="Cari perusahaan, posisi, lokasi..." total={experiences.length} filtered={list.filtered.length} />
        <button onClick={() => { setEditingData(null); setIsModalOpen(true); }} className="flex-shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          + Tambah Pengalaman
        </button>
      </div>

      <AdminBulkBar selectedCount={list.selected.size} onDelete={handleBulkDelete} onClear={list.clearSelected} isDeleting={bulkDeleting} />

      {!isSearching && (
        <p className="text-xs text-neutral-400">Gunakan ↑↓ untuk mengatur urutan tampil di situs.</p>
      )}

      {loading ? (
        <div className="animate-pulse space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-xl bg-neutral-100 dark:bg-neutral-800" />)}</div>
      ) : (
        <>
          {list.paginated.length > 0 && (
            <label className="flex cursor-pointer items-center gap-2 text-xs text-neutral-500">
              <input type="checkbox" checked={list.allSelected} ref={(el) => { if (el) el.indeterminate = list.partialSelected; }} onChange={list.toggleAll} className="h-4 w-4 rounded accent-blue-600" />
              Pilih semua ({list.paginated.length})
            </label>
          )}

          <div className="space-y-3">
            {list.paginated.map((item, idx) => {
              const actualIdx = experiences.findIndex((e) => e.id === item.id);
              return (
                <div key={`exp-${item.id}`} className="group flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                  <input type="checkbox" checked={list.selected.has(item.id)} onChange={() => list.toggleSelect(item.id)} className="mt-1 h-4 w-4 flex-shrink-0 rounded accent-blue-600" style={{ opacity: list.selected.has(item.id) ? 1 : 0 }} />

                  {!isSearching && (
                    <div className="flex flex-shrink-0 flex-col gap-0.5 pt-1">
                      <button onClick={() => handleMove(actualIdx, "up")} disabled={actualIdx === 0} className="rounded p-0.5 text-neutral-400 transition-colors hover:bg-neutral-100 disabled:opacity-20 dark:hover:bg-neutral-800">
                        <TbArrowUp size={13} />
                      </button>
                      <button onClick={() => handleMove(actualIdx, "down")} disabled={actualIdx === experiences.length - 1} className="rounded p-0.5 text-neutral-400 transition-colors hover:bg-neutral-100 disabled:opacity-20 dark:hover:bg-neutral-800">
                        <TbArrowDown size={13} />
                      </button>
                    </div>
                  )}

                  {item.logoUrl && <img src={item.logoUrl} alt={item.company} className="h-10 w-10 flex-shrink-0 rounded-full object-cover" />}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold">{item.position}</h4>
                      {!item.showOnHome && <span className="flex-shrink-0 rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-500 dark:bg-neutral-800">Tersembunyi</span>}
                    </div>
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{item.company}</p>
                    <p className="text-xs text-neutral-500">{item.type} · {item.location} · {item.start_date} – {item.end_date || "Sekarang"}</p>
                  </div>

                  <div className="flex flex-shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button onClick={() => handleToggle(item.id, item.showOnHome !== false)} title={item.showOnHome === false ? "Tampilkan" : "Sembunyikan"} className={`rounded-lg p-1.5 transition-colors ${item.showOnHome === false ? "bg-neutral-100 text-neutral-400 dark:bg-neutral-800" : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"}`}>
                      {item.showOnHome === false ? <TbEyeOff size={14} /> : <TbEye size={14} />}
                    </button>
                    <button onClick={() => { setEditingData(item); setIsModalOpen(true); }} className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">Hapus</button>
                  </div>
                </div>
              );
            })}

            {list.paginated.length === 0 && (
              <div className="py-12 text-center text-neutral-500">
                {list.search ? `Tidak ada hasil untuk "${list.search}"` : "Belum ada data pengalaman."}
              </div>
            )}
          </div>

          <AdminPagination currentPage={list.page} totalPages={list.totalPages} onPageChange={list.setPage} totalItems={list.filtered.length} pageSize={PAGE_SIZE} />
        </>
      )}
    </div>
  );
}
