"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

interface HabitsManagerProps {
  onMutate?: () => void;
}

export default function HabitsManager({ onMutate }: HabitsManagerProps) {
  const [habits, setHabits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManage, setShowManage] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newHabit, setNewHabit] = useState({ name: "", category: "Health", icon: "💧" });
  const [editHabit, setEditHabit] = useState<any>(null);

  const todayStr = new Date().toISOString().split("T")[0];
  const [todayTracker, setTodayTracker] = useState<any>({
    date: todayStr,
    checklist: {},
    notes: "",
  });

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetchData();
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/habits");
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setHabits(data.habits);
      const today = data.trackers.find((t: any) => t.date === todayStr);
      if (today) setTodayTracker(today);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const persistTracker = useCallback(async (trackerData: any) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_tracker", payload: trackerData }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
    } catch {
      toast.error("Gagal menyimpan tracker");
    } finally {
      setSaving(false);
    }
  }, []);

  const scheduleAutoSave = (updated: any) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => persistTracker(updated), 800);
  };

  const toggleHabit = (habitId: string) => {
    const newChecklist = {
      ...todayTracker.checklist,
      [habitId]: !todayTracker.checklist[habitId],
    };
    const updated = { ...todayTracker, checklist: newChecklist };
    setTodayTracker(updated);
    scheduleAutoSave(updated);
  };

  const handleNotesChange = (notes: string) => {
    const updated = { ...todayTracker, notes };
    setTodayTracker(updated);
    scheduleAutoSave(updated);
  };

  const handleHabitSave = async () => {
    const toastId = toast.loading(editHabit ? "Menyimpan..." : "Menambahkan...");
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
      onMutate?.();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const deleteHabit = async (id: string) => {
    if (!window.confirm("Yakin ingin menghapus habit ini?")) return;
    const toastId = toast.loading("Menghapus...");
    try {
      const res = await fetch(`/api/admin/habits?action=delete_habit&id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      toast.success("Berhasil dihapus", { id: toastId });
      fetchData();
      onMutate?.();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  if (loading)
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-14 rounded-xl bg-neutral-100 dark:bg-neutral-800" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800" />
        ))}
      </div>
    );

  const checkedCount = Object.values(todayTracker.checklist).filter(Boolean).length;
  const totalHabits = habits.length;

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
      {/* Daily Tracker */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <div>
            <h3 className="font-semibold dark:text-white">Checklist Hari Ini</h3>
            <p className="mt-0.5 text-xs text-neutral-500">
              {todayStr} ·{" "}
              <span className={checkedCount === totalHabits && totalHabits > 0 ? "font-semibold text-green-600 dark:text-green-400" : ""}>
                {checkedCount}/{totalHabits} selesai
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {saving ? (
              <span className="animate-pulse text-neutral-400">Menyimpan...</span>
            ) : checkedCount > 0 ? (
              <span className="text-green-500">✓ Tersimpan otomatis</span>
            ) : null}
          </div>
        </div>

        <div className="p-5">
          {totalHabits === 0 ? (
            <p className="py-6 text-center text-sm text-neutral-400">
              Belum ada habit. Tambahkan di bagian &ldquo;Kelola Habit&rdquo; di bawah.
            </p>
          ) : (
            <div className="space-y-2">
              {habits.map((h) => {
                const checked = todayTracker.checklist[h.id] || false;
                return (
                  <div
                    key={h.id}
                    onClick={() => toggleHabit(h.id)}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition-all duration-150 select-none ${
                      checked
                        ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                        : "border-neutral-200 hover:border-blue-200 dark:border-neutral-700 dark:hover:border-blue-800"
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-all ${
                        checked
                          ? "border-blue-600 bg-blue-600"
                          : "border-neutral-300 dark:border-neutral-600"
                      }`}
                    >
                      {checked && <span className="text-[10px] font-bold text-white">✓</span>}
                    </div>
                    <span
                      className={`text-sm font-medium transition-colors ${
                        checked
                          ? "text-blue-800 dark:text-blue-300"
                          : "text-neutral-700 dark:text-neutral-200"
                      }`}
                    >
                      {h.icon} {h.name}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4">
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              Catatan harian
            </label>
            <textarea
              value={todayTracker.notes || ""}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Refleksi atau catatan hari ini..."
              className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm outline-none transition-colors focus:border-blue-300 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Manage Habits — collapsible */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <button
          type="button"
          onClick={() => setShowManage((v) => !v)}
          className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
        >
          <span className="font-semibold dark:text-white">
            Kelola Habit
            <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
              {totalHabits}
            </span>
          </span>
          <span className="text-sm text-neutral-400">{showManage ? "▲" : "▼"}</span>
        </button>

        {showManage && (
          <div className="border-t border-neutral-100 p-5 dark:border-neutral-800">
            {habits.length > 0 && (
              <div className="mb-4 flex flex-col gap-1.5">
                {habits.map((h) => (
                  <div
                    key={h.id}
                    className="group flex items-center justify-between rounded-xl border border-neutral-100 px-3 py-2.5 text-sm dark:border-neutral-800"
                  >
                    <span className="dark:text-white">
                      {h.icon} {h.name}
                    </span>
                    <div className="hidden items-center gap-2 group-hover:flex">
                      <button
                        onClick={() => setEditHabit(h)}
                        className="text-xs font-semibold text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteHabit(h.id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-700"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-neutral-100 pt-4 dark:border-neutral-800">
              <h4 className="mb-3 text-sm font-semibold dark:text-white">
                {editHabit ? "Edit Habit" : "Tambah Habit Baru"}
              </h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ikon"
                  value={editHabit ? editHabit.icon : newHabit.icon}
                  onChange={(e) =>
                    editHabit
                      ? setEditHabit({ ...editHabit, icon: e.target.value })
                      : setNewHabit({ ...newHabit, icon: e.target.value })
                  }
                  className="w-16 rounded-lg border px-2 py-2 text-center text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Nama Habit"
                  value={editHabit ? editHabit.name : newHabit.name}
                  onChange={(e) =>
                    editHabit
                      ? setEditHabit({ ...editHabit, name: e.target.value })
                      : setNewHabit({ ...newHabit, name: e.target.value })
                  }
                  className="flex-1 rounded-lg border px-2 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                />
                <button
                  onClick={handleHabitSave}
                  disabled={editHabit ? !editHabit.name : !newHabit.name}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {editHabit ? "Simpan" : "Tambah"}
                </button>
                {editHabit && (
                  <button
                    onClick={() => setEditHabit(null)}
                    className="rounded-lg bg-neutral-200 px-3 py-2 text-sm dark:bg-neutral-800 dark:text-white"
                  >
                    Batal
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
