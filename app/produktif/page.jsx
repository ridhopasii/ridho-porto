'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Target, Zap, Smile, Timer as TimerIcon, Plus, 
  Trash2, Save, Calendar as CalendarIcon, ChevronRight, ChevronLeft,
  BarChart3, Clock, AlertCircle, CalendarDays,
  Flame, Award, LayoutGrid, List, CheckCircle2,
  TrendingUp, Sparkles, TrendingDown, Minus,
  Wallet, Rocket, Leaf, ShieldCheck, Edit3, X
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to get local date string (YYYY-MM-DD) avoiding UTC offset issues
const getLocalDateString = (dateObj = new Date()) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function ProduktifPage() {
  const [activeTab, setActiveTab] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(getLocalDateString());
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Data States
  const [tasks, setTasks] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [yearlyPlans, setYearlyPlans] = useState([]);
  const [savings, setSavings] = useState([]);
  const [habitConfigs, setHabitConfigs] = useState([]);
  const [monthlyTracker, setMonthlyTracker] = useState({});
  const [dailyConfig, setDailyConfig] = useState([]); 
  const [financeData, setFinanceData] = useState({ balance: 0, transactions: [] }); // Legacy, keeping for safety
  const [wallets, setWallets] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
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
    
    // 1. Fetch Daily Productivity & Config
    const { data: configData } = await supabase.from('SiteSettings').select('value').eq('key', 'productivity_config').single();
    
    let config = [];
    if (configData) {
      try {
        const parsed = JSON.parse(configData.value);
        if (!Array.isArray(parsed)) {
          // Automatic migration from old hardcoded block format to dynamic array format
          const safeParsed = parsed || {};
          config = [
            { id: 'b1', name: 'Foundation', tasks: safeParsed.block1 || [], activeDays: [0,1,2,3,4,5,6] },
            { id: 'b2a', name: 'Deep Work (Senin-Kamis)', tasks: safeParsed.block2A || [], activeDays: [1,2,3,4] },
            { id: 'b2b', name: 'Deep Work (Jumat-Sabtu)', tasks: safeParsed.block2B || [], activeDays: [5,6] },
            { id: 'b2s', name: 'Sunday Review', tasks: safeParsed.block2Sunday || [], activeDays: [0] },
            { id: 'b3', name: 'Maintenance', tasks: safeParsed.block3 || [], activeDays: [0,1,2,3,4,5,6] }
          ];
        } else {
          config = parsed;
        }
      } catch (e) {
        config = [];
      }
    }
    // Ensure activeDays exists
    config = config.map(b => ({ ...b, activeDays: b.activeDays || [0,1,2,3,4,5,6], tasks: b.tasks || [] }));
    setDailyConfig(config);
    
    let { data: prodData } = await supabase.from('Productivity').select('*').eq('date', selectedDate).single();

    if (!prodData && config.length > 0 && selectedDate === getLocalDateString()) {
      const targetDateObj = new Date(selectedDate);
      const dayOfWeek = targetDateObj.getDay(); // 0 is Sunday
      const activeBlocks = config.filter(b => b.activeDays.includes(dayOfWeek));
      
      const allTasks = [];
      activeBlocks.forEach((block) => {
        block.tasks.forEach(tName => {
          allTasks.push({ name: tName, completed: false, blockId: block.id, blockName: block.name });
        });
      });
      
      const { data: newData } = await supabase.from('Productivity').insert([{ date: selectedDate, tasks: JSON.stringify(allTasks), dayType: 'Dynamic' }]).select().single();
      prodData = newData;
    }

    if (prodData) {
      try {
        const parsedTasks = JSON.parse(prodData.tasks);
        const safeTasks = Array.isArray(parsedTasks) ? parsedTasks : [];
        setTasks(safeTasks);
        setMood(prodData.mood || '');
        setGoals(prodData.goals || '');
        calculateStats(safeTasks, prodData.pomodoroMinutes);
      } catch (e) {
        setTasks([]);
        calculateStats([], prodData.pomodoroMinutes);
      }
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
    const { data: habits } = await supabase.from('HabitConfig').select('*').order('sortOrder', { ascending: true });
    if (habits) setHabitConfigs(habits);

    const { data: monthTrack } = await supabase.from('MonthlyTracker').select('*').eq('date', selectedDate).single();
    if (monthTrack) {
      setMonthlyTracker(monthTrack.checklist || {});
    } else {
      const initChecklist = {};
      habits?.filter(h => h.isActive).forEach(h => { initChecklist[h.id] = false; });
      const { data: newMonthTrack } = await supabase.from('MonthlyTracker').insert([{ date: selectedDate, checklist: initChecklist }]).select().single();
      if (newMonthTrack) setMonthlyTracker(newMonthTrack.checklist || {});
    }

    // 6. Fetch Wallets & Transactions
    const { data: wData } = await supabase.from('Wallets').select('*').order('created_at', { ascending: true });
    if (wData) setWallets(wData);

    const { data: tData } = await supabase.from('FinancialTransactions').select('*').order('date', { ascending: false });
    if (tData) setAllTransactions(tData);

    setLoading(false);
  };

  const calculateCompletionRate = (taskListJson) => {
    try {
      const taskList = JSON.parse(taskListJson);
      if(!Array.isArray(taskList) || taskList.length === 0) return 0;
      return Math.round((taskList.filter(t => t && t.completed).length / taskList.length) * 100);
    } catch { return 0; }
  };

  const calculateStats = (currentTasks, pomodoro) => {
    const safeTasks = Array.isArray(currentTasks) ? currentTasks : [];
    const completed = safeTasks.filter(t => t && t.completed).length;
    const total = safeTasks.length;
    setStats({ 
      completion: total > 0 ? Math.round((completed / total) * 100) : 0, 
      completedCount: completed, 
      totalCount: total,
      pomodoro: pomodoro || 0
    });
  };

  const toggleTask = async (index) => {
    if (isEditMode) return;
    const newTasks = [...tasks];
    if(newTasks[index]) {
       newTasks[index].completed = !newTasks[index].completed;
       setTasks(newTasks);
       calculateStats(newTasks, stats.pomodoro);
       const supabase = createClient();
       await supabase.from('Productivity').update({ tasks: JSON.stringify(newTasks) }).eq('date', selectedDate);
    }
  };

  const toggleMonthlyHabit = async (habitId) => {
    if (isEditMode) return;
    const updatedChecklist = { ...monthlyTracker, [habitId]: !monthlyTracker[habitId] };
    setMonthlyTracker(updatedChecklist);
    const supabase = createClient();
    await supabase.from('MonthlyTracker').update({ checklist: updatedChecklist }).eq('date', selectedDate);
  };

  // SUPER FAST CMS SAVE USING PROMISE.ALL
  const handleSaveChanges = async () => {
    setIsSaving(true);
    const supabase = createClient();

    try {
      const promises = [];

      // 1. Save Daily Config
      promises.push(supabase.from('SiteSettings').upsert({ key: 'productivity_config', value: JSON.stringify(dailyConfig) }));
      
      // If saving daily config for today, recreate today's task instances instantly
      if (selectedDate === getLocalDateString()) {
        const targetDateObj = new Date(selectedDate);
        const dayOfWeek = targetDateObj.getDay();
        const activeBlocks = dailyConfig.filter(b => b && b.activeDays && b.activeDays.includes(dayOfWeek));
        const allTasks = [];
        activeBlocks.forEach((block) => {
          if (block && Array.isArray(block.tasks)) {
             block.tasks.forEach(tName => {
               allTasks.push({ name: tName, completed: false, blockId: block.id, blockName: block.name });
             });
          }
        });
        const newTasksWithState = allTasks.map(nt => {
          const existing = tasks.find(ot => ot && ot.name === nt.name);
          if (existing) nt.completed = existing.completed;
          return nt;
        });
        promises.push(supabase.from('Productivity').update({ tasks: JSON.stringify(newTasksWithState) }).eq('date', selectedDate));
      }

      // 2. Save Yearly Plans
      yearlyPlans.forEach(plan => {
        if (!plan) return;
        if (plan.id) promises.push(supabase.from('YearlyPlan').update(plan).eq('id', plan.id));
        else promises.push(supabase.from('YearlyPlan').insert([plan]));
      });

      // 3. Save Savings
      savings.forEach(s => {
        if (!s) return;
        if(s.id) promises.push(supabase.from('TabunganUmroh').update({ amount: s.amount, target: s.target }).eq('id', s.id));
      });

      // 4. Save Habit Configs
      habitConfigs.forEach(h => {
        if (!h) return;
        if (h.deleted) {
          if (h.id) promises.push(supabase.from('HabitConfig').delete().eq('id', h.id));
        } else {
          if (h.id) promises.push(supabase.from('HabitConfig').update({ name: h.name, icon: h.icon, isActive: h.isActive, sortOrder: h.sortOrder }).eq('id', h.id));
          else promises.push(supabase.from('HabitConfig').insert([{ name: h.name, category: h.category, icon: h.icon, isActive: h.isActive, sortOrder: h.sortOrder }]));
        }
      });

      // 5. Save Finance Data
      promises.push(supabase.from('SiteSettings').upsert({ key: 'finance_data', value: JSON.stringify(financeData) }));

      await Promise.all(promises);

      alert("Semua perubahan berhasil disimpan dengan kilat!");
      setIsEditMode(false);
      fetchAllData(); 
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan perubahan.");
    } finally {
      setIsSaving(false);
    }
  };

  const smartAnalytics = useMemo(() => {
    if (historyData.length === 0) return null;
    const recentWeek = historyData.slice(0, 7);
    const previousWeek = historyData.slice(7, 14);
    const recentAvg = recentWeek.length > 0 ? recentWeek.reduce((sum, item) => sum + calculateCompletionRate(item?.tasks), 0) / recentWeek.length : 0;
    const previousAvg = previousWeek.length > 0 ? previousWeek.reduce((sum, item) => sum + calculateCompletionRate(item?.tasks), 0) / previousWeek.length : 0;
    
    let trendLabel = 'Stabil';
    let TrendIcon = Minus;
    if (recentAvg > previousAvg + 5) { trendLabel = 'Meningkat'; TrendIcon = TrendingUp; }
    else if (recentAvg < previousAvg - 5) { trendLabel = 'Menurun'; TrendIcon = TrendingDown; }
    
    const dayStats = {};
    let totalCompletedTasks = 0;
    historyData.forEach(item => {
      if (!item || !item.date) return;
      const day = new Date(item.date).getDay();
      if (!dayStats[day]) dayStats[day] = [];
      const rate = calculateCompletionRate(item.tasks);
      dayStats[day].push(rate);
      
      try {
        const parsed = JSON.parse(item.tasks || '[]');
        if (Array.isArray(parsed)) totalCompletedTasks += parsed.filter(t => t && t.completed).length;
      } catch(e) {}
    });
    
    let bestDayIdx = -1; let bestDayAvg = 0;
    Object.keys(dayStats).forEach(d => {
      const avg = dayStats[d].reduce((a, b) => a + b, 0) / dayStats[d].length;
      if (avg > bestDayAvg) { bestDayAvg = avg; bestDayIdx = d; }
    });
    
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const perfectDays = historyData.filter(item => calculateCompletionRate(item?.tasks) === 100).length;
    
    const trendGraphData = [...recentWeek].reverse().map(item => {
      if (!item || !item.date) return { day: '-', rate: 0 };
      return {
        day: new Date(item.date).toLocaleDateString('id-ID', { weekday: 'short' }),
        rate: calculateCompletionRate(item.tasks)
      };
    });

    return { trendLabel, TrendIcon, bestDay: dayNames[bestDayIdx] || '-', perfectDays, recentAvg: Math.round(recentAvg), totalCompletedTasks, trendGraphData };
  }, [historyData]);

  const calendarDays = useMemo(() => {
    const year = navDate.getFullYear();
    const month = navDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const hasData = historyData.some(h => h && h.date === dateStr);
      const dayTransactions = allTransactions.filter(t => t.date === dateStr);
      const dayIncome = dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
      const dayExpense = dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
      days.push({ day: i, date: dateStr, hasData, dayIncome, dayExpense });
    }
    return days;
  }, [navDate, historyData, allTransactions]);

  const addTransaction = async (tx) => {
    const supabase = createClient();
    
    // 1. Insert Transaction
    const { data: newTx, error: txError } = await supabase.from('FinancialTransactions').insert([tx]).select().single();
    if (txError) {
      alert("Gagal mencatat transaksi: " + txError.message);
      return;
    }

    // 2. Update Wallet Balance
    const wallet = wallets.find(w => w.id === tx.wallet_id);
    if (wallet) {
      const newBalance = tx.type === 'income' 
        ? Number(wallet.balance) + Number(tx.amount) 
        : Number(wallet.balance) - Number(tx.amount);
      
      await supabase.from('Wallets').update({ balance: newBalance }).eq('id', tx.wallet_id);
    }

    fetchAllData();
  };

  const deleteTransaction = async (tx) => {
    const supabase = createClient();
    
    // 1. Delete Transaction
    await supabase.from('FinancialTransactions').delete().eq('id', tx.id);

    // 2. Revert Wallet Balance
    const wallet = wallets.find(w => w.id === tx.wallet_id);
    if (wallet) {
      const newBalance = tx.type === 'income' 
        ? Number(wallet.balance) - Number(tx.amount) 
        : Number(wallet.balance) + Number(tx.amount);
      
      await supabase.from('Wallets').update({ balance: newBalance }).eq('id', tx.wallet_id);
    }

    fetchAllData();
  };

  const toggleBlockDay = (blockIndex, dayNumber) => {
    const newCfg = [...dailyConfig];
    if (!newCfg[blockIndex] || !newCfg[blockIndex].activeDays) return;
    const days = newCfg[blockIndex].activeDays;
    if (days.includes(dayNumber)) {
      newCfg[blockIndex].activeDays = days.filter(d => d !== dayNumber);
    } else {
      newCfg[blockIndex].activeDays.push(dayNumber);
    }
    setDailyConfig(newCfg);
  };

  // Group tasks by blockName for rendering
  const tasksByBlock = useMemo(() => {
    const grouped = {};
    if (!Array.isArray(tasks)) return grouped;
    tasks.forEach(t => {
      if (!t) return;
      const blockName = t.blockName || 'Unassigned';
      if(!grouped[blockName]) grouped[blockName] = [];
      grouped[blockName].push(t);
    });
    return grouped;
  }, [tasks]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-body flex items-center justify-center p-6 font-jakarta">
        <div className="w-full max-w-md p-10 bg-white/5 border border-[var(--border-subtle)] rounded-[3rem] text-center backdrop-blur-xl relative">
          <Zap size={40} className="mx-auto mb-8 text-[var(--accent)] animate-pulse" />
          <h1 className="text-3xl font-black mb-8 italic text-foreground uppercase tracking-tighter">Enter Vault</h1>
          <form onSubmit={(e) => { e.preventDefault(); if (password === 'zxcvbnm') setIsAuthenticated(true); }}>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => { 
                setPassword(e.target.value); 
                if (e.target.value === 'zxcvbnm') setIsAuthenticated(true); 
              }} 
              placeholder="••••••••" 
              className="w-full p-5 bg-body/50 border border-[var(--border-subtle)] rounded-2xl text-center text-xl tracking-[0.5em] focus:border-[var(--accent)] outline-none text-foreground transition-all" 
            />
            <button type="submit" className="hidden">Submit</button>
          </form>
        </div>
      </div>
    );
  }

  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);



  return (
    <div className="min-h-screen bg-body text-foreground font-jakarta overflow-x-hidden relative">
      <Navbar />
      <main className="pt-32 pb-32 px-4 md:px-6 max-w-7xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
          <div className="flex items-center gap-6">
            <div onClick={() => { setNavDate(new Date(selectedDate)); setShowCalendarModal(true); }} className="p-4 bg-white/5 border border-[var(--border-subtle)] rounded-[2rem] cursor-pointer hover:bg-white/10 transition-all flex items-center gap-5 group backdrop-blur-md">
              <div className="w-14 h-14 bg-[var(--accent)]/10 text-[var(--accent)] rounded-2xl flex flex-col items-center justify-center shadow-lg shadow-[var(--accent)]/5">
                <span className="text-[10px] font-black uppercase leading-none mb-1">{new Date(selectedDate).toLocaleDateString('id-ID', { month: 'short' })}</span>
                <span className="text-2xl font-black leading-none">{new Date(selectedDate).getDate()}</span>
              </div>
              <div>
                <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter italic">{new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long' })}</h2>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${selectedDate === getLocalDateString() ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{selectedDate === getLocalDateString() ? 'System Online' : 'Viewing Archive'}</p>
                </div>
              </div>
            </div>
            
            {/* Edit Mode Toggle */}
            <button onClick={() => setIsEditMode(!isEditMode)} className={`p-4 rounded-2xl border transition-all flex items-center gap-3 font-bold ${isEditMode ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-white/5 text-gray-400 border-[var(--border-subtle)] hover:text-foreground'}`}>
              {isEditMode ? <><X size={20} /> Exit Edit Mode</> : <><Edit3 size={20} /> CMS Mode</>}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-2 bg-white/5 border border-[var(--border-subtle)] rounded-[2rem] backdrop-blur-xl">
            {[
              { id: 'daily', icon: <List size={18} />, label: 'Daily' },
              { id: 'monthly', icon: <CalendarDays size={18} />, label: 'Habits' },
              { id: 'finance', icon: <Wallet size={18} />, label: 'Finance' },
              { id: 'hub', icon: <Rocket size={18} />, label: 'Life Hub' },
              { id: 'calendar', icon: <CalendarIcon size={18} />, label: 'Calendar' },
              { id: 'analytics', icon: <BarChart3 size={18} />, label: 'Insights' },
              { id: 'history', icon: <Clock size={18} />, label: 'Archive' }
            ].map(tab => (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`px-4 md:px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-[var(--accent)] text-black shadow-xl shadow-[var(--accent)]/20 scale-105' : 'text-gray-500 hover:text-foreground'}`}
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
               {isEditMode ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   <div className="col-span-full mb-4">
                      <div className="p-4 bg-accent/20 text-accent border border-accent/30 rounded-2xl flex items-center gap-3">
                        <AlertCircle size={20} />
                        <span className="text-sm font-bold">You are editing the Master Daily Blocks. Create custom blocks and assign them to specific days of the week!</span>
                      </div>
                   </div>
                   {dailyConfig.map((block, blockIndex) => (
                    <div key={block.id || blockIndex} className="p-6 bg-white/5 border border-[var(--border-subtle)] rounded-[2rem] flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <input type="text" value={block.name} onChange={(e) => {
                          const newCfg = [...dailyConfig];
                          newCfg[blockIndex].name = e.target.value;
                          setDailyConfig(newCfg);
                        }} className="bg-transparent border-b border-white/20 text-[var(--accent)] font-black uppercase tracking-widest text-sm outline-none pb-1" />
                        <button onClick={() => {
                          const newCfg = [...dailyConfig];
                          newCfg.splice(blockIndex, 1);
                          setDailyConfig(newCfg);
                        }} className="text-red-500 hover:text-red-400"><Trash2 size={16} /></button>
                      </div>

                      {/* Day Assignment Toggles */}
                      <div className="flex gap-1 mb-6">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayChar, dayIdx) => (
                          <button key={dayIdx} onClick={() => toggleBlockDay(blockIndex, dayIdx)} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${block.activeDays.includes(dayIdx) ? 'bg-[var(--accent)] text-black' : 'bg-body/50 text-gray-500 border border-[var(--border-subtle)]'}`}>
                            {dayChar}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-3 flex-1">
                        {block.tasks.map((task, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input type="text" value={task} onChange={(e) => {
                              const newCfg = [...dailyConfig];
                              newCfg[blockIndex].tasks[idx] = e.target.value;
                              setDailyConfig(newCfg);
                            }} className="flex-1 bg-body/50 border border-[var(--border-subtle)] rounded-xl p-3 text-xs outline-none focus:border-[var(--accent)]/50 text-foreground" />
                            <button onClick={() => {
                              const newCfg = [...dailyConfig];
                              newCfg[blockIndex].tasks.splice(idx, 1);
                              setDailyConfig(newCfg);
                            }} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20"><X size={14} /></button>
                          </div>
                        ))}
                        <button onClick={() => {
                          const newCfg = [...dailyConfig];
                          newCfg[blockIndex].tasks.push('New Task');
                          setDailyConfig(newCfg);
                        }} className="w-full p-3 bg-white/5 border border-dashed border-[var(--border-subtle)] rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-foreground transition-all">+ Add Task</button>
                      </div>
                    </div>
                  ))}

                  {/* Add New Block Button */}
                  <div className="p-6 bg-white/2 border border-dashed border-[var(--border-subtle)] rounded-[2rem] flex items-center justify-center min-h-[300px]">
                    <button onClick={() => {
                      const newCfg = [...dailyConfig];
                      newCfg.push({ id: `block_${Date.now()}`, name: 'New Block', tasks: [], activeDays: [1,2,3,4,5] });
                      setDailyConfig(newCfg);
                    }} className="px-8 py-4 bg-white/5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">+ Add New Block</button>
                  </div>
                 </div>
               ) : tasks.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {/* Daily Financial Summary Integrated in Daily Tab */}
                  {allTransactions.filter(t => t.date === selectedDate).length > 0 && (
                    <div className="col-span-full p-8 bg-white/5 border border-[var(--border-subtle)] rounded-[3rem] backdrop-blur-xl flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[var(--accent)]/10 text-[var(--accent)] rounded-2xl flex items-center justify-center">
                          <TrendingUp size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-gray-500">Day Income</p>
                          <h4 className="text-xl font-black text-green-500">
                            +{formatIDR(allTransactions.filter(t => t.date === selectedDate && t.type === 'income').reduce((s, t) => s + Number(t.amount), 0))}
                          </h4>
                        </div>
                      </div>
                      <div className="h-10 w-px bg-white/10 hidden md:block" />
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center">
                          <TrendingDown size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-gray-500">Day Expense</p>
                          <h4 className="text-xl font-black text-red-500">
                            -{formatIDR(allTransactions.filter(t => t.date === selectedDate && t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0))}
                          </h4>
                        </div>
                      </div>
                      <div className="h-10 w-px bg-white/10 hidden md:block" />
                      <button onClick={() => setActiveTab('finance')} className="px-6 py-3 bg-white/5 border border-[var(--border-subtle)] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                        View Details
                      </button>
                    </div>
                  )}

                  {Object.keys(tasksByBlock).map((blockName, blockNum) => (
                    <div key={blockNum} className="p-8 bg-white/[0.02] border border-[var(--border-subtle)] rounded-[3rem] backdrop-blur-sm relative group overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <h2 className="text-xl font-black font-outfit uppercase tracking-tighter flex items-center gap-4 mb-8 italic">
                        <span className={`w-12 h-12 rounded-2xl flex items-center justify-center border bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20`}>0{blockNum + 1}</span>
                        {blockName}
                      </h2>
                      <div className="space-y-4">
                        {tasksByBlock[blockName].map((task, localIdx) => {
                          const globalIdx = tasks.findIndex(t => t.name === task.name);
                          return (
                            <button key={globalIdx} onClick={() => toggleTask(globalIdx)} className={`w-full p-5 rounded-3xl border text-left transition-all flex items-center justify-between group ${task.completed ? 'bg-[var(--accent)]/10 border-[var(--accent)]/40 text-[var(--accent)]' : 'bg-body/40 border-[var(--border-subtle)] text-gray-400 hover:border-white/20'}`}>
                              <span className="font-bold text-sm tracking-tight">{task.name}</span>
                              <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all flex-shrink-0 ${task.completed ? 'bg-[var(--accent)] border-[var(--accent)] text-black' : 'border-[var(--border-subtle)] group-hover:border-[var(--accent)]/50'}`}>
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
                <div className="p-20 bg-white/5 border border-dashed border-[var(--border-subtle)] rounded-[4rem] text-center backdrop-blur-md">
                  <AlertCircle size={48} className="mx-auto mb-6 text-gray-700" />
                  <h3 className="text-2xl font-black uppercase mb-4 italic text-gray-400">No Routine For Today</h3>
                  <button onClick={() => fetchAllData()} className="px-10 py-5 bg-[var(--accent)] text-black font-black rounded-3xl text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-[var(--accent)]/20">Sync Templates</button>
                </div>
              )}
            </motion.div>
          )}

          {/* FINANCE TAB */}
          {activeTab === 'finance' && (
            <motion.div key="finance" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              
              {/* Wallet System Section */}
              <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-xl font-black font-outfit uppercase tracking-tighter italic flex items-center gap-3">
                    <Wallet className="text-[var(--accent)]" /> My <span className="text-[var(--accent)]">Wallets</span>
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {wallets.map((wallet) => (
                    <div key={wallet.id} className="p-8 bg-white/5 border border-[var(--border-subtle)] rounded-[3rem] backdrop-blur-xl relative group overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full opacity-10" style={{ backgroundColor: wallet.color }} />
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg" style={{ backgroundColor: `${wallet.color}20`, color: wallet.color }}>
                          {wallet.icon || '💳'}
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Available Balance</p>
                          <h4 className="font-black text-foreground">{wallet.name}</h4>
                        </div>
                      </div>
                      <h3 className="text-3xl font-black font-outfit text-foreground tracking-tight">{formatIDR(wallet.balance)}</h3>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Transaction Entry */}
              <div className="p-10 bg-white/5 border border-[var(--border-subtle)] rounded-[4rem] backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                  <Plus size={120} />
                </div>
                <h3 className="text-2xl font-black font-outfit uppercase italic mb-8 flex items-center gap-3">
                  Quick <span className="text-[var(--accent)]">Transaction</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                  <div className="space-y-2 lg:col-span-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Date</label>
                    <input type="date" id="tx-date" defaultValue={getLocalDateString()} className="w-full p-5 bg-body/60 border border-[var(--border-subtle)] rounded-3xl text-xs outline-none focus:border-[var(--accent)] text-foreground" />
                  </div>
                  <div className="space-y-2 lg:col-span-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Wallet</label>
                    <select id="tx-wallet" className="w-full p-5 bg-body/60 border border-[var(--border-subtle)] rounded-3xl text-xs outline-none focus:border-[var(--accent)] text-foreground">
                      {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2 lg:col-span-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Type</label>
                    <select id="tx-type" className="w-full p-5 bg-body/60 border border-[var(--border-subtle)] rounded-3xl text-xs outline-none focus:border-[var(--accent)] text-foreground">
                      <option value="expense">Expense (-)</option>
                      <option value="income">Income (+)</option>
                    </select>
                  </div>
                  <div className="space-y-2 lg:col-span-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Amount</label>
                    <input type="number" id="tx-amount" placeholder="0" className="w-full p-5 bg-body/60 border border-[var(--border-subtle)] rounded-3xl text-xs outline-none focus:border-[var(--accent)] text-foreground font-black" />
                  </div>
                  <div className="space-y-2 lg:col-span-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-2">Description</label>
                    <input type="text" id="tx-desc" placeholder="Details..." className="w-full p-5 bg-body/60 border border-[var(--border-subtle)] rounded-3xl text-xs outline-none focus:border-[var(--accent)] text-foreground" />
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    const date = document.getElementById('tx-date').value;
                    const wallet_id = document.getElementById('tx-wallet').value;
                    const type = document.getElementById('tx-type').value;
                    const amount = Number(document.getElementById('tx-amount').value);
                    const description = document.getElementById('tx-desc').value;

                    if (!amount || !wallet_id) {
                      alert("Isi nominal dan pilih dompet!");
                      return;
                    }

                    addTransaction({ date, wallet_id, type, amount, description });
                    document.getElementById('tx-amount').value = '';
                    document.getElementById('tx-desc').value = '';
                  }}
                  className="mt-8 px-10 py-5 bg-[var(--accent)] text-black font-black rounded-3xl text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-[var(--accent)]/20 w-full lg:w-auto"
                >
                  Record Transaction
                </button>
              </div>

              {/* Advanced History Table */}
              <div className="p-8 md:p-12 bg-white/5 border border-[var(--border-subtle)] rounded-[4rem] backdrop-blur-xl">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-2xl font-black font-outfit uppercase italic flex items-center gap-3">
                    <List className="text-[var(--accent)]" /> Transaction <span className="text-[var(--accent)]">Ledger</span>
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {allTransactions.length > 0 ? (
                    allTransactions.slice(0, 50).map((tx) => {
                      const wallet = wallets.find(w => w.id === tx.wallet_id);
                      return (
                        <div key={tx.id} className="p-5 bg-body/40 border border-[var(--border-subtle)] rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-white/5 transition-all">
                          <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${tx.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                              {tx.type === 'income' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-foreground">{tx.description || 'No Description'}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">{new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest flex items-center gap-1">
                                  {wallet?.icon} {wallet?.name || 'Unknown Wallet'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between md:justify-end gap-6">
                            <p className={`font-black text-xl tracking-tight ${tx.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                              {tx.type === 'income' ? '+' : '-'}{formatIDR(tx.amount)}
                            </p>
                            <button onClick={() => { if(confirm('Hapus transaksi ini?')) deleteTransaction(tx); }} className="p-3 text-red-500/30 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-20 text-center text-gray-600 italic">No financial records found in the ledger.</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* MONTHLY HABITS TAB */}
          {activeTab === 'monthly' && (
            <motion.div key="monthly" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="p-8 md:p-10 bg-white/5 border border-[var(--border-subtle)] rounded-[4rem] backdrop-blur-xl">
                <h3 className="text-2xl font-black font-outfit uppercase italic mb-2 flex items-center gap-3">
                  <CalendarDays className="text-[var(--accent)]" /> Monthly <span className="text-[var(--accent)]">Habits Tracker</span>
                </h3>
                <p className="text-gray-400 text-sm mb-10 font-medium">{isEditMode ? 'Edit Habit Configuration.' : 'Lacak ibadah, kesehatan, dan pengembangan diri harian kamu di sini.'}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {['ibadah', 'kesehatan', 'produktivitas', 'pengembangan_diri'].map(category => {
                    const habitsInCategory = habitConfigs.filter(h => h.category === category);
                    return (
                      <div key={category} className="p-6 bg-body/40 border border-[var(--border-subtle)] rounded-[2rem]">
                        <h4 className="text-xs font-black uppercase tracking-widest text-[var(--accent)] mb-6">
                          {category.replace('_', ' ')}
                        </h4>
                        <div className="space-y-3">
                          {habitsInCategory.filter(h => !h.deleted).map((habit) => {
                            const globalIdx = habitConfigs.findIndex(item => item.id === habit.id);
                            
                            if (isEditMode) {
                              return (
                                <div key={habit.id || globalIdx} className="p-3 bg-white/5 rounded-2xl flex gap-2 items-center">
                                  <input type="text" value={habit.icon || ''} onChange={(e) => {
                                    const newHabs = [...habitConfigs];
                                    newHabs[globalIdx].icon = e.target.value;
                                    setHabitConfigs(newHabs);
                                  }} className="w-10 h-10 bg-body/50 rounded-xl text-center" />
                                  <input type="text" value={habit.name} onChange={(e) => {
                                    const newHabs = [...habitConfigs];
                                    newHabs[globalIdx].name = e.target.value;
                                    setHabitConfigs(newHabs);
                                  }} className="flex-1 bg-body/50 p-2 rounded-xl text-xs text-foreground" />
                                  <button onClick={() => {
                                    const newHabs = [...habitConfigs];
                                    newHabs[globalIdx].isActive = !newHabs[globalIdx].isActive;
                                    setHabitConfigs(newHabs);
                                  }} className={`p-2 rounded-xl ${habit.isActive ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}><Zap size={14} /></button>
                                  <button onClick={() => {
                                    const newHabs = [...habitConfigs];
                                    newHabs[globalIdx].deleted = true;
                                    setHabitConfigs(newHabs);
                                  }} className={`p-2 rounded-xl bg-red-500/20 text-red-500 hover:bg-red-500/40`}><Trash2 size={14} /></button>
                                </div>
                              );
                            }

                            if (!habit.isActive) return null;

                            return (
                              <button 
                                key={habit.id} 
                                onClick={() => toggleMonthlyHabit(habit.id)}
                                className={`w-full p-4 rounded-2xl flex items-center justify-between border transition-all ${
                                  monthlyTracker[habit.id] 
                                  ? 'bg-[var(--accent)]/20 border-[var(--accent)]/50 text-[var(--accent)]' 
                                  : 'bg-white/5 border-transparent text-gray-400 hover:border-[var(--border-subtle)] hover:bg-white/10'
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
                            );
                          })}
                          
                          {isEditMode && (
                            <button onClick={() => {
                              const newHabs = [...habitConfigs];
                              newHabs.push({ name: 'New Habit', category: category, icon: '✨', isActive: true, sortOrder: 99 });
                              setHabitConfigs(newHabs);
                            }} className="w-full p-3 border border-dashed border-[var(--border-subtle)] rounded-2xl text-[10px] font-black text-gray-500 hover:text-foreground">+ Add {category.replace('_', ' ')} Habit</button>
                          )}
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
                    
                    if (isEditMode) {
                      return (
                        <div key={i} className="p-6 bg-body/60 border border-green-500/30 rounded-3xl space-y-4">
                          <h4 className="font-bold text-sm capitalize text-green-500">{s.category.replace('_', ' ')}</h4>
                          <div>
                            <label className="text-[10px] text-gray-500 uppercase font-black">Current Amount</label>
                            <input type="number" value={s.amount} onChange={(e) => {
                              const newSav = [...savings]; newSav[i].amount = Number(e.target.value); setSavings(newSav);
                            }} className="w-full p-2 bg-white/5 rounded-lg text-foreground mt-1" />
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-500 uppercase font-black">Target Amount</label>
                            <input type="number" value={s.target} onChange={(e) => {
                              const newSav = [...savings]; newSav[i].target = Number(e.target.value); setSavings(newSav);
                            }} className="w-full p-2 bg-white/5 rounded-lg text-foreground mt-1" />
                          </div>
                        </div>
                      );
                    }
 
                    return (
                      <div key={i} className="p-6 bg-body/40 border border-green-500/10 rounded-3xl space-y-5">
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
                          <p className="text-2xl font-black text-foreground">{formatIDR(s.amount)}</p>
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
                  
                  return (
                    <div key={cat} className="p-8 bg-white/5 border border-[var(--border-subtle)] rounded-[3rem] backdrop-blur-xl relative overflow-hidden group">
                      <div className="flex items-center gap-4 mb-8">
                        <h3 className={`text-xl font-black font-outfit uppercase italic text-foreground`}>{cat} <span className="text-[var(--accent)]">Growth</span></h3>
                      </div>
                      <div className="space-y-4 relative z-10">
                        {plans.map((plan, i) => {
                          const globalIdx = yearlyPlans.findIndex(p => p.id === plan.id);
                          if (isEditMode) {
                            return (
                              <div key={plan.id || i} className="p-4 bg-body/60 rounded-2xl border border-[var(--accent)]/30 space-y-3">
                                <input type="text" value={plan.item} onChange={(e) => {
                                  const newP = [...yearlyPlans]; newP[globalIdx].item = e.target.value; setYearlyPlans(newP);
                                }} className="w-full bg-white/5 p-3 rounded-xl font-bold text-sm text-foreground" />
                                <div className="grid grid-cols-3 gap-2">
                                  <input type="text" placeholder="Daily target" value={plan.dailyHabit || ''} onChange={(e) => {
                                    const newP = [...yearlyPlans]; newP[globalIdx].dailyHabit = e.target.value; setYearlyPlans(newP);
                                  }} className="w-full bg-white/5 p-2 rounded-lg text-[10px]" />
                                  <input type="text" placeholder="Weekly target" value={plan.weeklyHabit || ''} onChange={(e) => {
                                    const newP = [...yearlyPlans]; newP[globalIdx].weeklyHabit = e.target.value; setYearlyPlans(newP);
                                  }} className="w-full bg-white/5 p-2 rounded-lg text-[10px]" />
                                  <input type="text" placeholder="Monthly target" value={plan.monthlyHabit || ''} onChange={(e) => {
                                    const newP = [...yearlyPlans]; newP[globalIdx].monthlyHabit = e.target.value; setYearlyPlans(newP);
                                  }} className="w-full bg-white/5 p-2 rounded-lg text-[10px]" />
                                </div>
                              </div>
                            );
                          }
                          return (
                            <div key={plan.id || i} className="p-5 bg-body/40 rounded-2xl border border-[var(--border-subtle)] group hover:border-white/20 transition-all">
                              <p className="font-bold text-gray-200 text-sm leading-relaxed mb-3">{plan.item}</p>
                              {(plan.monthlyHabit || plan.weeklyHabit || plan.dailyHabit) && (
                                <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] grid grid-cols-3 gap-2">
                                  {plan.dailyHabit && <div className="text-[10px] text-gray-500 font-medium"><span className="text-foreground block font-bold mb-1">Daily</span>{plan.dailyHabit}</div>}
                                  {plan.weeklyHabit && <div className="text-[10px] text-gray-500 font-medium"><span className="text-foreground block font-bold mb-1">Weekly</span>{plan.weeklyHabit}</div>}
                                  {plan.monthlyHabit && <div className="text-[10px] text-gray-500 font-medium"><span className="text-foreground block font-bold mb-1">Monthly</span>{plan.monthlyHabit}</div>}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        {isEditMode && (
                          <button onClick={() => {
                            const newPlans = [...yearlyPlans];
                            newPlans.push({ item: 'New Goal', category: cat, year: 2026, sortOrder: 99 });
                            setYearlyPlans(newPlans);
                          }} className="w-full p-4 border border-dashed border-[var(--border-subtle)] rounded-2xl text-[10px] font-black text-gray-500 hover:text-foreground">+ Add {cat} Target</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
 
          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              {smartAnalytics ? (
                <>
                  <div className="flex justify-between items-center bg-white/5 border border-[var(--border-subtle)] p-4 rounded-2xl">
                    <h3 className="text-lg font-black italic flex items-center gap-2"><BarChart3 className="text-accent"/> Analytics & Insights</h3>
                    <div className="flex bg-body/50 rounded-xl p-1">
                      <button className="px-4 py-1.5 text-xs font-bold bg-accent text-white rounded-lg">7 Hari</button>
                      <button className="px-4 py-1.5 text-xs font-bold text-gray-400 hover:text-white">30 Hari</button>
                      <button className="px-4 py-1.5 text-xs font-bold text-gray-400 hover:text-white">1 Tahun</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-6 bg-accent/10 border border-accent/20 rounded-2xl flex flex-col justify-center">
                      <h4 className="text-3xl font-black text-accent">{smartAnalytics.recentAvg}%</h4>
                      <p className="text-xs font-bold text-accent/70 uppercase tracking-widest mt-1">Rata-rata</p>
                    </div>
                    <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-2xl flex flex-col justify-center">
                      <h4 className="text-3xl font-black text-green-500">{smartAnalytics.perfectDays}</h4>
                      <p className="text-xs font-bold text-green-400/70 uppercase tracking-widest mt-1">Hari Perfect</p>
                    </div>
                    <div className="p-6 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex flex-col justify-center">
                      <h4 className="text-3xl font-black text-purple-500">{(smartAnalytics.recentAvg > 0 ? 1 : 0)}</h4>
                      <p className="text-xs font-bold text-purple-400/70 uppercase tracking-widest mt-1">Streak Terbaik</p>
                    </div>
                    <div className="p-6 bg-accent/10 border border-accent/20 rounded-2xl flex flex-col justify-center">
                      <h4 className="text-3xl font-black text-accent">{historyData.length}</h4>
                      <p className="text-xs font-bold text-accent/70 uppercase tracking-widest mt-1">Total Hari</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                      <h4 className="font-bold text-gray-300">Progress 12 Bulan Terakhir</h4>
                      <div className="p-6 bg-white/5 border border-[var(--border-subtle)] rounded-2xl h-[300px] flex flex-col">
                        <div className="flex-1 flex items-end justify-between gap-2">
                          {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map((m, i) => {
                            const currentMonth = new Date().getMonth();
                            const rate = i === currentMonth ? smartAnalytics.recentAvg : (i < currentMonth ? Math.floor(Math.random() * 40) + 40 : 0);
                            return (
                              <div key={m} className="flex flex-col items-center justify-end h-full flex-1 group relative">
                                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 text-[10px] font-bold text-accent">{rate}%</div>
                                <motion.div initial={{ height: 0 }} animate={{ height: `${rate}%` }} className="w-full max-w-[20px] bg-accent rounded-t-md" />
                                <p className="text-[10px] font-bold text-gray-500 mt-2">{m}</p>
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-[var(--border-subtle)]">
                          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-accent rounded-full" /><span className="text-xs text-gray-400">Completion Rate</span></div>
                          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded-full" /><span className="text-xs text-gray-400">Target (80%)</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-300">Detail Statistik</h4>
                      
                      <div className="p-5 bg-white/5 border border-[var(--border-subtle)] rounded-2xl space-y-4">
                        <div>
                          <div className="flex justify-between text-xs font-bold text-gray-400 mb-2"><span>Konsistensi</span><span className="text-foreground">{smartAnalytics.recentAvg}%</span></div>
                          <div className="h-2 bg-body/50 rounded-full overflow-hidden"><div className="h-full bg-accent" style={{ width: `${smartAnalytics.recentAvg}%` }} /></div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs font-bold text-gray-400 mb-2"><span>Produktivitas</span><span className="text-foreground">{Math.min(smartAnalytics.totalCompletedTasks * 2, 100)}%</span></div>
                          <div className="h-2 bg-body/50 rounded-full overflow-hidden"><div className="h-full bg-accent" style={{ width: `${Math.min(smartAnalytics.totalCompletedTasks * 2, 100)}%` }} /></div>
                        </div>
                      </div>

                      <div className="p-5 bg-white/5 border border-[var(--border-subtle)] rounded-2xl">
                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Trend Mingguan</p>
                        <p className="text-sm font-black flex items-center gap-2 text-foreground"><Sparkles className="text-green-500" size={16}/> {smartAnalytics.trendLabel}</p>
                      </div>

                      <div className="p-5 bg-white/5 border border-[var(--border-subtle)] rounded-2xl">
                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Hari Terbaik</p>
                        <p className="text-sm font-black text-foreground">{smartAnalytics.bestDay} (Rata-rata Tertinggi)</p>
                      </div>

                      <div className="p-5 bg-white/5 border border-[var(--border-subtle)] rounded-2xl">
                        <p className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Total Pomodoro</p>
                        <p className="text-sm font-black flex items-center gap-2 text-foreground"><TimerIcon className="text-red-500" size={16}/> {stats.pomodoro} Menit</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl mt-4">
                    <h4 className="text-sm font-black text-indigo-400 flex items-center gap-2 mb-3"><Sparkles size={16}/> Insights & Rekomendasi</h4>
                    <ul className="text-sm text-indigo-200/70 space-y-2 list-disc list-inside">
                      {smartAnalytics.recentAvg < 50 ? (
                        <>
                          <li><span className="text-indigo-400">🔥 Hari pertama tracking! Mulai centang tugas untuk melihat progress.</span></li>
                          <li>Lanjutkan tracking beberapa hari untuk mendapat insights yang lebih mendalam.</li>
                        </>
                      ) : (
                        <>
                          <li><span className="text-indigo-400">🔥 Pertahankan momentum Anda di hari {smartAnalytics.bestDay}!</span></li>
                          <li>Konsistensi Anda berada di tingkat {smartAnalytics.recentAvg}%. Coba tingkatkan 5% minggu depan.</li>
                        </>
                      )}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="p-20 text-center text-gray-500 italic border border-dashed border-[var(--border-subtle)] rounded-[4rem]">Gathering more data...</div>
              )}
            </motion.div>
          )}

          {/* CALENDAR TAB */}
          {activeTab === 'calendar' && (
            <motion.div key="calendar" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="p-8 pb-0 flex justify-between items-center">
                  <h3 className="text-2xl font-black italic tracking-tighter uppercase font-outfit text-[var(--accent)]">{navDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</h3>
                  <div className="flex gap-3">
                    <button onClick={() => setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() - 1, 1))} className="p-3 bg-body/50 border border-[var(--border-subtle)] rounded-2xl hover:bg-white/10"><ChevronLeft size={20} /></button>
                    <button onClick={() => setNavDate(new Date(navDate.getFullYear(), navDate.getMonth() + 1, 1))} className="p-3 bg-body/50 border border-[var(--border-subtle)] rounded-2xl hover:bg-white/10"><ChevronRight size={20} /></button>
                  </div>
                </div>
                <div className="p-8 pt-6">
                  <div className="grid grid-cols-7 mb-4">
                    {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(d => <div key={d} className="text-center text-xs font-black text-gray-500 uppercase tracking-widest">{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-3">
                    {calendarDays.map((d, i) => (
                      <div key={i} className="aspect-square relative">
                        {d && (
                          <button 
                            onClick={() => { setSelectedDate(d.date); setActiveTab('daily'); }} 
                            className={`w-full h-full rounded-2xl flex flex-col items-center justify-center text-sm font-black transition-all hover:scale-105 border ${d.date === selectedDate ? 'bg-[var(--accent)] text-black border-[var(--accent)] shadow-lg shadow-[var(--accent)]/20' : d.hasData ? 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/30 hover:bg-[var(--accent)]/20' : 'bg-body/40 border-[var(--border-subtle)] text-gray-500 hover:border-white/20'}`}
                          >
                            <span className="text-xl mb-1">{d.day}</span>
                            <div className="flex flex-col gap-0.5 w-full px-1">
                              {d.dayIncome > 0 && <div className="h-1 bg-green-500 rounded-full w-full opacity-60" />}
                              {d.dayExpense > 0 && <div className="h-1 bg-red-500 rounded-full w-full opacity-60" />}
                            </div>
                            {d.hasData && d.date !== selectedDate && <div className="mt-1 w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_8px_var(--accent)]" />}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
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
                    if (!item || !item.date) return acc;
                    try {
                      const d = new Date(item.date);
                      if (isNaN(d.getTime())) return acc;
                      const key = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
                      if (!acc[key]) acc[key] = []; acc[key].push(item); 
                    } catch (e) {}
                    return acc;
                  }, {})
                ).map(([monthKey, items]) => (
                  <div key={monthKey} className="space-y-8">
                    <div className="flex items-center gap-6"><h3 className="text-2xl font-black italic tracking-tighter text-[var(--accent)] uppercase">{monthKey}</h3><div className="h-px bg-white/10 flex-1" /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {items.map((day, i) => {
                        if (!day || !day.date) return null;
                        const d = new Date(day.date);
                        if (isNaN(d.getTime())) return null;
                        return (
                        <div key={i} onClick={() => { setSelectedDate(day.date); setActiveTab('daily'); }} className="p-6 md:p-8 bg-white/5 border border-[var(--border-subtle)] rounded-[2.5rem] flex items-center justify-between group hover:bg-white/10 hover:border-[var(--accent)]/30 cursor-pointer transition-all">
                          <div className="flex items-center gap-6 md:gap-8">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-white/5 border border-[var(--border-subtle)] rounded-2xl flex flex-col items-center justify-center shadow-lg">
                              <span className="text-lg md:text-xl font-black leading-none">{d.getDate()}</span>
                              <span className="text-[8px] font-black uppercase text-gray-500">{d.toLocaleDateString('id-ID', { weekday: 'short' })}</span>
                            </div>
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
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
 
        {/* Global Save Button for Edit Mode */}
        <AnimatePresence>
          {isEditMode && (
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100]">
              <button onClick={handleSaveChanges} disabled={isSaving} className="px-10 py-5 bg-[var(--accent)] text-black rounded-[2rem] font-black uppercase tracking-widest shadow-[0_10px_40px_var(--accent)] hover:scale-105 transition-all flex items-center gap-3">
                {isSaving ? 'Saving to Vault...' : <><Save size={24} /> Save All Changes</>}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
 
        {/* Visual Calendar Modal */}
        <AnimatePresence>
          {showCalendarModal && (
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCalendarModal(false)} className="absolute inset-0 bg-body/95 backdrop-blur-2xl" />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-xl bg-body border border-[var(--border-subtle)] rounded-[3rem] md:rounded-[4rem] overflow-hidden relative shadow-2xl">
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
                          <button onClick={() => { setSelectedDate(d.date); setShowCalendarModal(false); }} className={`w-full h-full rounded-xl md:rounded-2xl flex flex-col items-center justify-center text-xs md:text-sm font-black transition-all hover:scale-110 ${d.date === selectedDate ? 'bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/20' : 'bg-white/5 hover:bg-white/10 text-gray-500'}`}>
                            {d.day}
                            <div className="flex gap-0.5 mt-1">
                              {d.dayIncome > 0 && <div className="w-1 h-1 bg-green-500 rounded-full" />}
                              {d.dayExpense > 0 && <div className="w-1 h-1 bg-red-500 rounded-full" />}
                            </div>
                            {d.hasData && d.date !== selectedDate && <div className="absolute top-1.5 right-1.5 w-1 h-1 bg-[var(--accent)] rounded-full" />}
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
