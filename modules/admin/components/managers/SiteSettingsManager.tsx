"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function SiteSettingsManager() {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // local state for editing
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/site-settings");
      if (!res.ok) throw new Error("Gagal mengambil data pengaturan");
      const data = await res.json();
      setSettings(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string, value: string) => {
    const toastId = toast.loading("Menyimpan...");
    try {
      const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");
      toast.success("Berhasil disimpan", { id: toastId });
      fetchSettings();
      if (isAdding) {
        setIsAdding(false);
        setNewKey("");
        setNewValue("");
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Hapus pengaturan '${key}'?`)) return;
    const toastId = toast.loading("Menghapus...");
    try {
      const res = await fetch(`/api/admin/site-settings?key=${key}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Berhasil dihapus", { id: toastId });
      fetchSettings();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">{[1,2,3].map(i=><div key={i} className="h-20 rounded-xl bg-neutral-100 dark:bg-neutral-800"/>)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          Kelola konfigurasi global website. (Contoh: site_title, seo_description)
        </p>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          {isAdding ? "Batal" : "+ Tambah Pengaturan"}
        </button>
      </div>

      {isAdding && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="mb-4 font-semibold dark:text-white">Tambah Kunci Baru</h3>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-neutral-500">Key</label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="misal: site_title"
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-neutral-500">Value</label>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Nilainya"
                className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
              />
            </div>
            <button
              onClick={() => handleSave(newKey, newValue)}
              disabled={!newKey || !newValue}
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-white dark:text-black"
            >
              Simpan
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {settings.map((item) => (
          <div
            key={item.key}
            className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-end"
          >
            <div className="w-full sm:w-1/3">
              <label className="mb-1 block text-xs font-medium text-neutral-500">Key</label>
              <input
                type="text"
                value={item.key}
                disabled
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950"
              />
            </div>
            <div className="w-full flex-1">
              <label className="mb-1 block text-xs font-medium text-neutral-500">Value</label>
              {item.key === "site_logo" ? (
                <div className="flex items-center gap-4">
                  {item.value && (
                    <div className="h-10 w-10 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-100 dark:bg-neutral-950 flex-shrink-0">
                      <img src={item.value} alt="Site Logo" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const toastId = toast.loading("Mengunggah & menyimpan logo...");
                        try {
                          const formData = new FormData();
                          formData.append("file", file);
                          formData.append("path", "site-logo");
                          const uploadRes = await fetch("/api/admin/upload", {
                            method: "POST",
                            body: formData,
                          });
                          if (!uploadRes.ok) {
                            const errData = await uploadRes.json();
                            throw new Error(errData.error || "Gagal mengunggah gambar logo");
                          }
                          const uploadData = await uploadRes.json();
                          
                          // Save the URL as value
                          const saveRes = await fetch("/api/admin/site-settings", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ key: item.key, value: uploadData.url }),
                          });
                          if (!saveRes.ok) throw new Error("Gagal menyimpan logo ke database");
                          toast.success("Logo berhasil diperbarui!", { id: toastId });
                          fetchSettings();
                        } catch (err: any) {
                          toast.error(err.message, { id: toastId });
                        }
                      }
                    }}
                    className="flex-1 text-sm text-neutral-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border file:border-neutral-200 dark:file:border-neutral-800 file:text-xs file:font-semibold file:bg-neutral-50 dark:file:bg-neutral-800 file:text-neutral-700 dark:file:text-neutral-200 hover:file:bg-neutral-100 dark:hover:file:bg-neutral-700 cursor-pointer"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  defaultValue={item.value}
                  onBlur={(e) => {
                    if (e.target.value !== item.value) {
                      handleSave(item.key, e.target.value);
                    }
                  }}
                  className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none transition focus:border-blue-500 dark:border-neutral-700 dark:text-white"
                />
              )}
            </div>
            <button
              onClick={() => handleDelete(item.key)}
              className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/30 dark:text-red-500 dark:hover:bg-red-900/10"
            >
              Hapus
            </button>
          </div>
        ))}
        {settings.length === 0 && !isAdding && (
          <p className="py-4 text-center text-sm text-neutral-500">Belum ada pengaturan tersimpan.</p>
        )}
      </div>
    </div>
  );
}
