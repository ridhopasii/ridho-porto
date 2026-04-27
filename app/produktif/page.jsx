'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Target, Zap, Smile, Timer as TimerIcon, Plus, 
  Trash2, Save, Calendar as CalendarIcon, ChevronRight,
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
  
  // Filtering States for Analytics/History
  const [viewMode, setViewMode] = useState('monthly'); // monthly, yearly
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

  // History Data (Full year for analytics)
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
      setTasks([]);
      setMood('');
      setGoals('');
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
      const comp = taskList.filter(t => t.completed).length;
      return Math.round((comp / taskList.length) * 100) || 0;
    } catch { return 0; }
  };

  const calculateStats = (currentTasks) => {
    const completed = currentTasks.filter(t => t.completed).length;
    const total = currentTasks.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    setStats(prev => ({ ...prev, completion: rate, completedCount: completed, totalCount: total }));
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

  // Filtered Data for Analytics
  const periodStats = useMemo(() => {
    const filtered = historyData.filter(item => {
      const d = new Date(item.date);
      if (viewMode === 'monthly') {
        return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
      }
      return d.getFullYear() === selectedYear;
    });

    if (filtered.length === 0) return { avg: 0, pomodoro: 0, totalDays: 0, mood: '😐' };

    const totalComp = filtered.reduce((acc, curr) => acc + calculateCompletionRate(curr.tasks), 0);
    const totalPomo = filtered.reduce((acc, curr) => acc + (curr.pomodoroMinutes || 0), 0);
    
    return {
      avg: Math.round(totalComp / filtered.length),
      pomodoro: Math.floor(totalPomo / 25),
      totalDays: filtered.length,
      mood: '😊'
    };
  }, [historyData, viewMode, selectedMonth, selectedYear]);

  // Grouped History
  const groupedHistory = useMemo(() => {
    const groups = {};
    historyData.forEach(item => {
      const d = new Date(item.date);
      const key = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [historyData]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-jakarta overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent)]/10 blur-[120px] rounded-full" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md p-10 bg-white/5 border border-white/10 rounded-[3rem] text-center backdrop-blur-xl relative z-10">
          <div className="w-20 h-20 bg-[var(--accent)]/10 text-[var(--accent)] rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <Zap size={40} />
          </div>
          <h1 className="text-3xl font-black font-outfit uppercase tracking-tighter mb-2 italic text-white">Access Locked</h1>
          <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); if (e.target.value === 'zxcvbnm') setIsAuthenticated(true); }} placeholder="••••••••" className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-center text-xl tracking-[0.5em] focus:border-[var(--accent)] outline-none text-white transition-all" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-jakarta">
      <Navbar />
      <main className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div onClick={() => setShowCalendarModal(true)} className="p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all flex items-center gap-4 group">
              <div className="w-12 h-12 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl flex flex-col items-center justify-center">
                <span className="text-[10px] font-black uppercase leading-none mb-1">{new Date(selectedDate).toLocaleDateString('id-ID', { month: 'short' })}</span>
                <span className="text-xl font-black leading-none">{new Date(selectedDate).getDate()}</span>
              </div>
              <div>
                <h2 className="text-xl font-black font-outfit uppercase tracking-tighter italic">{new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long' })}</h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{selectedDate === new Date().toISOString().split('T')[0] ? 'Current Session' : 'Historical Data'}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
            {[
              { id: 'tasks', icon: <List size={16} />, label: 'Tasks' },
              { id: 'analytics', icon: <BarChart3 size={16} />, label: 'Analytics' },
              { id: 'history', icon: <CalendarIcon size={16} />, label: 'History' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' : 'text-gray-500 hover:text-white'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'tasks' && (
            <motion.div key="tasks" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
               {/* Same Task List Content as before */}
               {tasks.length === 0 && !loading && (
                <div className="p-12 bg-white/5 border border-dashed border-white/20 rounded-[3rem] text-center">
                  <AlertCircle size={32} className="mx-auto mb-6 text-gray-600" />
                  <h3 className="text-xl font-black uppercase mb-2">No Data Found</h3>
                  <button onClick={() => fetchData(selectedDate)} className="px-8 py-4 bg-[var(--accent)] text-black font-black rounded-2xl text-xs uppercase tracking-widest">Initialize Date</button>
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
              {/* Filter Controls */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-8 bg-white/5 border border-white/10 rounded-[2.5rem] gap-6">
                <div>
                  <h3 className="text-xl font-black font-outfit uppercase tracking-tighter italic">Data <span className="text-[var(--accent)]">Insights</span></h3>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Analisis performa per periode</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <select value={viewMode} onChange={(e) => setViewMode(e.target.value)} className="bg-white/10 border-none rounded-xl p-3 text-xs font-black uppercase outline-none">
                    <option value="monthly">Monthly View</option>
                    <option value="yearly">Yearly View</option>
                  </select>
                  {viewMode === 'monthly' && (
                    <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))} className="bg-white/10 border-none rounded-xl p-3 text-xs font-black uppercase outline-none">
                      {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((m, i) => (
                        <option key={i} value={i}>{m}</option>
                      ))}
                    </select>
                  )}
                  <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="bg-white/10 border-none rounded-xl p-3 text-xs font-black uppercase outline-none">
                    {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
                  <TrendingUp size={20} className="text-green-500 mb-4" />
                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Avg Completion</p>
                  <h3 className="text-4xl font-black text-[var(--accent)]">{periodStats.avg}%</h3>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
                  <TimerIcon size={20} className="text-red-500 mb-4" />
                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Total Pomodoro</p>
                  <h3 className="text-4xl font-black">{periodStats.pomodoro} <span className="text-sm text-gray-700">Sesi</span></h3>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
                  <CalendarDays size={20} className="text-blue-500 mb-4" />
                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Days Tracked</p>
                  <h3 className="text-4xl font-black">{periodStats.totalDays} <span className="text-sm text-gray-700">Hari</span></h3>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
                  <Smile size={20} className="text-yellow-500 mb-4" />
                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Dominant Mood</p>
                  <h3 className="text-4xl font-black">{periodStats.mood}</h3>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-12">
              {Object.keys(groupedHistory).map(monthKey => (
                <div key={monthKey} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-xl font-black font-outfit uppercase italic tracking-tighter text-[var(--accent)]">{monthKey}</h3>
                    <div className="h-px bg-white/10 flex-1" />
                    <span className="text-[10px] font-black uppercase text-gray-600">{groupedHistory[monthKey].length} Logs</span>
                  </div>
                  <div className="space-y-3">
                    {groupedHistory[monthKey].map((day, i) => (
                      <div key={i} onClick={() => { setSelectedDate(day.date); setActiveTab('tasks'); }} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between group hover:bg-white/[0.07] transition-all cursor-pointer">
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center">
                            <span className="text-lg font-black leading-none">{new Date(day.date).getDate()}</span>
                            <span className="text-[8px] font-black uppercase text-gray-600">{new Date(day.date).toLocaleDateString('id-ID', { weekday: 'short' })}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{day.mood || '😐'}</span>
                              <p className="text-xs font-medium text-gray-400 italic">"{day.goals?.substring(0, 30)}..."</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-[10px] font-black text-[var(--accent)]">{calculateCompletionRate(day.tasks)}%</p>
                            <div className="w-16 h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                              <div className="h-full bg-[var(--accent)]" style={{ width: `${calculateCompletionRate(day.tasks)}%` }} />
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-gray-700 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
