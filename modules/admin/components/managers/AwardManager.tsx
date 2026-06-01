"use client";

import { createClient } from "@/common/utils/client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import AwardFormModal from "../AwardFormModal";
import ImageUploader from "../ImageUploader";
import { useAdminList } from "@/common/hooks/useAdminList";
import AdminSearchBar from "../AdminSearchBar";
import AdminPagination from "../AdminPagination";
import AdminBulkBar from "../AdminBulkBar";

/** Normalizes images field from DB — can be string, string[], or null */
const normalizeImages = (images: unknown): string[] => {
  if (!images) return [];
  if (Array.isArray(images)) return images.filter((u): u is string => typeof u === "string" && !!u);
  if (typeof images === "string" && images.trim()) return [images];
  return [];
};

const PAGE_SIZE = 10;

export default function AwardManager() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAward, setEditingAward] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const supabase = createClient();

  const list = useAdminList({ items: achievements, searchFields: ["title", "organizer", "description"], pageSize: PAGE_SIZE });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase.from("Award").select("*").order("id", { ascending: false });
    if (fetchError) { console.error("Award fetch error:", fetchError); toast.error("Gagal memuat data"); }
    else if (data) setAchievements(data);
    setLoading(false);
  };

  const handleUpdateImage = async (id: number, newImageUrl: string) => {
    const toastId = toast.loading("Menyimpan gambar...");
    // certificateUrl is the primary image field used in the DB
    const res = await fetch("/api/admin/awards", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, certificateUrl: newImageUrl }) });
    if (res.ok) { toast.success("Gambar diperbarui!", { id: toastId }); fetchData(); }
    else toast.error("Gagal memperbarui gambar", { id: toastId });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus pencapaian ini?")) return;
    const toastId = toast.loading("Menghapus...");
    const res = await fetch(`/api/admin/awards?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Berhasil dihapus!", { id: toastId }); fetchData(); }
    else toast.error("Gagal menghapus", { id: toastId });
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Yakin ingin menghapus ${list.selected.size} pencapaian?`)) return;
    setBulkDeleting(true);
    await Promise.all(Array.from(list.selected).map((id) => fetch(`/api/admin/awards?id=${id}`, { method: "DELETE" })));
    toast.success(`${list.selected.size} item berhasil dihapus`);
    list.clearSelected();
    fetchData();
    setBulkDeleting(false);
  };

  return (
    <div className="space-y-4 p-6">
      {isModalOpen && <AwardFormModal award={editingAward} onClose={() => setIsModalOpen(false)} onSuccess={() => { setIsModalOpen(false); fetchData(); }} />}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <AdminSearchBar value={list.search} onChange={list.setSearch} placeholder="Cari judul, penyelenggara..." total={achievements.length} filtered={list.filtered.length} />
        <button onClick={() => { setEditingAward(null); setIsModalOpen(true); }} className="flex-shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          + Tambah Pencapaian
        </button>
      </div>

      <AdminBulkBar selectedCount={list.selected.size} onDelete={handleBulkDelete} onClear={list.clearSelected} isDeleting={bulkDeleting} />

      {loading ? (
        <div className="animate-pulse grid grid-cols-1 gap-4 lg:grid-cols-2">{[1,2,3,4].map(i=><div key={i} className="h-44 rounded-xl bg-neutral-100 dark:bg-neutral-800"/>)}</div>
      ) : (
        <>
          {list.paginated.length > 0 && (
            <label className="flex cursor-pointer items-center gap-2 text-xs text-neutral-500">
              <input type="checkbox" checked={list.allSelected} ref={(el) => { if (el) el.indeterminate = list.partialSelected; }} onChange={list.toggleAll} className="h-4 w-4 rounded accent-blue-600" />
              Pilih semua ({list.paginated.length})
            </label>
          )}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {list.paginated.map((award) => (
              <div key={`award-${award.id}`} className="group relative flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <input type="checkbox" checked={list.selected.has(award.id)} onChange={() => list.toggleSelect(award.id)} className="absolute left-3 top-3 h-4 w-4 rounded accent-blue-600" style={{ opacity: list.selected.has(award.id) ? 1 : 0 }} />
                <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => { setEditingAward(award); setIsModalOpen(true); }} className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">Edit</button>
                  <button onClick={() => handleDelete(award.id)} className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">Hapus</button>
                </div>
                <div className="pr-24">
                  <h4 className="font-bold">{award.title}</h4>
                  <p className="text-xs text-neutral-500">{award.organizer} · {award.date}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">{award.description}</p>
                </div>
                <div className="border-t border-neutral-100 pt-3 dark:border-neutral-800">
                  <p className="mb-1.5 text-xs font-semibold text-neutral-500">Bukti / Sertifikat</p>
                  {/* Primary thumbnail: certificateUrl */}
                  {award.certificateUrl && (
                    <img
                      src={award.certificateUrl}
                      alt={award.title}
                      className="mb-2 h-28 w-full rounded-lg object-contain bg-neutral-50 dark:bg-neutral-800"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  )}
                  {/* Secondary gallery images */}
                  {normalizeImages(award.images).length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {normalizeImages(award.images).map((imgUrl, idx) => (
                        <img
                          key={idx}
                          src={imgUrl}
                          alt={`${award.title} gallery #${idx + 1}`}
                          className="h-20 w-24 rounded-lg object-contain bg-neutral-50 dark:bg-neutral-800"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ))}
                    </div>
                  )}
                  {!award.certificateUrl && !normalizeImages(award.images).length && (
                    <div className="mb-2 flex h-20 items-center justify-center rounded-lg bg-neutral-50 text-xs text-neutral-400 dark:bg-neutral-800">
                      Belum ada gambar
                    </div>
                  )}
                  <ImageUploader onChange={(url) => handleUpdateImage(award.id, url)} path="awards" />
                </div>
              </div>
            ))}
            {list.paginated.length === 0 && <div className="col-span-2 py-12 text-center text-neutral-500">{list.search ? `Tidak ada hasil untuk "${list.search}"` : "Belum ada pencapaian."}</div>}
          </div>
          <AdminPagination currentPage={list.page} totalPages={list.totalPages} onPageChange={list.setPage} totalItems={list.filtered.length} pageSize={PAGE_SIZE} />
        </>
      )}
    </div>
  );
}
