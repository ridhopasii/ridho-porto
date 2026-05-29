"use client";

import { createClient } from "@/common/utils/client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { TbEye, TbEyeOff, TbPencil, TbTrash } from "react-icons/tb";
import SkillFormModal from "../SkillFormModal";
import { useAdminList } from "@/common/hooks/useAdminList";
import AdminSearchBar from "../AdminSearchBar";
import AdminPagination from "../AdminPagination";
import AdminBulkBar from "../AdminBulkBar";

const PAGE_SIZE = 20;

export default function SkillManager() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingData, setEditingData] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const supabase = createClient();

  const list = useAdminList({ items: skills, searchFields: ["name", "category"], pageSize: PAGE_SIZE });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase.from("Skill").select("*").order("name", { ascending: true });
    if (fetchError) { console.error("Skill fetch error:", fetchError); toast.error("Gagal memuat data"); }
    else if (data) setSkills(data);
    setLoading(false);
  };

  const handleToggle = async (id: number, current: boolean) => {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, showOnHome: !current } : s)));
    const { error } = await supabase.from("Skill").update({ showOnHome: !current }).eq("id", id);
    if (error) {
      setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, showOnHome: current } : s)));
      toast.error("Gagal memperbarui");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus skill ini?")) return;
    const toastId = toast.loading("Menghapus...");
    const res = await fetch(`/api/admin/skills?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Berhasil dihapus!", { id: toastId }); fetchData(); }
    else toast.error("Gagal menghapus", { id: toastId });
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Yakin ingin menghapus ${list.selected.size} skill?`)) return;
    setBulkDeleting(true);
    await Promise.all(Array.from(list.selected).map((id) => fetch(`/api/admin/skills?id=${id}`, { method: "DELETE" })));
    toast.success(`${list.selected.size} skill berhasil dihapus`);
    list.clearSelected();
    fetchData();
    setBulkDeleting(false);
  };

  const categories = [...new Set(list.paginated.map((s) => s.category || "Lainnya"))].sort();

  return (
    <div className="space-y-4 p-6">
      {isModalOpen && (
        <SkillFormModal skill={editingData} onClose={() => setIsModalOpen(false)} onSuccess={() => { setIsModalOpen(false); fetchData(); }} />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <AdminSearchBar value={list.search} onChange={list.setSearch} placeholder="Cari nama skill atau kategori..." total={skills.length} filtered={list.filtered.length} />
        <button onClick={() => { setEditingData(null); setIsModalOpen(true); }} className="flex-shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          + Tambah Skill
        </button>
      </div>

      <AdminBulkBar selectedCount={list.selected.size} onDelete={handleBulkDelete} onClear={list.clearSelected} isDeleting={bulkDeleting} />

      {loading ? (
        <div className="animate-pulse grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800" />)}
        </div>
      ) : (
        <>
          {list.paginated.length > 0 && (
            <label className="flex cursor-pointer items-center gap-2 text-xs text-neutral-500">
              <input type="checkbox" checked={list.allSelected} ref={(el) => { if (el) el.indeterminate = list.partialSelected; }} onChange={list.toggleAll} className="h-4 w-4 rounded accent-blue-600" />
              Pilih semua ({list.paginated.length})
            </label>
          )}

          <div className="space-y-5">
            {categories.map((cat) => {
              const catSkills = list.paginated.filter((s) => (s.category || "Lainnya") === cat);
              if (!catSkills.length) return null;
              return (
                <div key={cat}>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-neutral-400">{cat}</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {catSkills.map((skill) => (
                      <div key={`skill-${skill.id}`} className="group flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 dark:border-neutral-700 dark:bg-neutral-900">
                        <input type="checkbox" checked={list.selected.has(skill.id)} onChange={() => list.toggleSelect(skill.id)} className="h-3.5 w-3.5 flex-shrink-0 rounded accent-blue-600 transition-opacity" style={{ opacity: list.selected.has(skill.id) ? 1 : 0 }} />
                        <span className="flex-1 truncate text-sm font-medium dark:text-white">{skill.name}</span>
                        <div className="hidden items-center gap-0.5 group-hover:flex">
                          <button onClick={() => handleToggle(skill.id, skill.showOnHome)} title={skill.showOnHome ? "Sembunyikan" : "Tampilkan"} className={`rounded p-1 transition-colors ${skill.showOnHome ? "text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20" : "text-neutral-300 hover:bg-neutral-100 dark:text-neutral-600 dark:hover:bg-neutral-800"}`}>
                            {skill.showOnHome ? <TbEye size={13} /> : <TbEyeOff size={13} />}
                          </button>
                          <button onClick={() => { setEditingData(skill); setIsModalOpen(true); }} className="rounded p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <TbPencil size={13} />
                          </button>
                          <button onClick={() => handleDelete(skill.id)} className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                            <TbTrash size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {list.paginated.length === 0 && (
            <div className="py-12 text-center text-neutral-500">
              {list.search ? `Tidak ada skill cocok dengan "${list.search}"` : "Belum ada skill."}
            </div>
          )}

          <AdminPagination currentPage={list.page} totalPages={list.totalPages} onPageChange={list.setPage} totalItems={list.filtered.length} pageSize={PAGE_SIZE} />
        </>
      )}
    </div>
  );
}
