"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getDayType, getCategorizedTasksForDay } from "@/common/constants/productivityBlocks";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ProductivityManager({
  activeTab = "harian",
  onMutate,
}: {
  activeTab?: "harian" | "riwayat";
  onMutate?: () => void;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [draftTasks, setDraftTasks] = useState<{ name: string; completed: boolean }[]>([]);

  // item state (for create and edit riwayat manual)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    date: new Date().toISOString().split('T')[0],
    tasks: "",
    dayType: getDayType(new Date().toISOString().split('T')[0]),
    pomodoroMinutes: 0,
    mood: "🙂",
    goals: "",
  });

  const today = new Date().toISOString().split('T')[0];
  const todayItem = items.find(item => item.date === today);

  // Modals state
  const [period, setPeriod] = useState<"7d" | "30d">("7d");
  const [showTimer, setShowTimer] = useState(false);
  const [showMood, setShowMood] = useState(false);
  const [showGoals, setShowGoals] = useState(false);

  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const MOODS = ['😢', '😐', '🙂', '😊', '🤩'];
  const [tempGoals, setTempGoals] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-fill dayType when date changes (non-edit mode)
  useEffect(() => {
    if (!editingId) {
      setNewItem((prev) => ({ ...prev, dayType: getDayType(prev.date) }));
    }
  }, [newItem.date, editingId]);

  // Auto-update draft tasks when dayType changes (non-edit mode)
  useEffect(() => {
    if (!editingId) {
      const cats = getCategorizedTasksForDay(newItem.dayType);
      setDraftTasks(
        [...cats.block1, ...cats.block2, ...cats.block3].map((name) => ({
          name,
          completed: false,
        }))
      );
    }
  }, [newItem.dayType, editingId]);

  useEffect(() => {
    if (!loading && !todayItem) {
      // Auto create today's record
      const dayType = getDayType(today);
      const allTasks = getCategorizedTasksForDay(dayType);
      const initialTasks = [
        ...allTasks.block1,
        ...allTasks.block2,
        ...allTasks.block3
      ].map(name => ({ name, completed: false }));

      const initialNewItem = {
        date: today,
        dayType: dayType,
        tasks: JSON.stringify(initialTasks),
        pomodoroMinutes: 0,
        mood: "🙂",
        goals: "",
      };

      fetch("/api/admin/productivity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(initialNewItem),
      }).then(res => res.json()).then(data => {
        setItems(prev => [data, ...prev]);
      }).catch(err => {
        console.error("Failed to init today record", err);
      });
    }
  }, [loading, todayItem, today]);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        if (timerSeconds === 0) {
          if (timerMinutes === 0) {
            setTimerRunning(false);
            clearInterval(interval);
            addPomodoro(25); // automatically add 25 min
            toast.success("Pomodoro selesai!");
            setTimerMinutes(25);
            setShowTimer(false);
          } else {
            setTimerMinutes(m => m - 1);
            setTimerSeconds(59);
          }
        } else {
          setTimerSeconds(s => s - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerMinutes, timerSeconds]);

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
      const payload = {
        ...(editingId ? { id: editingId } : {}),
        ...newItem,
        tasks: JSON.stringify(draftTasks),
      };
      const res = await fetch("/api/admin/productivity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal menyimpan");
      toast.success("Berhasil disave", { id: toastId });

      resetForm();
      fetchData();
      onMutate?.();
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
      onMutate?.();
    } catch (e: any) {
      toast.error(e.message, { id: toastId });
    }
  };

  const editItem = (item: any) => {
    setEditingId(item.id);
    setNewItem({
      date: item.date,
      tasks: item.tasks || "",
      dayType: item.dayType || getDayType(item.date),
      pomodoroMinutes: item.pomodoroMinutes || 0,
      mood: item.mood || "🙂",
      goals: item.goals || "",
    });
    try {
      const parsed = JSON.parse(item.tasks || "[]");
      setDraftTasks(Array.isArray(parsed) ? parsed : []);
    } catch {
      setDraftTasks([]);
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setDraftTasks([]); // will be repopulated by useEffect via dayType
    setNewItem({
      date: new Date().toISOString().split('T')[0],
      tasks: "",
      dayType: getDayType(new Date().toISOString().split('T')[0]),
      pomodoroMinutes: 0,
      mood: "🙂",
      goals: "",
    });
  };

  const toggleTask = async (taskName: string) => {
    if (!todayItem) return;
    
    let parsedTasks = [];
    try {
      parsedTasks = JSON.parse(todayItem.tasks);
    } catch (e) {
      return;
    }

    const newTasks = parsedTasks.map((t: any) => 
      t.name === taskName ? { ...t, completed: !t.completed } : t
    );

    const updatedItem = { ...todayItem, tasks: JSON.stringify(newTasks) };
    setItems(items.map(item => item.id === todayItem.id ? updatedItem : item));

    try {
      await fetch("/api/admin/productivity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: todayItem.id, tasks: JSON.stringify(newTasks) }),
      });
    } catch (e) {
      toast.error("Gagal menyimpan progress");
    }
  };

  const addPomodoro = async (minutes: number = 25) => {
    if (!todayItem) return;
    const newMinutes = (todayItem.pomodoroMinutes || 0) + minutes;
    const updatedItem = { ...todayItem, pomodoroMinutes: newMinutes };
    setItems(items.map(item => item.id === todayItem.id ? updatedItem : item));
    
    try {
      await fetch("/api/admin/productivity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: todayItem.id, pomodoroMinutes: newMinutes }),
      });
    } catch (e) {
      toast.error("Gagal menyimpan pomodoro");
    }
  };

  const saveMood = async (mood: string) => {
    if (!todayItem) return;
    const updatedItem = { ...todayItem, mood };
    setItems(items.map(item => item.id === todayItem.id ? updatedItem : item));
    
    try {
      await fetch("/api/admin/productivity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: todayItem.id, mood }),
      });
      toast.success("Mood tersimpan");
      setShowMood(false);
    } catch (e) {
      toast.error("Gagal menyimpan mood");
    }
  };

  const saveGoals = async () => {
    if (!todayItem) return;
    const updatedItem = { ...todayItem, goals: tempGoals };
    setItems(items.map(item => item.id === todayItem.id ? updatedItem : item));
    
    try {
      await fetch("/api/admin/productivity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: todayItem.id, goals: tempGoals }),
      });
      toast.success("Goals tersimpan");
      setShowGoals(false);
    } catch (e) {
      toast.error("Gagal menyimpan goals");
    }
  };

  const calculateStreak = () => {
    let streak = 0;
    const sorted = [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (const item of sorted) {
      // Allow today to not break the streak if it's incomplete but older days must be complete
      let rate = 0;
      try {
        const parsed = JSON.parse(item.tasks || "[]");
        const completed = parsed.filter((t: any) => t.completed).length;
        rate = parsed.length > 0 ? Math.round((completed / parsed.length) * 100) : 0;
      } catch(e) {}

      if (item.date === today && rate < 80) {
        continue; // skip today if it's not yet completed
      }
      if (rate >= 80) streak++;
      else break;
    }
    return streak;
  };

  const getChartData = () => {
    const days = period === "7d" ? 7 : 30;
    const labels = [];
    const dataPoints = [];
    const bgColors = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      labels.push(period === "7d" ? d.toLocaleDateString("id-ID", { weekday: "short" }) : d.getDate().toString());
      
      const dayItem = items.find(item => item.date === dateStr);
      let rate = 0;
      if (dayItem) {
        try {
          const parsed = JSON.parse(dayItem.tasks || "[]");
          const completed = parsed.filter((t: any) => t.completed).length;
          rate = parsed.length > 0 ? Math.round((completed / parsed.length) * 100) : 0;
        } catch (e) {}
      }
      dataPoints.push(rate);
      bgColors.push(rate >= 80 ? '#16a34a' : rate >= 60 ? '#2563eb' : rate >= 40 ? '#ca8a04' : rate > 0 ? '#f87171' : '#3f3f46');
    }

    return {
      labels,
      datasets: [
        {
          label: 'Completion Rate (%)',
          data: dataPoints,
          backgroundColor: bgColors,
          borderRadius: 4,
        }
      ]
    };
  };

  if (loading)
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-neutral-100 dark:bg-neutral-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 rounded-xl bg-neutral-100 dark:bg-neutral-800" />
          ))}
        </div>
      </div>
    );

  let parsedTasks: any[] = [];
  let completionRate = 0;
  let completedTasks = 0;
  let totalTasks = 0;

  if (todayItem) {
    try { parsedTasks = JSON.parse(todayItem.tasks || "[]"); } catch (e) {}
    completedTasks = parsedTasks.filter((t: any) => t.completed).length;
    totalTasks = parsedTasks.length;
    completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  }
  
  const dayType = todayItem ? getDayType(todayItem.date) : "Work";
  const categories = getCategorizedTasksForDay(dayType);
  const streakCount = calculateStreak();

  const renderBlock = (title: string, subtitle: string, tasksToRender: string[], bgHeaderClass: string) => (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
       <div className={`${bgHeaderClass} p-4 text-white`}>
         <h4 className="font-bold text-lg">{title}</h4>
         <p className="text-sm opacity-80">{subtitle}</p>
       </div>
       <div className="p-4 space-y-2">
         {tasksToRender.map(taskName => {
           const taskData = parsedTasks.find((t: any) => t.name === taskName);
           const isCompleted = taskData?.completed || false;
           return (
             <div 
               key={taskName} 
               onClick={() => toggleTask(taskName)}
               className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                 isCompleted 
                   ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800' 
                   : 'border-neutral-200 hover:border-blue-200 dark:border-neutral-700 dark:hover:border-blue-800'
               }`}
             >
               <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                 isCompleted ? 'bg-blue-600 border-blue-600' : 'border-neutral-300 dark:border-neutral-600'
               }`}>
                 {isCompleted && <span className="text-white text-xs">✓</span>}
               </div>
               <span className={`text-sm ${isCompleted ? 'text-blue-800 font-medium dark:text-blue-300' : 'text-neutral-700 dark:text-neutral-300'}`}>
                 {taskName}
               </span>
             </div>
           );
         })}
       </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300 relative pb-10">
      
      {/* 1. PROGRESS OVERVIEW */}
      {activeTab === "harian" && todayItem && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-center items-center">
            <div className="relative w-20 h-20 mb-2">
               <svg className="w-20 h-20 -rotate-90">
                 <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="none" className="text-neutral-100 dark:text-neutral-800" />
                 <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="6" fill="none" className="text-blue-600 dark:text-blue-500 transition-all duration-1000" strokeDasharray="226" strokeDashoffset={226 - (completionRate / 100) * 226} />
               </svg>
               <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-lg font-bold text-neutral-900 dark:text-white">{completionRate}%</span>
               </div>
            </div>
            <div className="text-xs text-neutral-500 font-medium">Progress Hari Ini</div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-center items-center">
            <div className="text-4xl font-black text-neutral-900 dark:text-white mb-2">{completedTasks}</div>
            <div className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Tugas Selesai</div>
            <div className="text-xs text-neutral-400 mt-1">dari {totalTasks} tugas</div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-center items-center">
            <div className="text-4xl font-black text-neutral-900 dark:text-white mb-2">{streakCount}</div>
            <div className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Hari Berturut</div>
            <div className="text-xs text-neutral-400 mt-1">konsisten (≥80%)</div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900 flex flex-col justify-center items-center">
             <div className="text-4xl font-black text-neutral-900 dark:text-white mb-2">{Math.floor((todayItem.pomodoroMinutes || 0) / 25)}</div>
             <div className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Sesi Pomodoro</div>
             <div className="text-xs text-neutral-400 mt-1">hari ini (Total: {todayItem.pomodoroMinutes || 0}m)</div>
          </div>
        </div>
      )}

      {/* 2. TASK BLOCKS */}
      {activeTab === "harian" && todayItem && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {renderBlock("🕌 BLOK 1: FONDASI", "Aktivitas spiritual & dasar", categories.block1, "bg-gradient-to-r from-blue-600 to-blue-800")}
          {renderBlock("🎯 BLOK 2: FOKUS", `Hari ${dayType} - Rotasi spesifik`, categories.block2, "bg-gradient-to-r from-indigo-500 to-indigo-700")}
          {renderBlock("📅 BLOK 3: MINGGUAN", "Review & administrasi", categories.block3, "bg-gradient-to-r from-purple-500 to-purple-700")}
        </div>
      )}

      {/* 3. ADVANCED ANALYTICS */}
      {activeTab === "harian" && (
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-6 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold dark:text-white">📊 Analytics & Insights</h3>
          <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
            <button onClick={() => setPeriod('7d')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${period === '7d' ? 'bg-blue-600 text-white' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}>7 Hari</button>
            <button onClick={() => setPeriod('30d')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${period === '30d' ? 'bg-blue-600 text-white' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'}`}>30 Hari</button>
          </div>
        </div>
        <div className="w-full h-[250px]">
          <Bar 
            data={getChartData()} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: { beginAtZero: true, max: 100, grid: { color: 'rgba(150, 150, 150, 0.1)' } },
                x: { grid: { display: false } }
              },
              plugins: { legend: { display: false } }
            }} 
          />
        </div>
        
        {/* Detail Statistik */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-neutral-100 dark:border-neutral-800 pt-6">
           <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-lg">
             <div className="text-sm text-neutral-500 mb-1">Rata-rata {period}</div>
             <div className="text-2xl font-bold text-blue-600">
               {(() => {
                  const d = getChartData().datasets[0].data;
                  const nonZero = d.filter(x => x > 0);
                  return nonZero.length > 0 ? Math.round(nonZero.reduce((a,b)=>a+b, 0) / nonZero.length) : 0;
               })()}%
             </div>
           </div>
           <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-lg">
             <div className="text-sm text-neutral-500 mb-1">Total Pomodoro</div>
             <div className="text-2xl font-bold text-red-600">{items.reduce((sum, item) => sum + (item.pomodoroMinutes || 0), 0)}m</div>
           </div>
           <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-lg">
             <div className="text-sm text-neutral-500 mb-1">Hari Produktif (&gt;80%)</div>
             <div className="text-2xl font-bold text-green-600">{items.filter(i => {
                let r=0; try{const p=JSON.parse(i.tasks||"[]"); r = p.length? Math.round(p.filter((x:any)=>x.completed).length/p.length*100):0}catch(e){}
                return r>=80;
             }).length} Hari</div>
           </div>
           <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-lg">
             <div className="text-sm text-neutral-500 mb-1">Mood Dominan</div>
             <div className="text-2xl font-bold">{items.length > 0 ? items[0].mood : "🙂"}</div>
           </div>
        </div>
      </div>
      )}

      {/* 4. RIWAYAT & MANUAL FORM (Lama) */}
      {activeTab === "riwayat" && (
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="mb-4 font-semibold text-lg dark:text-white">Riwayat Terakhir & Edit Manual</h3>
        
        <div className="grid gap-4 md:grid-cols-2 mb-8 bg-neutral-50 dark:bg-neutral-950 p-4 rounded-lg border border-neutral-100 dark:border-neutral-800">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Tanggal</label>
            <input type="date" value={newItem.date} onChange={e => setNewItem({...newItem, date: e.target.value})} className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Tipe Hari</label>
            <select value={newItem.dayType} onChange={e => setNewItem({...newItem, dayType: e.target.value})} className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-white">
              <option value="A">Hari A (Fokus Spesifik)</option>
              <option value="B">Hari B (Fokus Spesifik)</option>
              <option value="Minggu">Minggu (Review)</option>
              <option value="Work">Work (Umum)</option>
              <option value="Rest">Rest</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-medium text-neutral-500">
              Tugas ({draftTasks.filter((t) => t.completed).length}/{draftTasks.length} selesai)
            </label>
            <div className="max-h-48 overflow-y-auto space-y-1 rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-950">
              {draftTasks.length === 0 ? (
                <p className="py-2 text-center text-xs text-neutral-400">
                  Pilih tipe hari untuk generate tugas otomatis
                </p>
              ) : (
                draftTasks.map((task, i) => (
                  <label
                    key={i}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors ${
                      task.completed
                        ? "bg-green-50 dark:bg-green-900/20"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() =>
                        setDraftTasks((prev) =>
                          prev.map((t, idx) =>
                            idx === i ? { ...t, completed: !t.completed } : t
                          )
                        )
                      }
                      className="h-4 w-4 rounded accent-blue-600"
                    />
                    <span
                      className={`text-xs ${
                        task.completed
                          ? "text-green-700 line-through dark:text-green-400"
                          : "text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      {task.name}
                    </span>
                  </label>
                ))
              )}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Menit Pomodoro</label>
            <input type="number" value={newItem.pomodoroMinutes || ""} onChange={e => setNewItem({...newItem, pomodoroMinutes: Number(e.target.value)})} className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-white" />
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-neutral-500">Mood</label>
            <div className="flex gap-1.5">
              {["😢", "😐", "🙂", "😊", "🤩"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setNewItem({ ...newItem, mood: m })}
                  className={`rounded-lg p-2 text-xl transition-all hover:scale-110 ${
                    newItem.mood === m
                      ? "bg-blue-100 ring-2 ring-blue-400 dark:bg-blue-900/40"
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 mt-2 flex gap-2">
            <button onClick={handleSave} className="rounded-lg bg-neutral-900 px-6 py-2 font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
              {editingId ? "Simpan Perubahan Manual" : "Buat Rekor Manual"}
            </button>
            {editingId && (
              <button onClick={resetForm} className="rounded-lg bg-neutral-200 px-6 py-2 font-medium transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700">
                Batal
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="group rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
              <div className="flex justify-between">
                <span className="font-bold dark:text-white">{new Date(item.date).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium uppercase text-blue-500">{item.dayType}</span>
                  <div className="hidden gap-2 group-hover:flex">
                    <button onClick={() => editItem(item)} className="text-xs font-semibold text-neutral-500 hover:text-blue-500 transition-colors dark:text-neutral-400">Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="text-xs font-semibold text-neutral-500 hover:text-red-500 transition-colors dark:text-neutral-400">Hapus</button>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                {(() => {
                  try {
                    const tParsed = JSON.parse(item.tasks);
                    if (Array.isArray(tParsed)) {
                      return (
                        <div className="flex flex-wrap gap-1.5">
                          {tParsed.map((t: any, i: number) => (
                            <span key={i} className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-md border ${
                              t.completed 
                                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50" 
                                : "bg-white text-neutral-600 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-700"
                            }`}>
                              {t.completed ? "✓" : "○"} {t.name}
                            </span>
                          ))}
                        </div>
                      );
                    }
                  } catch (e) {}
                  return <p className="text-sm text-neutral-600 dark:text-neutral-400">Tasks: {item.tasks}</p>;
                })()}
              </div>
              <div className="mt-3 flex gap-4 text-xs text-neutral-500 font-medium dark:text-neutral-400 border-t border-neutral-200 dark:border-neutral-800 pt-3">
                <span className="flex items-center gap-1">⏱️ {item.pomodoroMinutes} menit</span>
                <span className="flex items-center gap-1">😊 Mood: {item.mood}</span>
                {item.goals && <span className="flex items-center gap-1">🎯 {item.goals.substring(0, 30)}...</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* 5. FLOATING ACTION BUTTONS */}
      {activeTab === "harian" && (
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <button onClick={() => {setShowMood(true); setShowTimer(false); setShowGoals(false);}} className="w-12 h-12 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 text-xl" title="Mood Tracker">😊</button>
        <button onClick={() => {setShowGoals(true); setShowTimer(false); setShowMood(false); setTempGoals(todayItem?.goals || "");}} className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 text-xl" title="Goals Harian">🎯</button>
        <button onClick={() => {setShowTimer(true); setShowMood(false); setShowGoals(false);}} className="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 text-xl" title="Pomodoro Timer">⏱️</button>
      </div>
      )}

      {/* Modals Overlays */}
      {(showTimer || showMood || showGoals) && (
        <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          
          {/* Timer Modal */}
          {showTimer && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95">
              <h3 className="text-xl font-bold mb-4 dark:text-white flex items-center gap-2">⏱️ Pomodoro Timer</h3>
              <div className="text-center mb-6">
                <div className="text-5xl font-black text-blue-600 mb-2">
                  {timerMinutes.toString().padStart(2, '0')}:{timerSeconds.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-neutral-500 font-medium">
                  {timerRunning ? "Fokus berjalan..." : "Siap untuk mulai"}
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                <button onClick={() => setTimerRunning(true)} disabled={timerRunning} className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2.5 rounded-xl font-bold">Start</button>
                <button onClick={() => setTimerRunning(false)} disabled={!timerRunning} className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white py-2.5 rounded-xl font-bold">Pause</button>
                <button onClick={() => {setTimerRunning(false); setTimerMinutes(25); setTimerSeconds(0);}} className="flex-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 py-2.5 rounded-xl font-bold">Reset</button>
              </div>
              <button onClick={() => setShowTimer(false)} className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 py-2 rounded-xl font-medium">Tutup</button>
            </div>
          )}

          {/* Mood Modal */}
          {showMood && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 w-full max-w-sm shadow-xl animate-in zoom-in-95">
              <h3 className="text-xl font-bold mb-4 dark:text-white">🌟 Mood Tracker</h3>
              <div className="flex justify-between mb-6">
                {MOODS.map(m => (
                  <button key={m} onClick={() => saveMood(m)} className={`text-3xl p-3 rounded-xl transition-transform hover:scale-110 hover:bg-neutral-100 dark:hover:bg-neutral-800 ${todayItem?.mood === m ? 'bg-blue-50 border-2 border-blue-500 dark:bg-blue-900/30' : 'border-2 border-transparent'}`}>
                    {m}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowMood(false)} className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 py-2 rounded-xl font-medium">Batal</button>
            </div>
          )}

          {/* Goals Modal */}
          {showGoals && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 w-full max-w-md shadow-xl animate-in zoom-in-95">
              <h3 className="text-xl font-bold mb-4 dark:text-white">🎯 Goals Harian</h3>
              <textarea 
                value={tempGoals}
                onChange={e => setTempGoals(e.target.value)}
                placeholder="Tulis gol utama harian Anda..."
                className="w-full h-32 p-3 rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-950 dark:border-neutral-800 dark:text-white outline-none resize-none mb-4"
              />
              <div className="flex gap-2">
                <button onClick={saveGoals} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-bold">Simpan</button>
                <button onClick={() => setShowGoals(false)} className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 py-2 rounded-xl font-medium">Batal</button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
