'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Target, Zap, Smile, Timer as TimerIcon, Plus, 
  Trash2, Save, Calendar as CalendarIcon, ChevronRight, ChevronLeft,
  BarChart3, Clock, AlertCircle,
  Flame, Award, LayoutGrid, List, CheckCircle2,
  TrendingUp, CalendarDays, Sparkles, TrendingDown, Minus,
  Wallet, Rocket, Leaf, ShieldCheck, Settings
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProduktifPage() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Life Hub Content (Dynamic from SiteSettings)
  const [lifeHub, setLifeHub] = useState({
    yearly: [],
    savings: [],
    habits: []
  });

  const [navDate, setNavDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [stats, setStats] = useState({ completion: 0, completedCount: 0, totalCount: 0, pomodoro: 0 });
  const [mood, setMood] = useState('');
  const [goals, setGoals] = useState('');
  const [timer, setTimer] = useState(1500);
  const [timerActive, setTimerActive] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData(selectedDate);
      fetchHistory();
      fetchLifeHub();
    }
  }, [isAuthenticated, selectedDate]);

  const fetchLifeHub = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('SiteSettings').select('*').eq('key', 'life_hub_config').single();
    if (data) setLifeHub(JSON.parse(data.value));
    else {
      // Default fallback
      setLifeHub({
        yearly: ["Lulus Sertifikasi Cloud", "Tabungan Umroh 100%", "Bahasa Inggris C1"],
        savings: [{ name: "Tabungan Umroh", target: "35jt", current: "15jt", icon: "🕌" }],
        habits: ["Baca Buku 15 Menit", "Pushup 20x"]
      });
    }
  };

  const fetchData = async (targetDate) => {
    setLoading(true);
    const supabase = createClient();
    const { data: configData } = await supabase.from('SiteSettings').select('value').eq('key', 'productivity_config').single();
    const config = configData ? JSON.parse(configData.value) : null;
    let { data } = await supabase.from('Productivity').select('*').eq('date', targetDate).single();

    if (!data && config && targetDate === new Date().toISOString().split('T')[0]) {
      const dayType = new Date().getDay() === 0 ? 'Sunday' : (new Date().getDay() % 2 === 0 ? 'B' : 'A');
      let block2 = dayType === 'A' ? config.block2A : (dayType === 'B' ? config.block2B : config.block2Sunday);
      const allTasks = [
        ...(config.block1 || []).map(t => ({ name: t, completed: false, block: 1 })),
        ...(block2 || []).map(t => ({ name: t, completed: false, block: 2 })),
        ...(config.block3 || []).map(t => ({ name: t, completed: false, block: 3 }))
      ];
      const { data: newData } = await supabase.from('Productivity').insert([{ date: targetDate, tasks: JSON.stringify(allTasks), dayType: dayType }]).select().single();
      data = newData;
    }

    if (data) {
      setTasks(JSON.parse(data.tasks));
      setMood(data.mood || '');
      setGoals(data.goals || '');
      setStats(prev => ({ ...prev, pomodoro: data.pomodoroMinutes || 0 }));
      calculateStats(JSON.parse(data.tasks));
    } else {
      setTasks([]); setMood(''); setGoals('');
      setStats(prev => ({ ...prev, completion: 0, completedCount: 0, totalCount: 0, pomodoro: 0 }));
    }
    setLoading(false);
  };

  const fetchHistory = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('Productivity').select('*').order('date', { ascending: false });
    if (data) setHistoryData(data);
  };

  const calculateCompletionRate = (taskListJson) => {
    try {
      const taskList = JSON.parse(taskListJson);
      return Math.round((taskList.filter(t => t.completed).length / taskList.length) * 100) || 0;
    } catch { return 0; }
  };

  const calculateStats = (currentTasks) => {
    const completed = currentTasks.filter(t => t.completed).length;
    const total = currentTasks.length;
    setStats(prev => ({ ...prev, completion: total > 0 ? Math.round((completed / total) * 100) : 0, completedCount: completed, totalCount: total }));
  };

  const toggleTask = async (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
    calculateStats(newTasks);
    const supabase = createClient();
    await supabase.from('Productivity').update({ tasks: JSON.stringify(newTasks) }).eq('date', selectedDate);
  };

  const smartAnalytics = useMemo(() => {
    if (historyData.length === 0) return null;
    const recentWeek = historyData.slice(0, 7);
    const previousWeek = historyData.slice(7, 14);
    const recentAvg = recentWeek.length > 0 ? recentWeek.reduce((sum, item) => sum + calculateCompletionRate(item.tasks), 0) / recentWeek.length : 0;
    const previousAvg = previousWeek.length > 0 ? previousWeek.reduce((sum, item) => sum + calculateCompletionRate(item.tasks), 0) / previousWeek.length : 0;
    let trendLabel = 'Stabil';
    let TrendIcon = Minus;
    if (recentAvg > previousAvg + 5) { trendLabel = 'Meningkat'; TrendIcon = TrendingUp; }
    else if (recentAvg < previousAvg - 5) { trendLabel = 'Menurun'; TrendIcon = TrendingDown; }
    const dayStats = {};
    historyData.forEach(item => {
      const day = new Date(item.date).getDay();
      if (!dayStats[day]) dayStats[day] = [];
      dayStats[day].push(calculateCompletionRate(item.tasks));
    });
    let bestDayIdx = -1; let bestDayAvg = 0;
    Object.keys(dayStats).forEach(d => {
      const avg = dayStats[d].reduce((a, b) => a + b, 0) / dayStats[d].length;
      if (avg > bestDayAvg) { bestDayAvg = avg; bestDayIdx = d; }
    });
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const perfectDays = historyData.filter(item => calculateCompletionRate(item.tasks) === 100).length;
    return { trendLabel, TrendIcon, bestDay: dayNames[bestDayIdx] || '-', perfectDays, recentAvg: Math.round(recentAvg) };
  }, [historyData]);

  const calendarDays = useMemo(() => {
    const year = navDate.getFullYear();
    const month = navDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      const hasData = historyData.some(h => h.date === dateStr);
      days.push({ day: i, date: dateStr, hasData });
    }
    return days;
  }, [navDate, historyData]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-jakarta">
        <div className="w-full max-w-md p-10 bg-white/5 border border-white/10 rounded-[3rem] text-center backdrop-blur-xl relative">
          <Zap size={40} className="mx-auto mb-8 text-[var(--accent)]" />
          <h1 className="text-3xl font-black mb-8 italic text-white uppercase tracking-tighter">Enter Vault</h1>
          <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); if (e.target.value === 'zxcvbnm') setIsAuthenticated(true); }} placeholder="••••••••" className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-center text-xl tracking-[0.5em] focus:border-[var(--accent)] outline-none text-white transition-all" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-jakarta overflow-x-hidden">
      <Navbar />
      <main className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Navigation Bar - Wrapped & Grouped */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
          <div onClick={() => { setNavDate(new Date(selectedDate)); setShowCalendarModal(true); }} className="p-4 bg-white/5 border border-white/10 rounded-[2rem] cursor-pointer hover:bg-white/10 transition-all flex items-center gap-5 group backdrop-blur-md">
            <div className="w-14 h-14 bg-[var(--accent)]/10 text-[var(--accent)] rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-[var(--accent)]/5">
              <span className="text-[10px] font-black uppercase leading-none mb-1">{new Date(selectedDate).toLocaleDateString('id-ID', { month: 'short' })}</span>
              <span className="text-2xl font-black leading-none">{new Date(selectedDate).getDate()}</span>
            </div>
            <div>
              <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter italic">{new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long' })}</h2>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${selectedDate === new Date().toISOString().split('T')[0] ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{selectedDate === new Date().toISOString().split('T')[0] ? 'System Online' : 'Viewing Archive'}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl">
            {[
              { id: 'tasks', icon: <List size={18} />, label: 'Daily' },
              { id: 'hub', icon: <Rocket size={18} />, label: 'Life Hub' },
              { id: 'analytics', icon: <BarChart3 size={18} />, label: 'Insights' },
              { id: 'history', icon: <CalendarIcon size={18} />, label: 'Archive' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${activeTab === tab.id ? 'bg-[var(--accent)] text-black shadow-xl shadow-[var(--accent)]/20 scale-105' : 'text-gray-500 hover:text-white'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'tasks' && (
            <motion.div key="tasks" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
               {tasks.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {[1, 2, 3].map(blockNum => (
                    <div key={blockNum} className="p-8 bg-white/[0.02] border border-white/5 rounded-[3rem] backdrop-blur-sm relative group overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <h2 className="text-xl font-black font-outfit uppercase tracking-tighter flex items-center gap-4 mb-8 italic">
                        <span className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${blockNum === 1 ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : blockNum === 2 ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 'bg-purple-500/10 text-purple-500 border-purple-500/20'}`}>0{blockNum}</span>
                        {blockNum === 1 ? 'Foundation' : blockNum === 2 ? 'Deep Work' : 'Maintenance'}
                      </h2>
                      <div className="space-y-4">
                        {tasks.filter(t => t.block === blockNum).map((task, idx) => {
                          const globalIdx = tasks.findIndex(t => t.name === task.name);
                          return (
                            <button key={idx} onClick={() => toggleTask(globalIdx)} className={`w-full p-6 rounded-[2rem] border text-left transition-all flex items-center justify-between group ${task.completed ? 'bg-[var(--accent)]/10 border-[var(--accent)]/40 text-[var(--accent)]' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'}`}>
                              <span className="font-bold text-sm tracking-tight">{task.name}</span>
                              <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-[var(--accent)] border-[var(--accent)] text-black' : 'border-white/10 group-hover:border-[var(--accent)]/50'}`}>
                                {task.completed && <CheckCircle2 size={14} strokeWidth={4} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-20 bg-white/5 border border-dashed border-white/10 rounded-[4rem] text-center backdrop-blur-md">
                  <AlertCircle size={48} className="mx-auto mb-6 text-gray-700" />
                  <h3 className="text-2xl font-black uppercase mb-4 italic text-gray-400">No Data Available</h3>
                  <button onClick={() => fetchData(selectedDate)} className="px-10 py-5 bg-[var(--accent)] text-black font-black rounded-3xl text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-[var(--accent)]/20">Initialize Today's Log</button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'hub' && (
            <motion.div key="hub" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {/* Yearly Planning */}
              <div className="p-10 bg-white/5 border border-white/10 rounded-[4rem] backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-[var(--accent)] opacity-20"><Rocket size={100} /></div>
                <h3 className="text-2xl font-black font-outfit uppercase italic mb-10">One Year <span className="text-[var(--accent)]">Plan</span></h3>
                <div className="space-y-6">
                  {lifeHub.yearly.map((plan, i) => (
                    <div key={i} className="flex items-start gap-4 p-5 bg-white/5 rounded-3xl border border-white/5">
                      <div className="w-6 h-6 bg-[var(--accent)]/20 text-[var(--accent)] rounded-lg flex items-center justify-center mt-1"><ShieldCheck size={14} /></div>
                      <p className="text-sm font-bold text-gray-300 leading-relaxed">{plan}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Goals (Umroh, etc) */}
              <div className="p-10 bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-white/10 rounded-[4rem] backdrop-blur-xl">
                <h3 className="text-2xl font-black font-outfit uppercase italic mb-10 flex items-center gap-3"><Wallet className="text-green-500" /> Finance <span className="text-green-500">Tracker</span></h3>
                <div className="space-y-8">
                  {lifeHub.savings.map((s, i) => (
                    <div key={i} className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <span className="text-3xl mb-2 block">{s.icon}</span>
                          <h4 className="font-black uppercase tracking-widest text-xs text-gray-400">{s.name}</h4>
                        </div>
                        <p className="text-lg font-black text-white">{s.current} <span className="text-xs text-gray-600">/ {s.target}</span></p>
                      </div>
                      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: '45%' }} className="h-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Habits & Health */}
              <div className="p-10 bg-white/5 border border-white/10 rounded-[4rem] backdrop-blur-xl">
                <h3 className="text-2xl font-black font-outfit uppercase italic mb-10 flex items-center gap-3"><Leaf className="text-purple-500" /> Habit <span className="text-purple-500">Stacks</span></h3>
                <div className="space-y-4">
                  {lifeHub.habits.map((h, i) => (
                    <div key={i} className="p-6 bg-black/40 border border-white/5 rounded-3xl flex justify-between items-center group hover:border-purple-500/30 transition-all">
                      <p className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">{h}</p>
                      <div className="w-8 h-8 rounded-full border-2 border-white/10 flex items-center justify-center text-gray-700"><CheckCircle2 size={16} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {smartAnalytics && (
                  <div className="lg:col-span-3 p-10 bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-[4rem] backdrop-blur-xl flex flex-wrap gap-12 items-center justify-around">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-[var(--accent)]/10 text-[var(--accent)] rounded-[2.5rem] flex items-center justify-center mb-4"><smartAnalytics.TrendIcon size={40} /></div>
                      <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Momentum</p>
                      <h4 className="text-2xl font-black italic">{smartAnalytics.trendLabel}</h4>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-orange-500/10 text-orange-500 rounded-[2.5rem] flex items-center justify-center mb-4"><Sparkles size={40} /></div>
                      <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Power Day</p>
                      <h4 className="text-2xl font-black italic">{smartAnalytics.bestDay}</h4>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-yellow-500/10 text-yellow-500 rounded-[2.5rem] flex items-center justify-center mb-4"><Award size={40} /></div>
                      <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Perfect Score</p>
                      <h4 className="text-2xl font-black italic">{smartAnalytics.perfectDays} Days</h4>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[{ icon: <TrendingUp className="text-green-500" />, label: 'Consistency', val: smartAnalytics?.recentAvg + '%' }, { icon: <TimerIcon className="text-red-500" />, label: 'Pomodoro', val: historyData.reduce((acc, curr) => acc + Math.floor((curr.pomodoroMinutes || 0)/25), 0) }, { icon: <CalendarDays className="text-blue-500" />, label: 'System Logs', val: historyData.length }, { icon: <Smile className="text-yellow-500" />, label: 'Mood Index', val: historyData[0]?.mood || '😐' }].map((s, i) => (
                  <div key={i} className="p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-md">
                    <div className="mb-6">{s.icon}</div>
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-2">{s.label}</p>
                    <h3 className="text-5xl font-black text-white">{s.val}</h3>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
              {Object.entries(
                historyData.reduce((acc, item) => {
                  const key = new Date(item.date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
                  if (!acc[key]) acc[key] = []; acc[key].push(item); return acc;
                }, {})
              ).map(([monthKey, items]) => (
                <div key={monthKey} className="space-y-8">
                  <div className="flex items-center gap-6"><h3 className="text-2xl font-black italic tracking-tighter text-[var(--accent)] uppercase">{monthKey}</h3><div className="h-px bg-white/10 flex-1" /></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((day, i) => (
                      <div key={i} onClick={() => { setSelectedDate(day.date); setActiveTab('tasks'); }} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between group hover:bg-white/10 hover:border-[var(--accent)]/30 cursor-pointer transition-all">
                        <div className="flex items-center gap-8">
                          <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center shadow-lg">
                            <span className="text-xl font-black leading-none">{new Date(day.date).getDate()}</span>
                            <span className="text-[8px] font-black uppercase text-gray-500">{new Date(day.date).toLocaleDateString('id-ID', { weekday: 'short' })}</span>
                          </div>
                          <span className="text-2xl">{day.mood || '😐'}</span>
                          <p className="text-xs text-gray-500 font-medium italic">"{day.goals?.substring(0, 35)}..."</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-xs font-black text-[var(--accent)]">{calculateCompletionRate(day.tasks)}%</p>
                            <div className="w-12 h-1 bg-white/10 rounded-full mt-1 overflow-hidden"><div className="h-full bg-[var(--accent)]" style={{ width: `${calculateCompletionRate(day.tasks)}%` }} /></div>
                          </div>
                          <ChevronRight size={18} className="text-gray-700 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visual Calendar Modal */}
        <AnimatePresence>
          {showCalendarModal && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCalendarModal(false)} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[4rem] overflow-hidden relative shadow-2xl">
                <div className="p-12 pb-0 flex justify-between items-center">
                  <h3 className="text-4xl font-black italic tracking-tighter uppercase font-outfit">{navDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</h3>
                  <div className="flex gap-3">
                    <button onClick={() => setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() - 1, 1))} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10"><ChevronLeft size={24} /></button>
                    <button onClick={() => setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() + 1, 1))} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10"><ChevronRight size={24} /></button>
                  </div>
                </div>
                <div className="p-12 pt-10">
                  <div className="grid grid-cols-7 mb-6">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-center text-xs font-black text-gray-700 uppercase tracking-widest">{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-3">
                    {calendarDays.map((d, i) => (
                      <div key={i} className="aspect-square relative">
                        {d && (
                          <button onClick={() => { setSelectedDate(d.date); setShowCalendarModal(false); }} className={`w-full h-full rounded-2xl flex items-center justify-center text-sm font-black transition-all hover:scale-110 ${d.date === selectedDate ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' : 'bg-white/5 hover:bg-white/10 text-gray-500'}`}>
                            {d.day}
                            {d.hasData && d.date !== selectedDate && <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--accent)] rounded-full shadow-[0_0_8px_var(--accent)]" />}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
