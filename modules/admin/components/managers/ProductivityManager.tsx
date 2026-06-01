"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getDayType, getCategorizedTasksForDay, ProductivityConfig, DEFAULT_PRODUCTIVITY_CONFIG, DayTypeConfig } from "@/common/constants/productivityBlocks";
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
import { ModalShell, FormFooter, inputCls, labelCls } from "../AdminFormUI";
import { TbEdit } from "react-icons/tb";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ProductivityManager({
  activeTab = "harian",
  onMutate,
}: {
  activeTab?: "harian" | "riwayat" | "pengaturan_hari";
  onMutate?: () => void;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [draftTasks, setDraftTasks] = useState<{ name: string; completed: boolean }[]>([]);
  const [config, setConfig] = useState<ProductivityConfig>(DEFAULT_PRODUCTIVITY_CONFIG);

  // item state (for create and edit riwayat manual)
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    date: new Date().toISOString().split('T')[0],
    tasks: "",
    dayType: getDayType(new Date().toISOString().split('T')[0], DEFAULT_PRODUCTIVITY_CONFIG),
    pomodoroMinutes: 0,
    mood: "🙂",
    goals: "",
  });

  const today = new Date().toISOString().split('T')[0];
  const todayItem = items.find(item => item.date === today);

  // Modals state
  const [showRiwayatModal, setShowRiwayatModal] = useState(false);
  const [period, setPeriod] = useState<"7d" | "30d">("7d");
  const [showTimer, setShowTimer] = useState(false);
  const [showMood, setShowMood] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [quickEditBlock, setQuickEditBlock] = useState<number | null>(null);
  const [quickEditText, setQuickEditText] = useState("");

  // Timer state
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [customSeconds, setCustomSeconds] = useState(0);

  const MOODS = ['😢', '😐', '🙂', '😊', '🤩'];
  const [tempGoals, setTempGoals] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-fill dayType when date changes (non-edit mode)
  useEffect(() => {
    if (!editingId) {
      setNewItem((prev) => ({ ...prev, dayType: getDayType(prev.date, config) }));
    }
  }, [newItem.date, editingId, config]);

  // Auto-update draft tasks when dayType changes (non-edit mode)
  useEffect(() => {
    if (!editingId) {
      const cats = getCategorizedTasksForDay(newItem.dayType, config);
      setDraftTasks(
        [...cats.block1, ...cats.block2, ...cats.block3].map((name) => ({
          name,
          completed: false,
        }))
      );
    }
  }, [newItem.dayType, editingId, config]);

  useEffect(() => {
    if (!loading && !todayItem) {
      // Auto create today's record
      const dayType = getDayType(today, config);
      const allTasks = getCategorizedTasksForDay(dayType, config);
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
        if (data && !data.error) {
          setItems(prev => Array.isArray(prev) ? [data, ...prev] : [data]);
        }
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
            addPomodoro(customMinutes);
            
            // Play notification sound
            try {
              const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
              audio.play();
            } catch (e) {}

            toast.success("Pomodoro selesai!");
            setTimerMinutes(customMinutes);
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
  }, [timerRunning, timerMinutes, timerSeconds, customMinutes]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resProd, resSet] = await Promise.all([
        fetch("/api/admin/productivity"),
        fetch("/api/admin/site-settings")
      ]);
      if (!resProd.ok) throw new Error("Gagal mengambil data produktivitas");
      const data = await resProd.json();
      setItems(Array.isArray(data) ? data : []);

      if (resSet.ok) {
         const settings = await resSet.json();
         const confStr = settings.find((s: any) => s.key === "productivity_day_types")?.value;
         if (confStr) {
           setConfig(JSON.parse(confStr));
         }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (cfgToSave = config, syncToday = false) => {
    const toastId = toast.loading("Menyimpan pengaturan...");
    try {
       const res = await fetch("/api/admin/site-settings", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ key: "productivity_day_types", value: JSON.stringify(cfgToSave) })
       });
       if (!res.ok) throw new Error("Gagal menyimpan pengaturan");
       toast.success("Pengaturan tersimpan", { id: toastId });

       if (syncToday && todayItem) {
          const dt = getDayType(todayItem.date, cfgToSave);
          const dtObj = cfgToSave.dayTypes.find(d => d.id === dt) || cfgToSave.dayTypes[0];
          const allExpected = [
            ...cfgToSave.morningTasks,
            ...(dtObj ? dtObj.tasks : []),
            ...cfgToSave.eveningTasks
          ].filter(t => t.trim());

          let currentTasks = [];
          try { currentTasks = JSON.parse(todayItem.tasks || "[]"); } catch(e){}

          const newTasks = allExpected.map(name => {
            const existing = currentTasks.find((t: any) => t.name === name);
            return { name, completed: existing ? existing.completed : false };
          });

          await fetch("/api/admin/productivity", {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ id: todayItem.id, tasks: JSON.stringify(newTasks) }),
          });
          fetchData();
       }
    } catch (error: any) {
       toast.error(error.message, { id: toastId });
    }
  };

  const handleQuickEditSave = async () => {
     let newConfig = { ...config };
     if (quickEditBlock === 1) newConfig.morningTasks = quickEditText.split("\n").filter(t => t.trim());
     if (quickEditBlock === 3) newConfig.eveningTasks = quickEditText.split("\n").filter(t => t.trim());
     if (quickEditBlock === 2) {
        const dt = todayItem ? getDayType(todayItem.date, config) : "Work";
        const idx = newConfig.dayTypes.findIndex(d => d.id === dt);
        if (idx !== -1) {
           newConfig.dayTypes[idx].tasks = quickEditText.split("\n").filter(t => t.trim());
        }
     }
     setConfig(newConfig);
     setQuickEditBlock(null);
     await handleSaveConfig(newConfig, true);
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

      setShowRiwayatModal(false);
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
      setShowRiwayatModal(false);
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
      dayType: item.dayType || getDayType(item.date, config),
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
  };

  const resetForm = (targetDateStr?: string) => {
    const d = targetDateStr || new Date().toISOString().split('T')[0];
    setEditingId(null);
    setDraftTasks([]); // will be repopulated by useEffect via dayType
    setNewItem({
      date: d,
      tasks: "",
      dayType: getDayType(d, config),
      pomodoroMinutes: 0,
      mood: "🙂",
      goals: "",
    });
  };

  const [calendarDate, setCalendarDate] = useState(new Date());
  
  const getDaysArray = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };
  
  const handlePrevMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  
  const selectDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStrSafe = `${year}-${month}-${day}`;
    const existing = items.find(i => i.date === dateStrSafe);
    if (existing) editItem(existing);
    else resetForm(dateStrSafe);
    setShowRiwayatModal(true);
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

  const renderBlock = (title: string, subtitle: string, tasksToRender: string[], bgHeaderClass: string, onEdit?: () => void) => (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden dark:border-neutral-800 dark:bg-neutral-900">
       <div className={`${bgHeaderClass} p-4 text-white`}>
         <h4 className="font-bold text-lg flex items-center justify-between">
           {title}
           {onEdit && (
             <button onClick={onEdit} className="p-1.5 bg-white/20 hover:bg-white/30 rounded transition-colors text-white shadow-sm" title="Quick Edit">
               <TbEdit size={16} />
             </button>
           )}
         </h4>
         <p className="text-sm opacity-80 mt-0.5">{subtitle}</p>
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
      
      {/* 0. POMODORO TIMER */}
      {activeTab === "harian" && todayItem && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-6 shadow-sm dark:border-blue-900/50 dark:bg-blue-900/20 flex flex-col items-center">
          <h3 className="mb-2 font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
            🍅 Pomodoro Focus Timer
          </h3>
          {timerRunning ? (
            <div className="text-6xl font-black text-blue-900 dark:text-blue-100 tabular-nums tracking-tighter mb-4">
              {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 mb-4 text-6xl font-black text-blue-900 dark:text-blue-100">
              <input 
                type="number"
                min="0"
                max="180"
                value={timerMinutes}
                onChange={(e) => {
                  const val = Math.max(0, Math.min(180, Number(e.target.value)));
                  setTimerMinutes(val);
                  setCustomMinutes(val);
                }}
                className="w-20 bg-transparent text-center border-b-2 border-blue-300 dark:border-blue-700 focus:border-blue-500 focus:outline-none tabular-nums"
              />
              <span>:</span>
              <input 
                type="number"
                min="0"
                max="59"
                value={timerSeconds}
                onChange={(e) => {
                  const val = Math.max(0, Math.min(59, Number(e.target.value)));
                  setTimerSeconds(val);
                  setCustomSeconds(val);
                }}
                className="w-20 bg-transparent text-center border-b-2 border-blue-300 dark:border-blue-700 focus:border-blue-500 focus:outline-none tabular-nums"
              />
            </div>
          )}
          <div className="flex gap-3">
            <button 
              onClick={() => setTimerRunning(!timerRunning)}
              className={`rounded-full px-8 py-3 font-bold text-white transition-all shadow-md ${
                timerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {timerRunning ? 'Jeda' : 'Mulai Fokus'}
            </button>
            <button 
              onClick={() => { setTimerRunning(false); setTimerMinutes(customMinutes); setTimerSeconds(customSeconds); }}
              className="rounded-full bg-white px-6 py-3 font-bold text-blue-600 border border-blue-200 hover:bg-blue-50 dark:bg-neutral-800 dark:border-neutral-700 dark:text-blue-400 dark:hover:bg-neutral-700"
            >
              Reset
            </button>
          </div>
        </div>
      )}

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
          {categories.block1.length > 0 && renderBlock("🕌 BLOK 1: FONDASI", "Aktivitas spiritual & dasar", categories.block1, "bg-gradient-to-r from-blue-600 to-blue-800", () => {
            setQuickEditText(config.morningTasks.join("\n"));
            setQuickEditBlock(1);
          })}
          {categories.block2.length > 0 && renderBlock("🎯 BLOK 2: FOKUS", `Hari ${dayType} - Rotasi spesifik`, categories.block2, "bg-gradient-to-r from-indigo-500 to-indigo-700", () => {
            const dtObj = config.dayTypes.find(d => d.id === dayType);
            setQuickEditText(dtObj ? dtObj.tasks.join("\n") : "");
            setQuickEditBlock(2);
          })}
          {categories.block3.length > 0 && renderBlock("📅 BLOK 3: MINGGUAN", "Review & administrasi", categories.block3, "bg-gradient-to-r from-purple-500 to-purple-700", () => {
            setQuickEditText(config.eveningTasks.join("\n"));
            setQuickEditBlock(3);
          })}
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

      {/* 4. RIWAYAT & MANUAL FORM (Kalender) */}
      {activeTab === "riwayat" && (
      <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <h3 className="mb-4 font-semibold text-lg dark:text-white">Riwayat Terakhir & Edit Manual</h3>
        
        {/* Calendar Grid */}
        <div className="mb-8 rounded-lg border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevMonth} className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300">◀</button>
            <h4 className="font-bold text-lg dark:text-white">
              {calendarDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </h4>
            <button onClick={handleNextMonth} className="p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300">▶</button>
          </div>
          
          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-semibold text-neutral-500 uppercase tracking-widest">
            <div>Min</div><div>Sen</div><div>Sel</div><div>Rab</div><div>Kam</div><div>Jum</div><div>Sab</div>
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {getDaysArray().map((d, i) => {
              if (!d) return <div key={i} className="h-12 rounded-lg"></div>;
              
              const year = d.getFullYear();
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const day = String(d.getDate()).padStart(2, '0');
              const dateStrSafe = `${year}-${month}-${day}`;
              
              const existing = items.find(x => x.date === dateStrSafe);
              let rate = 0;
              if (existing) {
                try {
                  const parsed = JSON.parse(existing.tasks || "[]");
                  const completed = parsed.filter((t: any) => t.completed).length;
                  rate = parsed.length > 0 ? Math.round((completed / parsed.length) * 100) : 0;
                } catch(e) {}
              }
              
              const isSelected = newItem.date === dateStrSafe;
              
              const isPast = d < new Date(new Date().setHours(0,0,0,0));
              let bgColor = "bg-white hover:bg-neutral-100 border border-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700";
              if (existing) {
                if (rate >= 80) bgColor = "bg-green-500 text-white border-green-600 hover:bg-green-600 dark:bg-green-600 dark:border-green-700";
                else if (rate >= 40) bgColor = "bg-yellow-400 text-yellow-900 border-yellow-500 hover:bg-yellow-500 dark:bg-yellow-500 dark:border-yellow-600";
                else bgColor = "bg-red-500 text-white border-red-600 hover:bg-red-600 dark:bg-red-600 dark:border-red-700";
              } else if (isPast) {
                bgColor = "bg-red-50 text-red-400 border border-red-200 dark:bg-red-900/20 dark:border-red-900/50";
              }
              
              if (isSelected) {
                bgColor = "ring-2 ring-blue-500 shadow-lg scale-105 z-10 " + bgColor;
              }
              
              return (
                <button 
                  key={i} 
                  onClick={() => selectDate(d)}
                  className={`h-12 rounded-lg flex flex-col items-center justify-center transition-all relative ${bgColor}`}
                  title={existing ? `Progress: ${rate}%` : "Belum ada rekor"}
                >
                  <span className="font-bold text-sm">{d.getDate()}</span>
                  {existing && <span className="text-[12px] absolute bottom-0.5">{existing.mood}</span>}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Detail Form Modal */}
        {showRiwayatModal && (
        <ModalShell title={editingId ? "✏️ Mode Edit Riwayat" : "✨ Buat Riwayat Baru"} onClose={() => setShowRiwayatModal(false)}>
          <div className="grid gap-4 md:grid-cols-2 relative">
            <div className="md:col-span-2 mb-2">
               <h4 className="font-bold text-neutral-800 dark:text-neutral-200">
                 Detail Tanggal: {new Date(newItem.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
               </h4>
            </div>

            <div>
              <label className={labelCls}>Tanggal</label>
              <input type="date" value={newItem.date} onChange={e => setNewItem({...newItem, date: e.target.value})} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Tipe Hari</label>
              <select value={newItem.dayType} onChange={e => setNewItem({...newItem, dayType: e.target.value})} className={inputCls}>
                {config.dayTypes.map(dt => (
                  <option key={dt.id} value={dt.id}>{dt.name}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>
                Tugas ({draftTasks.filter((t) => t.completed).length}/{draftTasks.length} selesai)
              </label>
              <div className="max-h-48 overflow-y-auto space-y-1 rounded-xl border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900 shadow-inner">
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
                          : "hover:bg-neutral-50 dark:hover:bg-neutral-800"
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
              <label className={labelCls}>Menit Pomodoro</label>
              <input type="number" value={newItem.pomodoroMinutes || ""} onChange={e => setNewItem({...newItem, pomodoroMinutes: Number(e.target.value)})} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Mood</label>
              <div className="flex gap-1.5">
                {["😢", "😐", "🙂", "😊", "🤩"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setNewItem({ ...newItem, mood: m })}
                    className={`rounded-lg p-2 text-xl transition-all hover:scale-110 ${
                      newItem.mood === m
                        ? "bg-blue-100 ring-2 ring-blue-400 dark:bg-blue-900/40"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-800 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 mt-4 flex gap-3 border-t border-neutral-100 dark:border-neutral-800 pt-4">
              <button onClick={handleSave} className="flex-1 rounded-lg bg-blue-600 px-6 py-2.5 font-bold text-white transition-colors hover:bg-blue-700">
                {editingId ? "Simpan Perubahan Manual" : "Buat Rekor Baru"}
              </button>
              {editingId && (
                <button onClick={() => handleDelete(editingId)} className="rounded-lg bg-red-100 text-red-600 px-6 py-2.5 font-bold transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50">
                  Hapus
                </button>
              )}
              <button onClick={() => setShowRiwayatModal(false)} className="rounded-lg bg-neutral-200 px-6 py-2.5 font-bold transition-colors hover:bg-neutral-300 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700">
                Batal
              </button>
            </div>
          </div>
        </ModalShell>
        )}
      </div>
      )}
      {/* 5. PENGATURAN HARI */}
      {activeTab === "pengaturan_hari" && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 mb-8">
          <div className="flex justify-between items-center mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <h3 className="font-semibold text-xl dark:text-white flex items-center gap-2">⚙️ Pengaturan Rutinitas & Tipe Hari</h3>
            <button onClick={() => handleSaveConfig(config, true)} className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700 shadow-md">
              Simpan & Sinkronkan
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            {/* Rutinitas Pagi */}
            <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
              <h4 className="font-bold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">🕌 Pengaturan BLOK 1 (Fondasi / Pagi)</h4>
              <textarea 
                className="w-full h-40 rounded-lg border border-neutral-300 bg-white p-3 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                value={config.morningTasks.join("\n")}
                onChange={e => setConfig({...config, morningTasks: e.target.value.split("\n")})}
                placeholder="Pisahkan dengan baris baru (Enter)"
              />
              <p className="text-xs text-neutral-500 mt-2 font-medium">Tugas ini akan otomatis ditambahkan ke awal setiap hari.</p>
            </div>

            {/* Rutinitas Malam */}
            <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
              <h4 className="font-bold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">📅 Pengaturan BLOK 3 (Mingguan / Malam)</h4>
              <textarea 
                className="w-full h-40 rounded-lg border border-neutral-300 bg-white p-3 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
                value={config.eveningTasks.join("\n")}
                onChange={e => setConfig({...config, eveningTasks: e.target.value.split("\n")})}
                placeholder="Pisahkan dengan baris baru (Enter)"
              />
              <p className="text-xs text-neutral-500 mt-2 font-medium">Tugas ini akan otomatis ditambahkan ke akhir setiap hari.</p>
            </div>
          </div>

          {/* Pengaturan Tipe Hari */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-lg dark:text-white flex items-center gap-2">📅 Daftar Tipe Hari</h4>
              <button 
                onClick={() => setConfig({...config, dayTypes: [...config.dayTypes, { id: "New_" + Date.now(), name: "Tipe Baru", daysOfWeek: [], tasks: [] }]})} 
                className="rounded-lg bg-green-100 text-green-700 px-4 py-2 text-sm font-bold transition-colors hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
              >
                + Tambah Tipe Hari
              </button>
            </div>
            
            <div className="space-y-4">
              {config.dayTypes.map((dt, index) => (
                <div key={dt.id} className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 relative">
                  <button 
                    onClick={() => {
                      if(window.confirm("Hapus tipe hari ini?")) {
                        setConfig({...config, dayTypes: config.dayTypes.filter((_, i) => i !== index)});
                      }
                    }}
                    className="absolute top-5 right-5 text-red-500 hover:text-red-700 text-sm font-bold px-3 py-1 bg-red-50 rounded-md dark:bg-red-900/20"
                  >
                    Hapus
                  </button>

                  <div className="mb-4 pr-24">
                    <label className="mb-1 block text-xs font-medium text-neutral-500">Nama Tipe Hari (Untuk Dropdown & Header)</label>
                    <input 
                      type="text" 
                      value={dt.name} 
                      onChange={e => {
                        const val = e.target.value;
                        const newDt = [...config.dayTypes];
                        newDt[index].name = val;
                        // Auto generate ID avoiding spaces
                        newDt[index].id = val.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
                        setConfig({...config, dayTypes: newDt});
                      }}
                      className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-white" 
                    />
                  </div>

                  <div className="mb-4">
                    <label className="mb-2 block text-xs font-medium text-neutral-500">Jadwal Aktif Otomatis (Hari dalam seminggu)</label>
                    <div className="flex flex-wrap gap-2">
                      {["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map((dayName, dIdx) => (
                        <label key={dIdx} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition-colors ${dt.daysOfWeek.includes(dIdx) ? "bg-blue-100 border-blue-300 text-blue-700 dark:bg-blue-900/40 dark:border-blue-700 dark:text-blue-300" : "bg-neutral-50 border-neutral-200 text-neutral-600 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 hover:bg-neutral-100"}`}>
                          <input 
                            type="checkbox" 
                            className="hidden"
                            checked={dt.daysOfWeek.includes(dIdx)}
                            onChange={(e) => {
                              const newDt = [...config.dayTypes];
                              if (e.target.checked) {
                                newDt[index].daysOfWeek.push(dIdx);
                              } else {
                                newDt[index].daysOfWeek = newDt[index].daysOfWeek.filter(d => d !== dIdx);
                              }
                              setConfig({...config, dayTypes: newDt});
                            }}
                          />
                          {dayName}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-neutral-500">Pengaturan BLOK 2 (Fokus Tugas Tambahan)</label>
                    <textarea 
                      className="w-full h-32 rounded-lg border border-neutral-300 bg-neutral-50 p-3 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                      value={dt.tasks.join("\n")}
                      onChange={e => {
                        const newDt = [...config.dayTypes];
                        newDt[index].tasks = e.target.value.split("\n");
                        setConfig({...config, dayTypes: newDt});
                      }}
                      placeholder="Masukkan tugas khusus untuk hari ini..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={dt.hideMorning || false}
                        onChange={e => {
                          const newDt = [...config.dayTypes];
                          newDt[index].hideMorning = e.target.checked;
                          setConfig({...config, dayTypes: newDt});
                        }}
                        className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                      />
                      Sembunyikan Blok 1 (Fondasi/Pagi)
                    </label>
                    <label className="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={dt.hideEvening || false}
                        onChange={e => {
                          const newDt = [...config.dayTypes];
                          newDt[index].hideEvening = e.target.checked;
                          setConfig({...config, dayTypes: newDt});
                        }}
                        className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                      />
                      Sembunyikan Blok 3 (Mingguan/Malam)
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. FLOATING ACTION BUTTONS */}
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
                {timerRunning ? (
                  <div className="text-5xl font-black text-blue-600 mb-2 tabular-nums">
                    {timerMinutes.toString().padStart(2, '0')}:{timerSeconds.toString().padStart(2, '0')}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 mb-2 text-5xl font-black text-blue-600">
                    <input 
                      type="number"
                      min="0"
                      max="180"
                      value={timerMinutes}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(180, Number(e.target.value)));
                        setTimerMinutes(val);
                        setCustomMinutes(val);
                      }}
                      className="w-16 bg-transparent text-center border-b-2 border-blue-200 focus:border-blue-500 focus:outline-none tabular-nums"
                    />
                    <span>:</span>
                    <input 
                      type="number"
                      min="0"
                      max="59"
                      value={timerSeconds}
                      onChange={(e) => {
                        const val = Math.max(0, Math.min(59, Number(e.target.value)));
                        setTimerSeconds(val);
                        setCustomSeconds(val);
                      }}
                      className="w-16 bg-transparent text-center border-b-2 border-blue-200 focus:border-blue-500 focus:outline-none tabular-nums"
                    />
                  </div>
                )}
                <div className="text-sm text-neutral-500 font-medium">
                  {timerRunning ? "Fokus berjalan..." : "Siap untuk mulai"}
                </div>
              </div>
              <div className="flex gap-2 mb-4">
                <button onClick={() => setTimerRunning(true)} disabled={timerRunning} className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2.5 rounded-xl font-bold">Start</button>
                <button onClick={() => setTimerRunning(false)} disabled={!timerRunning} className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white py-2.5 rounded-xl font-bold">Pause</button>
                <button onClick={() => {setTimerRunning(false); setTimerMinutes(customMinutes); setTimerSeconds(customSeconds);}} className="flex-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700 py-2.5 rounded-xl font-bold">Reset</button>
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

          {/* Quick Edit Modal */}
          {quickEditBlock !== null && (
            <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-md shadow-xl animate-in zoom-in-95 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                  <TbEdit className="text-blue-500" /> Edit BLOK {quickEditBlock}
                </h3>
              </div>
              <form onSubmit={e => { e.preventDefault(); handleQuickEditSave(); }} className="p-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Daftar Tugas (Pisahkan dengan Baris Baru / Enter)
                  </label>
                  <textarea 
                    value={quickEditText}
                    onChange={e => setQuickEditText(e.target.value)}
                    placeholder="Tugas 1&#10;Tugas 2"
                    className="w-full h-48 p-3 rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-950 dark:border-neutral-800 dark:text-white outline-none resize-none mb-4 font-mono text-sm shadow-inner focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-bold transition-colors">Simpan & Sinkronkan</button>
                  <button type="button" onClick={() => setQuickEditBlock(null)} className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 py-2.5 rounded-xl font-medium transition-colors">Batal</button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
