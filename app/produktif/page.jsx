'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Target, Zap, Smile, Timer as TimerIcon, Plus, 
  Trash2, Save, Calendar as CalendarIcon, ChevronRight, ChevronLeft,
  BarChart3, Clock, AlertCircle, CalendarDays,
  Flame, Award, LayoutGrid, List, CheckCircle2,
  TrendingUp, Sparkles, TrendingDown, Minus,
  Wallet, Rocket, Leaf, ShieldCheck, Settings, BookOpen
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProduktifPage() {
  const [activeTab, setActiveTab] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  
  // Data States
  const [tasks, setTasks] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [yearlyPlans, setYearlyPlans] = useState([]);
  const [savings, setSavings] = useState([]);
  const [habitConfigs, setHabitConfigs] = useState([]);
  const [monthlyTracker, setMonthlyTracker] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  // UI States
  const [navDate, setNavDate] = useState(new Date());
  const [stats, setStats] = useState({ completion: 0, completedCount: 0, totalCount: 0, pomodoro: 0 });
  const [mood, setMood] = useState('');
  const [goals, setGoals] = useState('');
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated, selectedDate]);

  const fetchAllData = async () => {
    setLoading(true);
    const supabase = createClient();
    
    // 1. Fetch Daily Productivity
    const { data: configData } = await supabase.from('SiteSettings').select('value').eq('key', 'productivity_config').single();
    const config = configData ? JSON.parse(configData.value) : null;
    let { data: prodData } = await supabase.from('Productivity').select('*').eq('date', selectedDate).single();

    if (!prodData && config && selectedDate === new Date().toISOString().split('T')[0]) {
      const dayType = new Date().getDay() === 0 ? 'Sunday' : (new Date().getDay() % 2 === 0 ? 'B' : 'A');
      let block2 = dayType === 'A' ? config.block2A : (dayType === 'B' ? config.block2B : config.block2Sunday);
      const allTasks = [
        ...(config.block1 || []).map(t => ({ name: t, completed: false, block: 1 })),
        ...(block2 || []).map(t => ({ name: t, completed: false, block: 2 })),
        ...(config.block3 || []).map(t => ({ name: t, completed: false, block: 3 }))
      ];
      const { data: newData } = await supabase.from('Productivity').insert([{ date: selectedDate, tasks: JSON.stringify(allTasks), dayType: dayType }]).select().single();
      prodData = newData;
    }

    if (prodData) {
      const parsedTasks = JSON.parse(prodData.tasks);
      setTasks(parsedTasks);
      setMood(prodData.mood || '');
      setGoals(prodData.goals || '');
      calculateStats(parsedTasks, prodData.pomodoroMinutes);
    } else {
      setTasks([]); setMood(''); setGoals('');
      setStats({ completion: 0, completedCount: 0, totalCount: 0, pomodoro: 0 });
    }

    // 2. Fetch History
    const { data: hist } = await supabase.from('Productivity').select('*').order('date', { ascending: false });
    if (hist) setHistoryData(hist);

    // 3. Fetch Yearly Plans
    const { data: yearly } = await supabase.from('YearlyPlan').select('*').order('sortOrder', { ascending: true });
    if (yearly) setYearlyPlans(yearly);

    // 4. Fetch Savings
    const { data: sav } = await supabase.from('TabunganUmroh').select('*').order('id', { ascending: true });
    if (sav) setSavings(sav);

    // 5. Fetch Habit Configs & Monthly Tracker
    const { data: habits } = await supabase.from('HabitConfig').select('*').eq('isActive', true).order('sortOrder', { ascending: true });
    if (habits) setHabitConfigs(habits);

    const { data: monthTrack } = await supabase.from('MonthlyTracker').select('*').eq('date', selectedDate).single();
    if (monthTrack) {
      setMonthlyTracker(monthTrack.checklist || {});
    } else {
      // Initialize if doesn't exist
      const initChecklist = {};
      habits?.forEach(h => { initChecklist[h.id] = false; });
      const { data: newMonthTrack } = await supabase.from('MonthlyTracker').insert([{ date: selectedDate, checklist: initChecklist }]).select().single();
      if (newMonthTrack) setMonthlyTracker(newMonthTrack.checklist || {});
    }

    setLoading(false);
  };

  const calculateCompletionRate = (taskListJson) => {
    try {
      const taskList = JSON.parse(taskListJson);
      if(taskList.length === 0) return 0;
      return Math.round((taskList.filter(t => t.completed).length / taskList.length) * 100);
    } catch { return 0; }
  };

  const calculateStats = (currentTasks, pomodoro) => {
    const completed = currentTasks.filter(t => t.completed).length;
    const total = currentTasks.length;
    setStats({ 
      completion: total > 0 ? Math.round((completed / total) * 100) : 0, 
      completedCount: completed, 
      totalCount: total,
      pomodoro: pomodoro || 0
    });
  };

  const toggleTask = async (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
    calculateStats(newTasks, stats.pomodoro);
    const supabase = createClient();
    await supabase.from('Productivity').update({ tasks: JSON.stringify(newTasks) }).eq('date', selectedDate);
  };

  const toggleMonthlyHabit = async (habitId) => {
    const updatedChecklist = { ...monthlyTracker, [habitId]: !monthlyTracker[habitId] };
    setMonthlyTracker(updatedChecklist);
    const supabase = createClient();
    await supabase.from('MonthlyTracker').update({ checklist: updatedChecklist }).eq('date', selectedDate);
  };

  // Smart Analytics Calculation
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
          <Zap size={40} className="mx-auto mb-8 text-[var(--accent)] animate-pulse" />
          <h1 className="text-3xl font-black mb-8 italic text-white uppercase tracking-tighter">Enter Vault</h1>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => { 
              setPassword(e.target.value); 
              if (e.target.value === 'zxcvbnm') setIsAuthenticated(true); 
            }} 
            placeholder="••••••••" 
            className="w-full p-5 bg-black/50 border border-white/10 rounded-2xl text-center text-xl tracking-[0.5em] focus:border-[var(--accent)] outline-none text-white transition-all" 
          />
        </div>
      </div>
    );
  }

  // Format IDR helper
  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-jakarta overflow-x-hidden">
      <Navbar />
      <main className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Navigation & Date Picker */}
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
              { id: 'daily', icon: <List size={18} />, label: 'Daily' },
              { id: 'monthly', icon: <CalendarDays size={18} />, label: 'Monthly Habit' },
              { id: 'hub', icon: <Rocket size={18} />, label: 'Life Hub' },
              { id: 'analytics', icon: <BarChart3 size={18} />, label: 'Insights' },
              { id: 'history', icon: <Clock size={18} />, label: 'Archive' }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`px-4 md:px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-[var(--accent)] text-black shadow-xl shadow-[var(--accent)]/20 scale-105' : 'text-gray-500 hover:text-white'}`}
              >
                {tab.icon} <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* DAILY TASKS TAB */}
          {activeTab === 'daily' && (
            <motion.div key="daily" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
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
                            <button key={idx} onClick={() => toggleTask(globalIdx)} className={`w-full p-5 rounded-3xl border text-left transition-all flex items-center justify-between group ${task.completed ? 'bg-[var(--accent)]/10 border-[var(--accent)]/40 text-[var(--accent)]' : 'bg-black/40 border-white/5 text-gray-400 hover:border-white/20'}`}>
                              <span className="font-bold text-sm tracking-tight">{task.name}</span>
                              <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all flex-shrink-0 ${task.completed ? 'bg-[var(--accent)] border-[var(--accent)] text-black' : 'border-white/10 group-hover:border-[var(--accent)]/50'}`}>
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
                  <button onClick={() => fetchAllData()} className="px-10 py-5 bg-[var(--accent)] text-black font-black rounded-3xl text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-[var(--accent)]/20">Initialize Today's Log</button>
                </div>
              )}
            </motion.div>
          )}

          {/* MONTHLY HABITS TAB */}
          {activeTab === 'monthly' && (
            <motion.div key="monthly" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="p-8 md:p-10 bg-white/5 border border-white/10 rounded-[4rem] backdrop-blur-xl">
                <h3 className="text-2xl font-black font-outfit uppercase italic mb-2 flex items-center gap-3">
                  <CalendarDays className="text-[var(--accent)]" /> Monthly <span className="text-[var(--accent)]">Habits Tracker</span>
                </h3>
                <p className="text-gray-400 text-sm mb-10 font-medium">Lacak ibadah, kesehatan, dan pengembangan diri harian kamu di sini.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {['ibadah', 'kesehatan', 'produktivitas', 'pengembangan_diri'].map(category => {
                    const habitsInCategory = habitConfigs.filter(h => h.category === category);
                    if (habitsInCategory.length === 0) return null;
                    return (
                      <div key={category} className="p-6 bg-black/40 border border-white/5 rounded-[2rem]">
                        <h4 className="text-xs font-black uppercase tracking-widest text-[var(--accent)] mb-6">
                          {category.replace('_', ' ')}
                        </h4>
                        <div className="space-y-3">
                          {habitsInCategory.map((habit) => (
                            <button 
                              key={habit.id} 
                              onClick={() => toggleMonthlyHabit(habit.id)}
                              className={`w-full p-4 rounded-2xl flex items-center justify-between border transition-all ${
                                monthlyTracker[habit.id] 
                                ? 'bg-[var(--accent)]/20 border-[var(--accent)]/50 text-[var(--accent)]' 
                                : 'bg-white/5 border-transparent text-gray-400 hover:border-white/10 hover:bg-white/10'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span>{habit.icon}</span>
                                <span className="font-bold text-sm text-left">{habit.name}</span>
                              </div>
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                                monthlyTracker[habit.id] ? 'bg-[var(--accent)] border-[var(--accent)] text-black' : 'border-gray-600'
                              }`}>
                                {monthlyTracker[habit.id] && <CheckCircle2 size={12} strokeWidth={4} />}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* LIFE HUB TAB (YEARLY & SAVINGS) */}
          {activeTab === 'hub' && (
            <motion.div key="hub" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10">
              
              {/* Tabungan Umroh Tracker */}
              <div className="p-8 md:p-10 bg-gradient-to-br from-green-500/5 to-emerald-500/10 border border-green-500/20 rounded-[4rem] backdrop-blur-xl">
                <h3 className="text-2xl font-black font-outfit uppercase italic mb-8 flex items-center gap-3">
                  <Wallet className="text-green-500" /> Tabungan <span className="text-green-500">Umroh Tracker</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {savings.map((s, i) => {
                    const percentage = s.target > 0 ? Math.min(Math.round((Number(s.amount) / Number(s.target)) * 100), 100) : 0;
                    return (
                      <div key={i} className="p-6 bg-black/40 border border-green-500/10 rounded-3xl space-y-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-2xl flex items-center justify-center text-2xl">
                            {s.category === 'diri_sendiri' ? '🕌' : s.category === 'mahram' ? '👤' : s.category === 'keluarga' ? '👨‍👩‍👧‍👦' : '🤲'}
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Tabungan</p>
                            <h4 className="font-bold text-sm capitalize">{s.category.replace('_', ' ')}</h4>
                          </div>
                        </div>
                        <div>
                          <p className="text-2xl font-black text-white">{formatIDR(s.amount)}</p>
                          <p className="text-xs text-gray-500 font-medium mt-1">Target: {formatIDR(s.target)}</p>
                        </div>
                        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className="h-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                        </div>
                        <div className="text-right text-xs font-black text-green-500">{percentage}% Tercapai</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Yearly Plans Viewer */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {['mindset', 'skill', 'health', 'family'].map(cat => {
                  const plans = yearlyPlans.filter(p => p.category === cat);
                  if (plans.length === 0) return null;
                  
                  const icon = cat === 'mindset' ? <BookOpen size={24} className="text-blue-500" /> :
                               cat === 'skill' ? <Target size={24} className="text-orange-500" /> :
                               cat === 'health' ? <Leaf size={24} className="text-green-500" /> :
                               <ShieldCheck size={24} className="text-pink-500" />;
                  
                  const titleColor = cat === 'mindset' ? 'text-blue-500' :
                                     cat === 'skill' ? 'text-orange-500' :
                                     cat === 'health' ? 'text-green-500' : 'text-pink-500';

                  return (
                    <div key={cat} className="p-8 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-xl relative overflow-hidden group">
                      <div className="flex items-center gap-4 mb-8">
                        <div className={`p-3 bg-white/5 rounded-2xl border border-white/10 ${titleColor}`}>
                          {icon}
                        </div>
                        <h3 className={`text-xl font-black font-outfit uppercase italic ${titleColor}`}>{cat} <span className="text-white">Growth</span></h3>
                      </div>
                      <div className="space-y-4 relative z-10">
                        {plans.map((plan, i) => (
                          <div key={i} className="p-5 bg-black/40 rounded-2xl border border-white/5 group hover:border-white/20 transition-all">
                            <p className="font-bold text-gray-200 text-sm leading-relaxed mb-3">{plan.item}</p>
                            {(plan.monthlyHabit || plan.weeklyHabit || plan.dailyHabit) && (
                              <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-2">
                                {plan.dailyHabit && <div className="text-[10px] text-gray-500 font-medium"><span className="text-white block font-bold mb-1">Daily</span>{plan.dailyHabit}</div>}
                                {plan.weeklyHabit && <div className="text-[10px] text-gray-500 font-medium"><span className="text-white block font-bold mb-1">Weekly</span>{plan.weeklyHabit}</div>}
                                {plan.monthlyHabit && <div className="text-[10px] text-gray-500 font-medium"><span className="text-white block font-bold mb-1">Monthly</span>{plan.monthlyHabit}</div>}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ANALYTICS TAB */}
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
                {[{ icon: <TrendingUp className="text-green-500" />, label: 'Consistency', val: (smartAnalytics?.recentAvg || 0) + '%' }, { icon: <TimerIcon className="text-red-500" />, label: 'Pomodoro', val: historyData.reduce((acc, curr) => acc + Math.floor((curr.pomodoroMinutes || 0)/25), 0) }, { icon: <CalendarDays className="text-blue-500" />, label: 'System Logs', val: historyData.length }, { icon: <Smile className="text-yellow-500" />, label: 'Mood Index', val: historyData[0]?.mood || '😐' }].map((s, i) => (
                  <div key={i} className="p-8 md:p-10 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-md">
                    <div className="mb-6">{s.icon}</div>
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-2">{s.label}</p>
                    <h3 className="text-4xl md:text-5xl font-black text-white">{s.val}</h3>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* HISTORY/ARCHIVE TAB */}
          {activeTab === 'history' && (
            <motion.div key="history" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
              {historyData.length === 0 ? (
                <div className="p-20 text-center text-gray-500 italic">No history available yet.</div>
              ) : (
                Object.entries(
                  historyData.reduce((acc, item) => {
                    const key = new Date(item.date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
                    if (!acc[key]) acc[key] = []; acc[key].push(item); return acc;
                  }, {})
                ).map(([monthKey, items]) => (
                  <div key={monthKey} className="space-y-8">
                    <div className="flex items-center gap-6"><h3 className="text-2xl font-black italic tracking-tighter text-[var(--accent)] uppercase">{monthKey}</h3><div className="h-px bg-white/10 flex-1" /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {items.map((day, i) => (
                        <div key={i} onClick={() => { setSelectedDate(day.date); setActiveTab('daily'); }} className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between group hover:bg-white/10 hover:border-[var(--accent)]/30 cursor-pointer transition-all">
                          <div className="flex items-center gap-6 md:gap-8">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center shadow-lg">
                              <span className="text-lg md:text-xl font-black leading-none">{new Date(day.date).getDate()}</span>
                              <span className="text-[8px] font-black uppercase text-gray-500">{new Date(day.date).toLocaleDateString('id-ID', { weekday: 'short' })}</span>
                            </div>
                            <span className="text-2xl hidden sm:block">{day.mood || '😐'}</span>
                            <p className="text-xs text-gray-500 font-medium italic hidden md:block">"{day.goals?.substring(0, 35) || 'No specific goals recorded'}..."</p>
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
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visual Calendar Modal */}
        <AnimatePresence>
          {showCalendarModal && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCalendarModal(false)} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] md:rounded-[4rem] overflow-hidden relative shadow-2xl">
                <div className="p-8 md:p-12 pb-0 flex justify-between items-center">
                  <h3 className="text-2xl md:text-4xl font-black italic tracking-tighter uppercase font-outfit">{navDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</h3>
                  <div className="flex gap-2 md:gap-3">
                    <button onClick={() => setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() - 1, 1))} className="p-3 md:p-4 bg-white/5 rounded-2xl hover:bg-white/10"><ChevronLeft size={20} /></button>
                    <button onClick={() => setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() + 1, 1))} className="p-3 md:p-4 bg-white/5 rounded-2xl hover:bg-white/10"><ChevronRight size={20} /></button>
                  </div>
                </div>
                <div className="p-8 md:p-12 pt-8 md:pt-10">
                  <div className="grid grid-cols-7 mb-4 md:mb-6">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-center text-[10px] md:text-xs font-black text-gray-700 uppercase tracking-widest">{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-2 md:gap-3">
                    {calendarDays.map((d, i) => (
                      <div key={i} className="aspect-square relative">
                        {d && (
                          <button onClick={() => { setSelectedDate(d.date); setShowCalendarModal(false); }} className={`w-full h-full rounded-xl md:rounded-2xl flex items-center justify-center text-xs md:text-sm font-black transition-all hover:scale-110 ${d.date === selectedDate ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' : 'bg-white/5 hover:bg-white/10 text-gray-500'}`}>
                            {d.day}
                            {d.hasData && d.date !== selectedDate && <div className="absolute bottom-1.5 md:bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 md:w-1.5 md:h-1.5 bg-[var(--accent)] rounded-full shadow-[0_0_8px_var(--accent)]" />}
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
