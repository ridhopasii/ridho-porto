"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function PublicationManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New item state
  const [newItem, setNewItem] = useState({
    title: "",
    outlet: "",
    date: "",
    url: "",
    description: "",
    tags: "",
    imageUrl: "",
    showOnHome: true
  });

  const [isEditing, setIsEditing] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/publications");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setItems(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const toastId = toast.loading("Menyimpan...");
    try {
      const payload = isEditing ? { id: isEditing, ...newItem } : newItem;
      const res = await fetch("/api/admin/publications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");
      toast.success("Berhasil", { id: toastId });
      
      setNewItem({
        title: "", outlet: "", date: "", url: "", description: "", tags: "", imageUrl: "", showOnHome: true
      });
      setIsEditing(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  const handleEdit = (item: any) => {
    setIsEditing(item.id);
    setNewItem({
      title: item.title,
      outlet: item.outlet,
      date: item.date,
      url: item.url || "",
      description: item.description || "",
      tags: item.tags || "",
      imageUrl: item.imageUrl || "",
      showOnHome: item.showOnHome ?? true,
    });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Hapus publikasi ini?")) return;
    const toastId = toast.loading("Menghapus...");
    try {
      const res = await fetch(`/api/admin/publications?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Dihapus", { id: toastId });
      fetchData();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  if (loading) return <div className="py-10 text-center">Loading...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="mb-4 font-semibold dark:text-white">{isEditing ? "Edit Publikasi" : "Tambah Publikasi Baru"}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-neutral-500">Judul Artikel/Publikasi</label>
            <input type="text" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:text-white" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Nama Media/Outlet</label>
            <input type="text" value={newItem.outlet} onChange={e => setNewItem({...newItem, outlet: e.target.value})} className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:text-white" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Tanggal Publikasi</label>
            <input type="text" placeholder="Misal: 12 April 2026" value={newItem.date} onChange={e => setNewItem({...newItem, date: e.target.value})} className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:text-white" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-neutral-500">URL Tautan Asli</label>
            <input type="text" value={newItem.url} onChange={e => setNewItem({...newItem, url: e.target.value})} className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:text-white" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-neutral-500">Deskripsi Singkat</label>
            <textarea rows={3} value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:text-white" />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={handleSave} disabled={!newItem.title || !newItem.outlet} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-50">
            {isEditing ? "Perbarui" : "Simpan"}
          </button>
          {isEditing && (
            <button onClick={() => { setIsEditing(null); setNewItem({ title: "", outlet: "", date: "", url: "", description: "", tags: "", imageUrl: "", showOnHome: true }); }} className="rounded-lg bg-neutral-200 px-4 py-2 font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
              Batal
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold dark:text-white">Daftar Publikasi</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col justify-between rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div>
                <p className="text-xs font-semibold uppercase text-blue-500">{item.outlet}</p>
                <h4 className="mt-1 font-bold dark:text-white leading-tight">{item.title}</h4>
                <p className="mt-2 text-xs text-neutral-500">{item.date}</p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
                <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">Lihat Link</a>
                <div className="flex gap-2 text-xs">
                  <button onClick={() => handleEdit(item)} className="text-neutral-500 hover:text-blue-500">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-600">Hapus</button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="col-span-full text-sm text-neutral-500">Belum ada publikasi.</p>}
        </div>
      </div>
    </div>
  );
}
