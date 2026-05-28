"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function ProductivityManager({ activeTab = "ringkasan" }: { activeTab?: "ringkasan" | "riwayat" }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // item state (for create and edit)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    date: new Date().toISOString().split('T')[0],
    tasks: "",
    dayType: "Work",
    pomodoroMinutes: 0,
    mood: "Happy",
    goals: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/productivity");
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
      const res = await fetch("/api/admin/productivity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...newItem } : newItem),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");
      toast.success("Berhasil disave", { id: toastId });
      
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus rekor produktivitas ini?")) return;
    const toastId = toast.loading("Menghapus...");
    try {
      const res = await fetch(`/api/admin/productivity?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Berhasil dihapus", { id: toastId });
      fetchData();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const editItem = (item: any) => {
    setEditingId(item.id);
    setNewItem({
      date: item.date,
      tasks: item.tasks || "",
      dayType: item.dayType || "Work",
      pomodoroMinutes: item.pomodoroMinutes || 0,
      mood: item.mood || "Happy",
      goals: item.goals || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setNewItem({
      date: new Date().toISOString().split('T')[0],
      tasks: "",
      dayType: "Work",
      pomodoroMinutes: 0,
      mood: "Happy",
      goals: "",
    });
  };

  if (loading) return <div className="py-10 text-center">Loading...</div>;

  const totalPomodoro = items.reduce((sum, item) => sum + (item.pomodoroMinutes || 0), 0);
  const productiveDays = items.filter(i => i.dayType === 'Work' || i.dayType === 'Study').length;
  const avgPomodoro = items.length > 0 ? Math.round(totalPomodoro / items.length) : 0;

  return (
    <div className="space-y-6">

      {activeTab === "ringkasan" && (
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h4 className="text-xs font-semibold text-neutral-500 uppercase">Total Pomodoro</h4>
            <p className="mt-2 text-3xl font-black text-neutral-900 dark:text-white">{totalPomodoro} <span className="text-sm font-medium text-neutral-500">Menit</span></p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h4 className="text-xs font-semibold text-neutral-500 uppercase">Hari Produktif</h4>
            <p className="mt-2 text-3xl font-black text-neutral-900 dark:text-white">{productiveDays} <span className="text-sm font-medium text-neutral-500">Hari</span></p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h4 className="text-xs font-semibold text-neutral-500 uppercase">Rata-rata Pomodoro</h4>
            <p className="mt-2 text-3xl font-black text-neutral-900 dark:text-white">{avgPomodoro} <span className="text-sm font-medium text-neutral-500">Menit/Hari</span></p>
          </div>
        </div>
      )}

      {activeTab === "riwayat" && (
        <>
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="mb-4 font-semibold dark:text-white">{editingId ? "Edit Produktivitas Harian" : "Input Produktivitas Harian"}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Tanggal</label>
            <input type="date" value={newItem.date} onChange={e => setNewItem({...newItem, date: e.target.value})} className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:text-white" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Tipe Hari</label>
            <select value={newItem.dayType} onChange={e => setNewItem({...newItem, dayType: e.target.value})} className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:text-white">
              <option value="Work">Work</option>
              <option value="Rest">Rest</option>
              <option value="Travel">Travel</option>
              <option value="Study">Study</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-medium text-neutral-500">Tugas yang Diselesaikan (Pisahkan dengan koma)</label>
            <input type="text" value={newItem.tasks} onChange={e => setNewItem({...newItem, tasks: e.target.value})} placeholder="Coding, Meeting, Review" className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:text-white" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Menit Pomodoro</label>
            <input type="number" value={newItem.pomodoroMinutes || ""} onChange={e => setNewItem({...newItem, pomodoroMinutes: Number(e.target.value)})} className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:text-white" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Mood</label>
            <input type="text" value={newItem.mood} onChange={e => setNewItem({...newItem, mood: e.target.value})} className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:text-white" />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={handleSave} className="flex-1 rounded-lg bg-blue-600 py-2 font-medium text-white">
            {editingId ? "Simpan Perubahan" : "Simpan Rekor Hari Ini"}
          </button>
          {editingId && (
            <button onClick={resetForm} className="rounded-lg bg-neutral-200 px-6 py-2 font-medium dark:bg-neutral-800 dark:text-white">
              Batal
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold dark:text-white">Riwayat Terakhir</h3>
        {items.map((item) => (
          <div key={item.id} className="group rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex justify-between">
              <span className="font-bold dark:text-white">{new Date(item.date).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium uppercase text-blue-500">{item.dayType}</span>
                <div className="hidden gap-2 group-hover:flex">
                  <button onClick={() => editItem(item)} className="text-xs font-semibold text-neutral-500 hover:text-blue-500 dark:text-neutral-400">Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="text-xs font-semibold text-neutral-500 hover:text-red-500 dark:text-neutral-400">Hapus</button>
                </div>
              </div>
            </div>
            <div className="mt-3">
              {(() => {
                try {
                  const parsedTasks = JSON.parse(item.tasks);
                  if (Array.isArray(parsedTasks)) {
                    return (
                      <div className="flex flex-wrap gap-1.5">
                        {parsedTasks.map((t: any, i: number) => (
                          <span key={i} className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md border ${
                            t.completed 
                              ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50" 
                              : "bg-neutral-50 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700"
                          }`}>
                            {t.completed ? "✓" : "○"} {t.name}
                          </span>
                        ))}
                      </div>
                    );
                  }
                } catch (e) {
                  // Fallback if not valid JSON
                }
                return <p className="text-sm text-neutral-600 dark:text-neutral-400">Tasks: {item.tasks}</p>;
              })()}
            </div>
            <div className="mt-2 flex gap-4 text-xs text-neutral-500 dark:text-neutral-400">
              <span>⏱️ {item.pomodoroMinutes} menit</span>
              <span>😊 Mood: {item.mood}</span>
            </div>
          </div>
        ))}
      </div>
        </>
      )}
    </div>
  );
}
