"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function HabitsManager({ activeTab = "tracker" }: { activeTab?: "tracker" | "kebiasaan" }) {
  const [habits, setHabits] = useState<any[]>([]);
  const [trackers, setTrackers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newHabit, setNewHabit] = useState({ name: "", category: "Health", icon: "💧" });
  const [editHabit, setEditHabit] = useState<any>(null);
  
  // Today's tracker
  const todayStr = new Date().toISOString().split('T')[0];
  const [todayTracker, setTodayTracker] = useState<any>({ date: todayStr, checklist: {}, notes: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/habits");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setHabits(data.habits);
      setTrackers(data.trackers);

      const today = data.trackers.find((t: any) => t.date === todayStr);
      if (today) {
        setTodayTracker(today);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHabitSave = async () => {
    const toastId = toast.loading(editHabit ? "Menyimpan habit..." : "Membuat habit...");
    try {
      if (editHabit) {
        const res = await fetch("/api/admin/habits", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "update_habit", payload: editHabit }),
        });
        if (!res.ok) throw new Error("Gagal");
        toast.success("Habit diperbarui", { id: toastId });
        setEditHabit(null);
      } else {
        const res = await fetch("/api/admin/habits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "create_habit", payload: newHabit }),
        });
        if (!res.ok) throw new Error("Gagal");
        toast.success("Habit ditambahkan", { id: toastId });
        setNewHabit({ name: "", category: "Health", icon: "💧" });
      }
      fetchData();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const deleteHabit = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus habit ini? (Data checklist sebelumnya mungkin terpengaruh)")) return;
    const toastId = toast.loading("Menghapus...");
    try {
      const res = await fetch(`/api/admin/habits?action=delete_habit&id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Berhasil dihapus", { id: toastId });
      fetchData();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const saveTracker = async () => {
    const toastId = toast.loading("Menyimpan tracker...");
    try {
      const res = await fetch("/api/admin/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_tracker", payload: todayTracker }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      toast.success("Tracker disimpan", { id: toastId });
      fetchData();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const toggleHabit = (habitId: string) => {
    const currentList = { ...todayTracker.checklist };
    currentList[habitId] = !currentList[habitId];
    setTodayTracker({ ...todayTracker, checklist: currentList });
  };

  if (loading) return <div className="py-10 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {/* HABIT CONFIG */}
        {activeTab === "kebiasaan" && (
          <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="font-semibold dark:text-white">Daftar Habit</h3>
            <div className="flex flex-col gap-2">
              {habits.map((h) => (
                <div key={h.id} className="group flex items-center justify-between rounded border border-neutral-100 p-2 text-sm dark:border-neutral-800 dark:text-white">
                  <div>
                    <span>{h.icon}</span> <span className="ml-2">{h.name}</span>
                  </div>
                  <div className="hidden gap-2 group-hover:flex">
                    <button onClick={() => setEditHabit(h)} className="text-xs text-blue-500">Edit</button>
                    <button onClick={() => deleteHabit(h.id)} className="text-xs text-red-500">Del</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-neutral-100 pt-4 dark:border-neutral-800">
              <h4 className="mb-2 text-sm font-medium dark:text-white">{editHabit ? "Edit Habit" : "Tambah Habit"}</h4>
              <div className="flex gap-2">
                <input 
                  type="text" placeholder="Ikon" value={editHabit ? editHabit.icon : newHabit.icon} 
                  onChange={e => editHabit ? setEditHabit({...editHabit, icon: e.target.value}) : setNewHabit({...newHabit, icon: e.target.value})} 
                  className="w-16 rounded border px-2 py-1 text-sm dark:border-neutral-700 dark:bg-transparent" 
                />
                <input 
                  type="text" placeholder="Nama Habit" value={editHabit ? editHabit.name : newHabit.name} 
                  onChange={e => editHabit ? setEditHabit({...editHabit, name: e.target.value}) : setNewHabit({...newHabit, name: e.target.value})} 
                  className="flex-1 rounded border px-2 py-1 text-sm dark:border-neutral-700 dark:bg-transparent" 
                />
                <button onClick={handleHabitSave} disabled={editHabit ? !editHabit.name : !newHabit.name} className="rounded bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-50">
                  {editHabit ? "Save" : "Add"}
                </button>
                {editHabit && <button onClick={() => setEditHabit(null)} className="rounded bg-neutral-200 px-3 py-1 text-sm dark:bg-neutral-800 dark:text-white">Batal</button>}
              </div>
            </div>
          </div>
        )}

        {/* TODAY TRACKER */}
        {activeTab === "tracker" && (
          <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <h3 className="font-semibold dark:text-white">Checklist Hari Ini ({todayStr})</h3>
            <div className="space-y-3">
              {habits.map((h) => (
                <label key={h.id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-100 p-3 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                  <input 
                    type="checkbox" 
                    checked={todayTracker.checklist[h.id] || false} 
                    onChange={() => toggleHabit(h.id)}
                    className="h-5 w-5 rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium dark:text-white">{h.icon} {h.name}</span>
                </label>
              ))}
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Catatan Hari Ini</label>
                <textarea 
                  value={todayTracker.notes || ""} 
                  onChange={e => setTodayTracker({...todayTracker, notes: e.target.value})}
                  className="w-full rounded border px-3 py-2 text-sm dark:border-neutral-700 dark:bg-transparent"
                  rows={3}
                />
              </div>
              <button onClick={saveTracker} className="w-full rounded bg-blue-600 py-2 font-medium text-white">Simpan Tracker</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
