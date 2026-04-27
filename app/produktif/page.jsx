'use client';
import React, { useState, useEffect, useTransition } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Target, Activity, Zap, Moon, Sun, Clipboard, 
  Download, FileText, RotateCcw, CheckCircle2, 
  Smile, Trophy, Timer as TimerIcon, Plus, 
  Trash2, Save, Calendar as CalendarIcon, ChevronRight,
  TrendingUp, BarChart3, Clock, AlertCircle,
  Flame, Award, Settings, LayoutGrid, List
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProduktifPage() {
  // States
  const [activeTab, setActiveTab] = useState('tasks'); // tasks, analytics, history
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState({
    completion: 0,
    completedCount: 0,
    totalCount: 0,
    streak: 0,
    bestStreak: 0,
    pomodoro: 0,
    avgCompletion: 0
  });
  
  // Modals & Forms
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [mood, setMood] = useState('');
  const [goals, setGoals] = useState('');
  
  // Timer State
  const [timer, setTimer] = useState(1500); // 25 mins
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
    
    // Fetch Config
    const { data: configData } = await supabase
      .from('SiteSettings')
      .select('value')
      .eq('key', 'productivity_config')
      .single();
    
    const config = configData ? JSON.parse(configData.value) : null;

    let { data, error } = await supabase
      .from('Productivity')
      .select('*')
      .eq('date', targetDate)
      .single();

    // Auto-create only for TODAY or if it's explicitly requested
    if (!data && config && targetDate === new Date().toISOString().split('T')[0]) {
      const dayType = new Date().getDay() === 0 ? 'Sunday' : (new Date().getDay() % 2 === 0 ? 'B' : 'A');
      let block2 = dayType === 'A' ? config.block2A : (dayType === 'B' ? config.block2B : config.block2Sunday);
      
      const allTasks = [
        ...(config.block1 || []).map(t => ({ name: t, completed: false, block: 1 })),
        ...(block2 || []).map(t => ({ name: t, completed: false, block: 2 })),
        ...(config.block3 || []).map(t => ({ name: t, completed: false, block: 3 }))
      ];

      const { data: newData } = await supabase
        .from('Productivity')
        .insert([{ 
          date: targetDate, 
          tasks: JSON.stringify(allTasks),
          dayType: dayType
        }])
        .select()
        .single();
      
      data = newData;
    }

    if (data) {
      setTasks(JSON.parse(data.tasks));
      setMood(data.mood || '');
      setGoals(data.goals || '');
      setStats(prev => ({ ...prev, pomodoro: data.pomodoroMinutes || 0 }));
      calculateStats(JSON.parse(data.tasks));
    } else {
      // No data for this date
      setTasks([]);
      setMood('');
      setGoals('');
      setStats(prev => ({ ...prev, completion: 0, completedCount: 0, totalCount: 0, pomodoro: 0 }));
    }
    setLoading(false);
  };

  const createDataForPastDate = async () => {
    setLoading(true);
    const supabase = createClient();
    
    const { data: configData } = await supabase
      .from('SiteSettings')
      .select('value')
      .eq('key', 'productivity_config')
      .single();
    
    const config = configData ? JSON.parse(configData.value) : null;
    if (!config) return;

    const dateObj = new Date(selectedDate);
    const dayType = dateObj.getDay() === 0 ? 'Sunday' : (dateObj.getDay() % 2 === 0 ? 'B' : 'A');
    let block2 = dayType === 'A' ? config.block2A : (dayType === 'B' ? config.block2B : config.block2Sunday);
    
    const allTasks = [
      ...(config.block1 || []).map(t => ({ name: t, completed: false, block: 1 })),
      ...(block2 || []).map(t => ({ name: t, completed: false, block: 2 })),
      ...(config.block3 || []).map(t => ({ name: t, completed: false, block: 3 }))
    ];

    const { data: newData } = await supabase
      .from('Productivity')
      .insert([{ 
        date: selectedDate, 
        tasks: JSON.stringify(allTasks),
        dayType: dayType
      }])
      .select()
      .single();

    if (newData) {
      setTasks(allTasks);
      calculateStats(allTasks);
    }
    setLoading(false);
  };

  const fetchHistory = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('Productivity')
      .select('*')
      .order('date', { ascending: false })
      .limit(30);
    
    if (data) {
      setHistoryData(data);
      // Calculate Streaks & Averages from history
      const totalComp = data.reduce((acc, curr) => acc + calculateCompletionRate(JSON.parse(curr.tasks)), 0);
      setStats(prev => ({
        ...prev,
        avgCompletion: Math.round(totalComp / data.length) || 0
      }));
    }
  };

  const calculateCompletionRate = (taskList) => {
    const comp = taskList.filter(t => t.completed).length;
    return Math.round((comp / taskList.length) * 100);
  };

  const calculateStats = (currentTasks) => {
    const completed = currentTasks.filter(t => t.completed).length;
    const total = currentTasks.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    setStats(prev => ({
      ...prev,
      completion: rate,
      completedCount: completed,
      totalCount: total
    }));
  };

  const toggleTask = async (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
    calculateStats(newTasks);

    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];
    await supabase
      .from('Productivity')
      .update({ tasks: JSON.stringify(newTasks) })
      .eq('date', today);
  };

  const saveMood = async (m) => {
    setMood(m);
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('Productivity').update({ mood: m }).eq('date', today);
    setShowMoodModal(false);
  };

  const saveGoals = async () => {
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('Productivity').update({ goals: goals }).eq('date', today);
    setShowGoalsModal(false);
  };

  // Timer Logic
  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setTimerActive(false);
      // Update Pomodoro in DB
      const updatePomodoro = async () => {
        const supabase = createClient();
        const today = new Date().toISOString().split('T')[0];
        await supabase.rpc('increment_pomodoro', { row_date: today });
        setStats(prev => ({ ...prev, pomodoro: prev.pomodoro + 25 }));
      };
      updatePomodoro();
      alert('Pomodoro Selesai! Waktunya istirahat ☕');
      setTimer(1500);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-jakarta overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent)]/10 blur-[120px] rounded-full" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-10 bg-white/5 border border-white/10 rounded-[3rem] text-center backdrop-blur-xl relative z-10"
        >
          <div className="w-20 h-20 bg-[var(--accent)]/10 text-[var(--accent)] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner shadow-[var(--accent)]/20">
            <Zap size={40} />
          </div>
          <h1 className="text-3xl font-black font-outfit uppercase tracking-tighter mb-2 italic">Access Locked</h1>
          <p className="text-gray-500 mb-8 font-medium">Authentication required to access the productivity vault.</p>
          
          <input 
            type="password" 
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (e.target.value === 'zxcvbnm') setIsAuthenticated(true);
            }}
            placeholder="••••••••"
            className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-center text-xl tracking-[0.5em] focus:border-[var(--accent)] outline-none transition-all placeholder:tracking-normal placeholder:text-white/10"
          />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-jakarta">
      <Navbar />

      <main className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Date Selector & Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div 
              onClick={() => setShowCalendarModal(true)}
              className="p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all flex items-center gap-4 group"
            >
              <div className="w-12 h-12 bg-[var(--accent)]/10 text-[var(--accent)] rounded-xl flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-[10px] font-black uppercase leading-none mb-1">{new Date(selectedDate).toLocaleDateString('id-ID', { month: 'short' })}</span>
                <span className="text-xl font-black leading-none">{new Date(selectedDate).getDate()}</span>
              </div>
              <div>
                <h2 className="text-xl font-black font-outfit uppercase tracking-tighter italic flex items-center gap-2">
                  {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long' })}
                  <ChevronRight size={16} className="text-gray-600 group-hover:translate-x-1 transition-transform" />
                </h2>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  {selectedDate === new Date().toISOString().split('T')[0] ? 'Current Session' : 'Historical Data'}
                </p>
              </div>
            </div>

            {selectedDate !== new Date().toISOString().split('T')[0] && (
              <button 
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-[var(--accent)] transition-colors"
              >
                Go To Today
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-fit">
            <button 
              onClick={() => setActiveTab('tasks')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'tasks' ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' : 'text-gray-500 hover:text-white'}`}
            >
              <List size={16} /> Tasks
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' : 'text-gray-500 hover:text-white'}`}
            >
              <BarChart3 size={16} /> Analytics
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'history' ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' : 'text-gray-500 hover:text-white'}`}
            >
              <CalendarIcon size={16} /> History
            </button>
          </div>
        </div>

        {/* Calendar Modal */}
        <AnimatePresence>
          {showCalendarModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowCalendarModal(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-10 relative z-10 shadow-2xl shadow-[var(--accent)]/5"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black font-outfit uppercase tracking-tighter italic">Time <span className="text-[var(--accent)]">Traveler</span></h3>
                  <button onClick={() => setShowCalendarModal(false)} className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  <p className="text-xs text-gray-500 font-medium">Pilih tanggal untuk melihat data masa lalu atau merencanakan hari esok.</p>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setShowCalendarModal(false);
                    }}
                    className="w-full p-6 bg-white/5 border border-white/10 rounded-[2rem] text-xl font-black font-outfit text-[var(--accent)] outline-none focus:border-[var(--accent)] transition-all"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() - 1);
                        setSelectedDate(d.toISOString().split('T')[0]);
                        setShowCalendarModal(false);
                      }}
                      className="p-5 bg-white/5 border border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-white/20 transition-all"
                    >
                      Yesterday
                    </button>
                    <button 
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() + 1);
                        setSelectedDate(d.toISOString().split('T')[0]);
                        setShowCalendarModal(false);
                      }}
                      className="p-5 bg-white/5 border border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-white/20 transition-all"
                    >
                      Tomorrow
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {activeTab === 'tasks' && (
            <motion.div 
              key="tasks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Empty Data Warning */}
              {tasks.length === 0 && !loading && (
                <div className="p-12 bg-white/5 border border-dashed border-white/20 rounded-[3rem] text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-gray-600">
                    <AlertCircle size={32} />
                  </div>
                  <h3 className="text-xl font-black font-outfit uppercase tracking-tighter italic mb-2">No Data Found</h3>
                  <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm">Belum ada data produktivitas untuk tanggal {new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}.</p>
                  <button 
                    onClick={createDataForPastDate}
                    className="px-8 py-4 bg-[var(--accent)] text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-all"
                  >
                    Initialize Tracking For This Date
                  </button>
                </div>
              )}

              {tasks.length > 0 && (
                <>
                  {/* Header Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Progress */}
                <div className="lg:col-span-2 p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-10 relative overflow-hidden group">
                  <div className="absolute -right-20 -top-20 w-64 h-64 bg-[var(--accent)]/5 blur-[80px] rounded-full" />
                  
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/5" />
                      <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * stats.completion) / 100} className="text-[var(--accent)] transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black font-outfit italic">{stats.completion}%</span>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Progress</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                      <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter italic">Daily Mission</h2>
                      <p className="text-gray-500 font-medium">Selesaikan tugas harian untuk menjaga momentum produktivitas kamu.</p>
                    </div>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="px-5 py-3 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Tuntas</p>
                        <p className="text-xl font-black">{stats.completedCount} <span className="text-sm text-gray-700">/ {stats.totalCount}</span></p>
                      </div>
                      <div className="px-5 py-3 bg-[var(--accent)]/10 rounded-2xl border border-[var(--accent)]/20">
                        <p className="text-[10px] text-[var(--accent)] font-black uppercase tracking-widest mb-1">Streak</p>
                        <p className="text-xl font-black text-[var(--accent)] flex items-center gap-2">
                          <Flame size={20} /> 12 Hari
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Card */}
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-black font-outfit uppercase tracking-widest text-[10px] text-gray-500">Quick Tools</h3>
                    <div className="flex gap-2">
                      <button onClick={() => setShowMoodModal(true)} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-yellow-500 transition-all shadow-lg" title="Mood Tracker">
                        {mood ? <span className="text-lg">{mood}</span> : <Smile size={20} />}
                      </button>
                      <button onClick={() => setShowGoalsModal(true)} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-green-500 transition-all shadow-lg" title="Daily Goals">
                        <Target size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:border-[var(--accent)]/30 transition-all group" onClick={() => setShowTimerModal(true)}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <TimerIcon size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase tracking-widest">Focus Mode</p>
                            <p className="text-[10px] text-gray-500 font-bold">{Math.floor(stats.pomodoro / 25)} sesi tuntas hari ini</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-600" />
                      </div>
                    </div>
                    
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-2">Today's Goal</p>
                      <p className="text-xs font-medium text-gray-300 italic">
                        {goals || "Belum ada goals yang diset..."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Block 1 */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="text-lg font-black font-outfit uppercase tracking-tighter flex items-center gap-3 italic">
                      <span className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">01</span>
                      Foundation
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {tasks.filter(t => t.block === 1).map((task, idx) => {
                      const globalIdx = tasks.findIndex(t => t.name === task.name);
                      return (
                        <motion.button 
                          whileTap={{ scale: 0.98 }}
                          key={idx}
                          onClick={() => toggleTask(globalIdx)}
                          className={`w-full p-5 rounded-3xl border text-left transition-all flex items-center justify-between group relative overflow-hidden ${
                            task.completed 
                              ? 'bg-[var(--accent)]/10 border-[var(--accent)]/40 text-[var(--accent)]' 
                              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          <span className="font-bold text-sm z-10">{task.name}</span>
                          <div className="z-10">
                            {task.completed ? <CheckCircle2 size={18} /> : <div className="w-5 h-5 rounded-xl border-2 border-white/10 group-hover:border-[var(--accent)]/50 transition-colors" />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Block 2 */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="text-lg font-black font-outfit uppercase tracking-tighter flex items-center gap-3 italic">
                      <span className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center border border-orange-500/20">02</span>
                      Deep Rotation
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {tasks.filter(t => t.block === 2).map((task, idx) => {
                      const globalIdx = tasks.findIndex(t => t.name === task.name);
                      return (
                        <motion.button 
                          whileTap={{ scale: 0.98 }}
                          key={idx}
                          onClick={() => toggleTask(globalIdx)}
                          className={`w-full p-5 rounded-3xl border text-left transition-all flex items-center justify-between group relative overflow-hidden ${
                            task.completed 
                              ? 'bg-[var(--accent)]/10 border-[var(--accent)]/40 text-[var(--accent)]' 
                              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          <span className="font-bold text-sm z-10">{task.name}</span>
                          <div className="z-10">
                            {task.completed ? <CheckCircle2 size={18} /> : <div className="w-5 h-5 rounded-xl border-2 border-white/10 group-hover:border-[var(--accent)]/50 transition-colors" />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Block 3 */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <h2 className="text-lg font-black font-outfit uppercase tracking-tighter flex items-center gap-3 italic">
                      <span className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center border border-purple-500/20">03</span>
                      Maintenance
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {tasks.filter(t => t.block === 3).map((task, idx) => {
                      const globalIdx = tasks.findIndex(t => t.name === task.name);
                      return (
                        <motion.button 
                          whileTap={{ scale: 0.98 }}
                          key={idx}
                          onClick={() => toggleTask(globalIdx)}
                          className={`w-full p-5 rounded-3xl border text-left transition-all flex items-center justify-between group relative overflow-hidden ${
                            task.completed 
                              ? 'bg-[var(--accent)]/10 border-[var(--accent)]/40 text-[var(--accent)]' 
                              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          <span className="font-bold text-sm z-10">{task.name}</span>
                          <div className="z-10">
                            {task.completed ? <CheckCircle2 size={18} /> : <div className="w-5 h-5 rounded-xl border-2 border-white/10 group-hover:border-[var(--accent)]/50 transition-colors" />}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div 
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              {/* Analytics Header */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Consistency Rate</p>
                  <h3 className="text-4xl font-black text-[var(--accent)]">{stats.avgCompletion}%</h3>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Total Pomodoro</p>
                  <h3 className="text-4xl font-black">{Math.floor(stats.pomodoro / 25)} <span className="text-sm text-gray-700">Sesi</span></h3>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Mood Avg</p>
                  <h3 className="text-4xl font-black">😊</h3>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Peak Productivity</p>
                  <h3 className="text-xl font-black font-outfit uppercase">Senin</h3>
                </div>
              </div>

              {/* Achievements Grid */}
              <div className="space-y-6">
                <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter flex items-center gap-3 italic">
                  <Award className="text-yellow-500" /> Unlockable Achievements
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[
                    { name: 'Early Bird', icon: '🌅', locked: false, desc: '5 hari Subuh on time' },
                    { name: 'Focus Master', icon: '🧠', locked: false, desc: '10 jam Deep Work' },
                    { name: 'Consistent', icon: '🔥', locked: true, desc: 'Streak 14 hari' },
                    { name: 'Perfect Week', icon: '💎', locked: true, desc: '7 hari 100%' },
                    { name: 'Polyglot', icon: '🗣️', locked: false, desc: '50 vocab baru' },
                    { name: 'The Architect', icon: '🏗️', locked: true, desc: 'Setup sistem baru' },
                  ].map((ach, i) => (
                    <div key={i} className={`p-6 rounded-[2rem] border text-center transition-all ${ach.locked ? 'bg-white/2 border-white/5 opacity-40 grayscale' : 'bg-white/5 border-white/10 hover:border-[var(--accent)]/50'}`}>
                      <div className="text-3xl mb-3">{ach.icon}</div>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-1">{ach.name}</p>
                      <p className="text-[8px] text-gray-600 font-bold uppercase">{ach.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12"
            >
              {/* Heatmap/Calendar View */}
              <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
                <h3 className="font-black font-outfit uppercase tracking-tighter mb-8 flex items-center gap-3 italic">
                  <LayoutGrid size={20} className="text-[var(--accent)]" /> Productivity Heatmap
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 70 }).map((_, i) => {
                    // Mock heatmap data
                    const opacity = [0.1, 0.2, 0.4, 0.6, 0.8, 1][Math.floor(Math.random() * 6)];
                    return (
                      <div 
                        key={i} 
                        className="w-4 h-4 rounded-sm transition-all hover:scale-125" 
                        style={{ backgroundColor: `rgba(var(--accent-rgb), ${opacity})` }}
                        title={`Day ${i}: ${Math.round(opacity * 100)}%`}
                      />
                    );
                  })}
                </div>
                <div className="mt-6 flex items-center gap-4 text-[10px] text-gray-600 font-bold uppercase">
                  <span>Less</span>
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-white/5" />
                    <div className="w-3 h-3 rounded-sm bg-[var(--accent)]/20" />
                    <div className="w-3 h-3 rounded-sm bg-[var(--accent)]/50" />
                    <div className="w-3 h-3 rounded-sm bg-[var(--accent)]" />
                  </div>
                  <span>More</span>
                </div>
              </div>

              {/* List View */}
              <div className="space-y-4">
                {historyData.map((day, i) => (
                  <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between group hover:bg-white/[0.07] transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center">
                        <span className="text-[10px] font-black text-gray-500 leading-none mb-1">
                          {new Date(day.date).toLocaleDateString('id-ID', { month: 'short' })}
                        </span>
                        <span className="text-lg font-black leading-none">
                          {new Date(day.date).getDate()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">{new Date(day.date).toLocaleDateString('id-ID', { weekday: 'long' })}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded-full font-black uppercase tracking-tighter">Day {day.dayType}</span>
                          <span className="text-lg">{day.mood || '😐'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-10 text-right">
                      <div className="hidden md:block">
                        <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Tasks</p>
                        <p className="text-sm font-bold text-gray-300">
                          {JSON.parse(day.tasks).filter(t => t.completed).length} / {JSON.parse(day.tasks).length}
                        </p>
                      </div>
                      <div className="w-24">
                        <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Progress</p>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[var(--accent)]" 
                            style={{ width: `${calculateCompletionRate(JSON.parse(day.tasks))}%` }} 
                          />
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-gray-700 group-hover:text-[var(--accent)] transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {/* Mood Modal */}
        {showMoodModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMoodModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 relative z-10"
            >
              <h3 className="text-xl font-black font-outfit uppercase tracking-tighter mb-8 italic text-center">How are you today?</h3>
              <div className="grid grid-cols-5 gap-3 mb-8">
                {['😢', '😐', '🙂', '😊', '🤩'].map(emoji => (
                  <button 
                    key={emoji}
                    onClick={() => saveMood(emoji)}
                    className={`text-3xl p-4 rounded-3xl border transition-all hover:scale-110 ${mood === emoji ? 'bg-[var(--accent)]/20 border-[var(--accent)] scale-110' : 'bg-white/5 border-white/5'}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowMoodModal(false)} className="w-full py-4 text-xs font-black uppercase tracking-widest text-gray-500">Cancel</button>
            </motion.div>
          </div>
        )}

        {/* Goals Modal */}
        {showGoalsModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGoalsModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 relative z-10"
            >
              <h3 className="text-xl font-black font-outfit uppercase tracking-tighter mb-4 italic">Primary Goal</h3>
              <p className="text-xs text-gray-500 mb-6">Fokus pada satu hal terpenting yang ingin kamu capai hari ini.</p>
              <textarea 
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="Ex: Tuntaskan landing page client A..."
                className="w-full h-32 p-5 bg-white/5 border border-white/10 rounded-3xl outline-none focus:border-[var(--accent)] transition-all resize-none mb-6"
              />
              <div className="flex gap-3">
                <button 
                  onClick={saveGoals}
                  className="flex-1 py-4 bg-[var(--accent)] text-black font-black rounded-2xl text-xs uppercase tracking-widest"
                >
                  Save Goal
                </button>
                <button onClick={() => setShowGoalsModal(false)} className="flex-1 py-4 bg-white/5 text-gray-400 font-black rounded-2xl text-xs uppercase tracking-widest">Cancel</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Timer Modal */}
        {showTimerModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTimerModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-10 relative z-10 text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-black font-outfit uppercase tracking-tighter mb-2 italic">Focus Timer</h3>
              <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-8">25 Minutes Pomodoro</p>
              
              <div className="text-7xl font-black font-outfit mb-12 tabular-nums">
                {Math.floor(timer / 60).toString().padStart(2, '0')}:
                {(timer % 60).toString().padStart(2, '0')}
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setTimerActive(!timerActive)}
                  className={`flex-1 py-4 font-black rounded-2xl text-xs uppercase tracking-widest transition-all ${timerActive ? 'bg-orange-500 text-white' : 'bg-[var(--accent)] text-black'}`}
                >
                  {timerActive ? 'Pause' : 'Start Focus'}
                </button>
                <button 
                  onClick={() => { setTimer(1500); setTimerActive(false); }}
                  className="px-6 py-4 bg-white/5 text-gray-400 font-black rounded-2xl text-xs uppercase tracking-widest"
                >
                  Reset
                </button>
              </div>
              
              <button onClick={() => setShowTimerModal(false)} className="mt-8 text-[10px] text-gray-700 font-black uppercase tracking-widest hover:text-white transition-colors">Minimize Window</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
