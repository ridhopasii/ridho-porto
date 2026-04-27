'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Target, Zap, Smile, Timer as TimerIcon, Plus, 
  Trash2, Save, Calendar as CalendarIcon, ChevronRight, ChevronLeft,
  BarChart3, Clock, AlertCircle,
  Flame, Award, LayoutGrid, List, CheckCircle2,
  Filter, TrendingUp, CalendarDays
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProduktifPage() {
  // States
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Calendar Navigation State
  const [navDate, setNavDate] = useState(new Date());

  // Filtering States for Analytics/History
  const [viewMode, setViewMode] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [stats, setStats] = useState({
    completion: 0,
    completedCount: 0,
    totalCount: 0,
    pomodoro: 0,
    avgCompletion: 0,
    totalPomodoroPeriod: 0
  });
  
  // Modals & Forms
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [mood, setMood] = useState('');
  const [goals, setGoals] = useState('');
  
  // Timer State
  const [timer, setTimer] = useState(1500);
  const [timerActive, setTimerActive] = useState(false);

  // History Data
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData(selectedDate);
      fetchHistory();
    }
  }, [isAuthenticated, selectedDate]);

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
    const { data } = await supabase.from('Productivity').select('date, tasks, mood, goals, pomodoroMinutes').order('date', { ascending: false });
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

  const saveMood = async (m) => {
    setMood(m);
    const supabase = createClient();
    await supabase.from('Productivity').update({ mood: m }).eq('date', selectedDate);
    setShowMoodModal(false);
  };

  const saveGoals = async () => {
    const supabase = createClient();
    await supabase.from('Productivity').update({ goals: goals }).eq('date', selectedDate);
    setShowGoalsModal(false);
  };

  // Calendar Logic
  const calendarDays = useMemo(() => {
    const year = navDate.getFullYear();
    const month = navDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Padding for first week
    for (let i = 0; i < firstDay; i++) days.push(null);
    // Real days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      const hasData = historyData.some(h => h.date === dateStr);
      days.push({ day: i, date: dateStr, hasData });
    }
    return days;
  }, [navDate, historyData]);

  // Analytics Helpers
  const periodStats = useMemo(() => {
    const filtered = historyData.filter(item => {
      const d = new Date(item.date);
      return viewMode === 'monthly' ? (d.getMonth() === selectedMonth && d.getFullYear() === selectedYear) : (d.getFullYear() === selectedYear);
    });
    if (filtered.length === 0) return { avg: 0, pomodoro: 0, totalDays: 0, mood: '😐' };
    const totalComp = filtered.reduce((acc, curr) => acc + calculateCompletionRate(curr.tasks), 0);
    const totalPomo = filtered.reduce((acc, curr) => acc + (curr.pomodoroMinutes || 0), 0);
    return { avg: Math.round(totalComp / filtered.length), pomodoro: Math.floor(totalPomo / 25), totalDays: filtered.length, mood: '😊' };
  }, [historyData, viewMode, selectedMonth, selectedYear]);

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
    <div className="min-h-screen bg-[#050505] text-white font-jakarta">
      <Navbar />
      <main className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Date Display */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div onClick={() => { setNavDate(new Date(selectedDate)); setShowCalendarModal(true); }} className="p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all flex items-center gap-4 group">
            <div className="w-12 h-12 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl flex flex-col items-center justify-center">
              <span className="text-[10px] font-black uppercase leading-none mb-1">{new Date(selectedDate).toLocaleDateString('id-ID', { month: 'short' })}</span>
              <span className="text-xl font-black leading-none">{new Date(selectedDate).getDate()}</span>
            </div>
            <div>
              <h2 className="text-xl font-black font-outfit uppercase tracking-tighter italic">{new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long' })}</h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{selectedDate === new Date().toISOString().split('T')[0] ? 'Session Active' : 'Archive View'}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
            {[
              { id: 'tasks', icon: <List size={16} />, label: 'Tasks' },
              { id: 'analytics', icon: <BarChart3 size={16} />, label: 'Analytics' },
              { id: 'history', icon: <CalendarIcon size={16} />, label: 'History' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' : 'text-gray-500 hover:text-white'}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'tasks' && (
            <motion.div key="tasks" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
               {tasks.length === 0 && !loading && (
                <div className="p-12 bg-white/5 border border-dashed border-white/20 rounded-[3rem] text-center">
                  <AlertCircle size={32} className="mx-auto mb-6 text-gray-600" />
                  <h3 className="text-xl font-black uppercase mb-4 italic">No Logs For This Day</h3>
                  <button onClick={() => fetchData(selectedDate)} className="px-8 py-4 bg-[var(--accent)] text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-all">Start Tracking Now</button>
                </div>
              )}
              {tasks.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map(blockNum => (
                    <div key={blockNum} className="space-y-6">
                      <h2 className="text-lg font-black font-outfit uppercase tracking-tighter flex items-center gap-3 italic">
                        <span className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">0{blockNum}</span>
                        {blockNum === 1 ? 'Foundation' : blockNum === 2 ? 'Deep Work' : 'Maintenance'}
                      </h2>
                      <div className="space-y-3">
                        {tasks.filter(t => t.block === blockNum).map((task, idx) => {
                          const globalIdx = tasks.findIndex(t => t.name === task.name);
                          return (
                            <button key={idx} onClick={() => toggleTask(globalIdx)} className={`w-full p-5 rounded-3xl border text-left transition-all flex items-center justify-between group ${task.completed ? 'bg-[var(--accent)]/10 border-[var(--accent)]/40 text-[var(--accent)]' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                              <span className="font-bold text-sm">{task.name}</span>
                              {task.completed ? <CheckCircle2 size={18} /> : <div className="w-5 h-5 rounded-xl border-2 border-white/10" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
              <div className="flex flex-col md:flex-row justify-between items-center p-8 bg-white/5 border border-white/10 rounded-[2.5rem] gap-6">
                <h3 className="text-xl font-black font-outfit uppercase tracking-tighter italic">Data <span className="text-[var(--accent)]">Insights</span></h3>
                <div className="flex gap-3">
                  <select value={viewMode} onChange={(e) => setViewMode(e.target.value)} className="bg-white/10 border-none rounded-xl p-3 text-xs font-black uppercase outline-none">
                    <option value="monthly">Monthly</option><option value="yearly">Yearly</option>
                  </select>
                  {viewMode === 'monthly' && (
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="bg-white/10 border-none rounded-xl p-3 text-xs font-black uppercase outline-none">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                  )}
                  <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="bg-white/10 border-none rounded-xl p-3 text-xs font-black uppercase outline-none">
                    {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[{ icon: <TrendingUp className="text-green-500" />, label: 'Avg Completion', val: periodStats.avg + '%' }, { icon: <TimerIcon className="text-red-500" />, label: 'Total Pomodoro', val: periodStats.pomodoro }, { icon: <CalendarDays className="text-blue-500" />, label: 'Days Tracked', val: periodStats.totalDays }, { icon: <Smile className="text-yellow-500" />, label: 'Dominant Mood', val: periodStats.mood }].map((s, i) => (
                  <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
                    <div className="mb-4">{s.icon}</div>
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">{s.label}</p>
                    <h3 className="text-4xl font-black text-white">{s.val}</h3>
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
                <div key={monthKey} className="space-y-6">
                  <div className="flex items-center gap-4"><h3 className="text-xl font-black italic tracking-tighter text-[var(--accent)]">{monthKey}</h3><div className="h-px bg-white/10 flex-1" /></div>
                  <div className="space-y-3">
                    {items.map((day, i) => (
                      <div key={i} onClick={() => { setSelectedDate(day.date); setActiveTab('tasks'); }} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between group hover:bg-white/[0.07] cursor-pointer">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center">
                            <span className="text-lg font-black leading-none">{new Date(day.date).getDate()}</span>
                            <span className="text-[8px] font-black uppercase text-gray-600">{new Date(day.date).toLocaleDateString('id-ID', { weekday: 'short' })}</span>
                          </div>
                          <span className="text-lg">{day.mood || '😐'}</span>
                          <p className="text-xs text-gray-400 italic">"{day.goals?.substring(0, 40)}..."</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs font-black text-[var(--accent)]">{calculateCompletionRate(day.tasks)}%</span>
                          <ChevronRight size={16} className="text-gray-700" />
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
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCalendarModal(false)} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-lg bg-[#0d0d0d] border border-white/10 rounded-[3.5rem] overflow-hidden relative shadow-2xl">
                {/* Calendar Header */}
                <div className="p-10 pb-0 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase">{navDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() - 1, 1))} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10"><ChevronLeft size={20} /></button>
                    <button onClick={() => setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() + 1, 1))} className="p-3 bg-white/5 rounded-2xl hover:bg-white/10"><ChevronRight size={20} /></button>
                  </div>
                </div>

                {/* Grid */}
                <div className="p-10 pt-8">
                  <div className="grid grid-cols-7 mb-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-center text-[10px] font-black text-gray-600 uppercase">{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((d, i) => (
                      <div key={i} className="aspect-square relative">
                        {d && (
                          <button 
                            onClick={() => { setSelectedDate(d.date); setShowCalendarModal(false); }}
                            className={`w-full h-full rounded-2xl flex items-center justify-center text-sm font-black transition-all hover:scale-110 ${d.date === selectedDate ? 'bg-[var(--accent)] text-black' : 'bg-white/5 hover:bg-white/10 text-gray-400'} ${d.date === new Date().toISOString().split('T')[0] && d.date !== selectedDate ? 'border border-[var(--accent)]/50' : ''}`}
                          >
                            {d.day}
                            {d.hasData && d.date !== selectedDate && (
                              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[var(--accent)] rounded-full" />
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-10 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-600">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[var(--accent)] rounded-full" /> Logged Entry</div>
                    <button onClick={() => setShowCalendarModal(false)} className="text-white hover:text-[var(--accent)]">Close Engine</button>
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
