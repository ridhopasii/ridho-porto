"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function ProductivityManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New item state
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
        body: JSON.stringify(newItem),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");
      toast.success("Berhasil", { id: toastId });
      
      setNewItem({
        date: new Date().toISOString().split('T')[0],
        tasks: "",
        dayType: "Work",
        pomodoroMinutes: 0,
        mood: "Happy",
        goals: "",
      });
      fetchData();
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  if (loading) return <div className="py-10 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="mb-4 font-semibold dark:text-white">Input Produktivitas Harian</h3>
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
        <button onClick={handleSave} className="mt-4 w-full rounded-lg bg-blue-600 py-2 font-medium text-white">
          Simpan Rekor Hari Ini
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold dark:text-white">Riwayat Terakhir</h3>
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex justify-between">
              <span className="font-bold dark:text-white">{item.date}</span>
              <span className="text-xs font-medium uppercase text-blue-500">{item.dayType}</span>
            </div>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Tasks: {item.tasks}</p>
            <div className="mt-2 flex gap-4 text-xs text-neutral-500">
              <span>⏱️ {item.pomodoroMinutes} menit</span>
              <span>😊 Mood: {item.mood}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
