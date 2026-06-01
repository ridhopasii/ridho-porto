"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import Confetti from "react-confetti";
import { TbChevronLeft, TbChevronRight, TbEdit, TbTrash, TbPlus, TbCalendarStats } from "react-icons/tb";
import { ModalShell, FormFooter, inputCls, labelCls } from "../AdminFormUI";

interface HabitsManagerProps {
  onMutate?: () => void;
}

export default function HabitsManager({ onMutate }: HabitsManagerProps) {
  const [habits, setHabits] = useState<any[]>([]);
  const [trackers, setTrackers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManage, setShowManage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const [newHabit, setNewHabit] = useState({ name: "", category: "Health", icon: "💧" });
  const [editHabit, setEditHabit] = useState<any>(null);
  const [showHabitModal, setShowHabitModal] = useState(false);
  
  const [historyHabit, setHistoryHabit] = useState<any>(null);
  const [yearlyTrackers, setYearlyTrackers] = useState<any[]>([]);

  useEffect(() => {
    if (editHabit) setShowHabitModal(true);
  }, [editHabit]);

  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [activeTracker, setActiveTracker] = useState<any>({
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
      setTrackers(data.trackers || []);
      const current = data.trackers.find((t: any) => t.date === selectedDate);
      if (current) {
        setActiveTracker(current);
      } else {
        setActiveTracker({ date: selectedDate, checklist: {}, notes: "" });
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const current = trackers.find((t: any) => t.date === selectedDate);
    if (current) {
      setActiveTracker(current);
    } else {
      setActiveTracker({ date: selectedDate, checklist: {}, notes: "" });
    }
  }, [selectedDate, trackers]);

  const persistTracker = useCallback(async (trackerData: any) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_tracker", payload: trackerData }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      
      setTrackers(prev => {
        const idx = prev.findIndex(t => t.date === trackerData.date);
        if (idx >= 0) {
          const newArr = [...prev];
          newArr[idx] = trackerData;
          return newArr;
        }
        return [...prev, trackerData];
      });
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
    const checklist = activeTracker.checklist || {};
    const isChecked = !checklist[habitId];
    const newChecklist = {
      ...checklist,
      [habitId]: isChecked,
    };
    const updated = { ...activeTracker, checklist: newChecklist };
    setActiveTracker(updated);
    scheduleAutoSave(updated);

    const checkedCount = Object.values(newChecklist).filter(Boolean).length;
    if (checkedCount === habits.length && habits.length > 0 && isChecked) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); 
    }
  };

  const handleCheckAll = () => {
    if (habits.length === 0) return;
    const newChecklist = { ...activeTracker.checklist };
    habits.forEach(h => {
      newChecklist[h.id] = true;
    });
    const updated = { ...activeTracker, checklist: newChecklist };
    setActiveTracker(updated);
    scheduleAutoSave(updated);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000); 
  };

  const handleNotesChange = (notes: string) => {
    const updated = { ...activeTracker, notes };
    setActiveTracker(updated);
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
      setShowHabitModal(false);
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

  const loadYearlyHistory = async (habit: any) => {
    setHistoryHabit(habit);
    const toastId = toast.loading("Memuat data 1 tahun...");
    try {
      const res = await fetch("/api/admin/habits?limit=365");
      const data = await res.json();
      setYearlyTrackers(data.trackers);
      toast.success("Riwayat siap", { id: toastId });
    } catch (e) {
      toast.error("Gagal", { id: toastId });
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

  const checklist = activeTracker.checklist || {};
  const checkedCount = Object.values(checklist).filter(Boolean).length;
  const totalHabits = habits.length;

  const calculateStreak = () => {
    if (habits.length === 0 || trackers.length === 0) return 0;
    let streak = 0;
    let checkDate = new Date(todayStr); 
    
    for (let i = 0; i < 60; i++) { 
      const dateString = checkDate.toISOString().split("T")[0];
      const trackerForDate = trackers.find(t => t.date === dateString);
      
      let is100Percent = false;
      if (trackerForDate) {
        const cCount = Object.values(trackerForDate.checklist || {}).filter(Boolean).length;
        if (cCount === habits.length && habits.length > 0) {
          is100Percent = true;
        }
      }

      if (is100Percent) {
        streak++;
      } else {
        if (i === 0) {
          // Today not done yet, continue checking yesterday without breaking
        } else {
          break;
        }
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return streak;
  };

  const streakCount = calculateStreak();

  const [windowWidth, setWindowWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);

  const heatmapDays = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const dateStr = d.toISOString().split("T")[0];
    const tracker = trackers.find((t: any) => t.date === dateStr);
    let intensity = 0;
    if (tracker && totalHabits > 0) {
      const cCount = Object.values(tracker.checklist || {}).filter(Boolean).length;
      const pct = cCount / totalHabits;
      if (pct >= 1) intensity = 4;
      else if (pct >= 0.75) intensity = 3;
      else if (pct >= 0.5) intensity = 2;
      else if (pct > 0) intensity = 1;
    }
    return { dateStr, intensity, date: d };
  });

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 pb-10">
      {showConfetti && (
        <div className="fixed inset-0 z-[100] pointer-events-none">
          <Confetti width={windowWidth || 1000} height={windowHeight || 800} recycle={false} numberOfPieces={300} />
        </div>
      )}

      {/* HEATMAP / GITHUB STYLE */}
      {habits.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="mb-4 font-semibold dark:text-white flex items-center gap-2">
            🔥 Aktivitas Habit (30 Hari Terakhir)
            {streakCount >= 7 && (
              <span className="ml-auto flex items-center gap-1 text-xs bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full font-bold shadow-sm animate-pulse">
                🏆 {streakCount} Hari Beruntun!
              </span>
            )}
            {streakCount > 0 && streakCount < 7 && (
              <span className="ml-auto text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 px-2 py-1 rounded-full font-bold">
                🔥 Streak: {streakCount}
              </span>
            )}
          </h3>
          <div className="flex flex-wrap gap-1.5 md:gap-2">
            {heatmapDays.map((hd) => {
              const bgColors = [
                "bg-neutral-100 dark:bg-neutral-800",
                "bg-green-200 dark:bg-green-900",
                "bg-green-400 dark:bg-green-700",
                "bg-green-500 dark:bg-green-600",
                "bg-green-600 dark:bg-green-500 shadow-sm ring-1 ring-green-300 dark:ring-green-400",
              ];
              const isSelected = hd.dateStr === selectedDate;
              return (
                <button
                  key={hd.dateStr}
                  onClick={() => setSelectedDate(hd.dateStr)}
                  title={`${new Date(hd.dateStr).toLocaleDateString('id-ID')} - Intensitas: ${hd.intensity}/4`}
                  className={`h-6 w-6 sm:h-8 sm:w-8 rounded-md transition-all ${bgColors[hd.intensity]} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-neutral-900 scale-110 z-10' : 'hover:scale-110'}`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Daily Tracker */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate()-1); setSelectedDate(d.toISOString().split('T')[0]) }} className="p-1 hover:bg-neutral-100 rounded dark:hover:bg-neutral-800"><TbChevronLeft/></button>
              <h3 className="font-semibold dark:text-white">Checklist: {selectedDate === todayStr ? "Hari Ini" : new Date(selectedDate).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}</h3>
              <button onClick={() => { const d = new Date(selectedDate); d.setDate(d.getDate()+1); setSelectedDate(d.toISOString().split('T')[0]) }} className="p-1 hover:bg-neutral-100 rounded dark:hover:bg-neutral-800"><TbChevronRight/></button>
            </div>
            <p className="mt-0.5 text-xs text-neutral-500 flex justify-between items-center w-full">
              <span className={checkedCount === totalHabits && totalHabits > 0 ? "font-semibold text-green-600 dark:text-green-400" : ""}>
                {checkedCount}/{totalHabits} selesai
              </span>
              {checkedCount < totalHabits && totalHabits > 0 && selectedDate === todayStr && (
                <button onClick={handleCheckAll} className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md font-bold hover:bg-blue-200 transition-colors dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/60">
                  Centang Semua
                </button>
              )}
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
                const checked = checklist[h.id] || false;
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
              value={activeTracker.notes || ""}
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
                        onClick={() => loadYearlyHistory(h)}
                        className="p-1 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/30 rounded"
                        title="Riwayat 1 Tahun"
                      >
                        <TbCalendarStats size={16} />
                      </button>
                      <button
                        onClick={() => setEditHabit(h)}
                        className="p-1 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded"
                        title="Edit"
                      >
                        <TbEdit size={16} />
                      </button>
                      <button
                        onClick={() => deleteHabit(h.id)}
                        className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded"
                        title="Hapus"
                      >
                        <TbTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => { setEditHabit(null); setShowHabitModal(true); }}
              className="mt-4 flex items-center gap-2 rounded-xl border-2 border-dashed border-neutral-300 p-4 w-full justify-center text-neutral-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors dark:border-neutral-700 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
            >
              <TbPlus size={20} />
              <span className="font-semibold">Tambah Habit Baru</span>
            </button>
          </div>
        )}
      </div>

      {showHabitModal && (
        <ModalShell
          title={editHabit ? "✏️ Edit Habit" : "✨ Tambah Habit Baru"}
          onClose={() => { setShowHabitModal(false); setTimeout(() => setEditHabit(null), 200); }}
        >
          <form onSubmit={e => { e.preventDefault(); handleHabitSave(); }} className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <label className={labelCls}>Ikon</label>
                <input
                  type="text"
                  placeholder="💧"
                  value={editHabit ? editHabit.icon : newHabit.icon}
                  onChange={(e) =>
                    editHabit
                      ? setEditHabit({ ...editHabit, icon: e.target.value })
                      : setNewHabit({ ...newHabit, icon: e.target.value })
                  }
                  className={`${inputCls} text-center`}
                  required
                />
              </div>
              <div className="col-span-3">
                <label className={labelCls}>Nama Habit</label>
                <input
                  type="text"
                  placeholder="Misal: Minum Air"
                  value={editHabit ? editHabit.name : newHabit.name}
                  onChange={(e) =>
                    editHabit
                      ? setEditHabit({ ...editHabit, name: e.target.value })
                      : setNewHabit({ ...newHabit, name: e.target.value })
                  }
                  className={inputCls}
                  required
                />
              </div>
            </div>
            <FormFooter
              loading={false}
              onClose={() => { setShowHabitModal(false); setTimeout(() => setEditHabit(null), 200); }}
              saveLabel={editHabit ? "Simpan Perubahan" : "Tambahkan"}
            />
          </form>
        </ModalShell>
      )}

      {historyHabit && (
        <ModalShell title={`📅 Riwayat 1 Tahun: ${historyHabit.icon} ${historyHabit.name}`} onClose={() => setHistoryHabit(null)} maxWidth="max-w-4xl">
          <div className="p-4">
            <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
              {Array.from({ length: 365 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (364 - i));
                const dateStr = d.toISOString().split("T")[0];
                const tracker = yearlyTrackers.find((t: any) => t.date === dateStr);
                const isChecked = tracker && tracker.checklist && tracker.checklist[historyHabit.id];
                
                return (
                  <div
                    key={dateStr}
                    title={`${new Date(dateStr).toLocaleDateString('id-ID')} - ${isChecked ? 'Selesai' : 'Kosong'}`}
                    className={`h-3 w-3 sm:h-4 sm:w-4 rounded-sm transition-colors ${
                      isChecked 
                        ? 'bg-green-500 hover:bg-green-400' 
                        : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700'
                    }`}
                  />
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
              <span>Kurang (Kosong)</span>
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-sm bg-neutral-100 dark:bg-neutral-800" />
                <div className="h-3 w-3 rounded-sm bg-green-500" />
              </div>
              <span>Selesai (Centang)</span>
            </div>
          </div>
        </ModalShell>
      )}
    </div>
  );
}
