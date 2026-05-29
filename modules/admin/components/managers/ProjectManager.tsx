"use client";

import { createClient } from "@/common/utils/client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { TbStar, TbStarFilled, TbEye, TbEyeOff } from "react-icons/tb";
import ProjectFormModal from "../ProjectFormModal";
import ImageUploader from "../ImageUploader";
import { useAdminList } from "@/common/hooks/useAdminList";
import AdminSearchBar from "../AdminSearchBar";
import AdminPagination from "../AdminPagination";
import AdminBulkBar from "../AdminBulkBar";

const PAGE_SIZE = 10;

export default function ProjectManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const supabase = createClient();

  const list = useAdminList({
    items: projects,
    searchFields: ["title", "description", "tags", "category"],
    pageSize: PAGE_SIZE,
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase.from("Project").select("*").order("id", { ascending: false });
    if (fetchError) { console.error("Project fetch error:", fetchError); toast.error("Gagal memuat data"); }
    else if (data) setProjects(data);
    setLoading(false);
  };

  const handleUpdateImage = async (id: number, newImageUrl: string) => {
    const toastId = toast.loading("Menyimpan gambar...");
    const res = await fetch("/api/admin/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, imageUrl: newImageUrl }),
    });
    if (res.ok) { toast.success("Gambar diperbarui!", { id: toastId }); fetchData(); }
    else toast.error("Gagal memperbarui gambar", { id: toastId });
  };

  const handleToggle = async (id: number, field: "showOnHome" | "featured", current: boolean) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: !current } : p)));
    const res = await fetch("/api/admin/projects", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, [field]: !current }),
    });
    if (!res.ok) {
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: current } : p)));
      toast.error("Gagal memperbarui");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus proyek ini?")) return;
    const toastId = toast.loading("Menghapus...");
    const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Berhasil dihapus!", { id: toastId }); fetchData(); }
    else toast.error("Gagal menghapus", { id: toastId });
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Yakin ingin menghapus ${list.selected.size} proyek?`)) return;
    setBulkDeleting(true);
    await Promise.all(Array.from(list.selected).map((id) => fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" })));
    toast.success(`${list.selected.size} proyek berhasil dihapus`);
    list.clearSelected();
    fetchData();
    setBulkDeleting(false);
  };

  return (
    <div className="space-y-4 p-6">
      {isModalOpen && (
        <ProjectFormModal
          project={editingProject}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => { setIsModalOpen(false); fetchData(); }}
        />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <AdminSearchBar value={list.search} onChange={list.setSearch} placeholder="Cari judul, deskripsi, tag..." total={projects.length} filtered={list.filtered.length} />
        <button onClick={() => { setEditingProject(null); setIsModalOpen(true); }} className="flex-shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          + Tambah Proyek
        </button>
      </div>

      <AdminBulkBar selectedCount={list.selected.size} onDelete={handleBulkDelete} onClear={list.clearSelected} isDeleting={bulkDeleting} />

      {loading ? (
        <div className="grid animate-pulse grid-cols-1 gap-4 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-52 rounded-xl bg-neutral-100 dark:bg-neutral-800" />)}
        </div>
      ) : (
        <>
          {list.paginated.length > 0 && (
            <label className="flex cursor-pointer items-center gap-2 text-xs text-neutral-500">
              <input type="checkbox" checked={list.allSelected} ref={(el) => { if (el) el.indeterminate = list.partialSelected; }} onChange={list.toggleAll} className="h-4 w-4 rounded accent-blue-600" />
              Pilih semua di halaman ini ({list.paginated.length})
            </label>
          )}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {list.paginated.map((project) => (
              <div key={`proj-${project.id}`} className="group relative flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-700 dark:bg-neutral-900">
                <input type="checkbox" checked={list.selected.has(project.id)} onChange={() => list.toggleSelect(project.id)} className="absolute left-3 top-3 h-4 w-4 rounded accent-blue-600" style={{ opacity: list.selected.has(project.id) ? 1 : 0 }} />

                <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => handleToggle(project.id, "showOnHome", project.showOnHome)} title={project.showOnHome ? "Sembunyikan" : "Tampilkan di beranda"} className={`rounded-lg p-1.5 transition-colors ${project.showOnHome ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800"}`}>
                    {project.showOnHome ? <TbEye size={14} /> : <TbEyeOff size={14} />}
                  </button>
                  <button onClick={() => handleToggle(project.id, "featured", project.featured)} title={project.featured ? "Hapus unggulan" : "Jadikan unggulan"} className={`rounded-lg p-1.5 transition-colors ${project.featured ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800"}`}>
                    {project.featured ? <TbStarFilled size={14} /> : <TbStar size={14} />}
                  </button>
                  <button onClick={() => { setEditingProject(project); setIsModalOpen(true); }} className="rounded-lg bg-blue-50 px-2 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">Edit</button>
                  <button onClick={() => handleDelete(project.id)} className="rounded-lg bg-red-50 px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400">Hapus</button>
                </div>

                <div className="pr-28">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold leading-tight">{project.title}</h4>
                    {project.featured && <TbStarFilled size={12} className="text-yellow-500" />}
                    {!project.showOnHome && <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-400 dark:bg-neutral-800">Tersembunyi</span>}
                  </div>
                  <p className="mt-0.5 text-xs text-neutral-400">{project.slug}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">{project.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.tags?.split(",").map((t: string) => (
                      <span key={t.trim()} className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] dark:bg-neutral-800">{t.trim()}</span>
                    ))}
                  </div>
                </div>

                <div className="border-t border-neutral-100 pt-3 dark:border-neutral-800">
                  <p className="mb-1.5 text-xs font-semibold text-neutral-500">Gambar Thumbnail</p>
                  {project.imageUrl && <img src={project.imageUrl} alt={project.title} className="mb-2 h-28 w-full rounded-lg object-cover" />}
                  <ImageUploader onChange={(url) => handleUpdateImage(project.id, url)} path="projects" />
                </div>
              </div>
            ))}

            {list.paginated.length === 0 && (
              <div className="col-span-2 py-12 text-center text-neutral-500">
                {list.search ? `Tidak ada proyek cocok dengan "${list.search}"` : "Belum ada proyek."}
              </div>
            )}
          </div>

          <AdminPagination currentPage={list.page} totalPages={list.totalPages} onPageChange={list.setPage} totalItems={list.filtered.length} pageSize={PAGE_SIZE} />
        </>
      )}
    </div>
  );
}
