'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Target, Zap, Smile, Timer as TimerIcon, Plus, 
  Trash2, Save, Calendar as CalendarIcon, ChevronRight,
  BarChart3, List, Wallet, Rocket, Leaf, ShieldCheck, 
  CheckCircle2, AlertCircle, TrendingUp, Sparkles, Award, CalendarDays
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductivityAdmin() {
  const [activeSubTab, setActiveSubTab] = useState('daily'); // daily, monthly, lifehub, analytics
  const [loading, setLoading] = useState(false);
  
  // States for data
  const [dailyConfig, setDailyConfig] = useState({ block1: [], block2A: [], block2B: [], block2Sunday: [], block3: [] });
  const [yearlyPlans, setYearlyPlans] = useState([]);
  const [savings, setSavings] = useState([]);
  const [habits, setHabits] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  const fetchAllAdminData = async () => {
    const supabase = createClient();
    
    // Fetch Daily Templates
    const { data: daily } = await supabase.from('SiteSettings').select('*').eq('key', 'productivity_config').single();
    if (daily) setDailyConfig(JSON.parse(daily.value));

    // Fetch Yearly Plans
    const { data: yPlans } = await supabase.from('YearlyPlan').select('*').order('sortOrder', { ascending: true });
    if (yPlans) setYearlyPlans(yPlans);

    // Fetch Savings
    const { data: savs } = await supabase.from('TabunganUmroh').select('*').order('id', { ascending: true });
    if (savs) setSavings(savs);

    // Fetch Habit Configs
    const { data: habs } = await supabase.from('HabitConfig').select('*').order('sortOrder', { ascending: true });
    if (habs) setHabits(habs);

    // Fetch Analytics Log
    const { data: hist } = await supabase.from('Productivity').select('*').order('date', { ascending: false }).limit(30);
    if (hist) setHistory(hist);
  };

  const handleSaveDaily = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from('SiteSettings').upsert({ key: 'productivity_config', value: JSON.stringify(dailyConfig) });
    setLoading(false);
    alert('Daily Templates Saved!');
  };

  const handleSaveYearlyPlans = async () => {
    setLoading(true);
    const supabase = createClient();
    for (const plan of yearlyPlans) {
      if (plan.id) {
        await supabase.from('YearlyPlan').update(plan).eq('id', plan.id);
      } else {
        await supabase.from('YearlyPlan').insert([plan]);
      }
    }
    setLoading(false);
    alert('Yearly Plans Saved!');
    fetchAllAdminData();
  };

  const handleSaveSavings = async () => {
    setLoading(true);
    const supabase = createClient();
    for (const s of savings) {
      await supabase.from('TabunganUmroh').update(s).eq('id', s.id);
    }
    setLoading(false);
    alert('Savings Tracker Saved!');
  };

  const handleSaveHabits = async () => {
    setLoading(true);
    const supabase = createClient();
    for (const h of habits) {
      if (h.id) {
        await supabase.from('HabitConfig').update(h).eq('id', h.id);
      } else {
        await supabase.from('HabitConfig').insert([h]);
      }
    }
    setLoading(false);
    alert('Monthly Habits Config Saved!');
    fetchAllAdminData();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-jakarta">
      <Navbar />
      <main className="pt-32 pb-20 px-4 md:px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black font-outfit uppercase italic tracking-tighter">Productivity <span className="text-[var(--accent)]">Control Center</span></h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Manage Daily, Monthly, Life Hub, and Insights</p>
          </div>
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 w-full md:w-auto overflow-x-auto hide-scrollbar">
            <button onClick={() => setActiveSubTab('daily')} className={`px-4 md:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'daily' ? 'bg-[var(--accent)] text-black' : 'text-gray-500'}`}>Daily Templates</button>
            <button onClick={() => setActiveSubTab('monthly')} className={`px-4 md:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'monthly' ? 'bg-[var(--accent)] text-black' : 'text-gray-500'}`}>Monthly Habits</button>
            <button onClick={() => setActiveSubTab('lifehub')} className={`px-4 md:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'lifehub' ? 'bg-[var(--accent)] text-black' : 'text-gray-500'}`}>Life Hub Manager</button>
            <button onClick={() => setActiveSubTab('analytics')} className={`px-4 md:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'analytics' ? 'bg-[var(--accent)] text-black' : 'text-gray-500'}`}>Analytics Log</button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* DAILY TEMPLATES */}
          {activeSubTab === 'daily' && (
            <motion.div key="daily" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.keys(dailyConfig).map((block) => (
                  <div key={block} className="p-6 bg-white/5 border border-white/10 rounded-[2rem]">
                    <h3 className="text-xs font-black uppercase tracking-widest mb-6 text-[var(--accent)]">{block.replace('block', 'Block ')}</h3>
                    <div className="space-y-3">
                      {dailyConfig[block].map((task, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input type="text" value={task} onChange={(e) => {
                            const newCfg = {...dailyConfig};
                            newCfg[block][idx] = e.target.value;
                            setDailyConfig(newCfg);
                          }} className="flex-1 bg-black/50 border border-white/5 rounded-xl p-3 text-xs outline-none focus:border-[var(--accent)]/50" />
                          <button onClick={() => {
                            const newCfg = {...dailyConfig};
                            newCfg[block].splice(idx, 1);
                            setDailyConfig(newCfg);
                          }} className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20"><Trash2 size={14} /></button>
                        </div>
                      ))}
                      <button onClick={() => {
                        const newCfg = {...dailyConfig};
                        newCfg[block].push('New Task');
                        setDailyConfig(newCfg);
                      }} className="w-full p-3 bg-white/5 border border-dashed border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">+ Add Task</button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleSaveDaily} className="fixed bottom-6 right-6 md:bottom-10 md:right-10 px-6 py-4 bg-[var(--accent)] text-black font-black rounded-2xl shadow-2xl hover:scale-105 transition-all z-50 flex items-center gap-3 text-sm">
                {loading ? 'Saving...' : <><Save size={20} /> Save Changes</>}
              </button>
            </motion.div>
          )}

          {/* MONTHLY HABITS CONFIG */}
          {activeSubTab === 'monthly' && (
            <motion.div key="monthly" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem]">
                <h3 className="text-sm font-black uppercase italic mb-8 flex items-center gap-3"><CalendarDays size={18} className="text-[var(--accent)]" /> Habit Configuration</h3>
                <div className="space-y-6">
                  {['ibadah', 'kesehatan', 'produktivitas', 'pengembangan_diri'].map(cat => (
                    <div key={cat} className="mb-8">
                      <h4 className="text-xs font-black uppercase tracking-widest text-[var(--accent)] mb-4">{cat.replace('_', ' ')}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {habits.filter(h => h.category === cat).map((h, i) => {
                          const globalIdx = habits.findIndex(item => item.id === h.id);
                          return (
                            <div key={h.id} className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-3">
                              <div className="flex gap-2 items-center">
                                <input type="text" value={h.icon || ''} onChange={(e) => {
                                  const newHabs = [...habits];
                                  newHabs[globalIdx].icon = e.target.value;
                                  setHabits(newHabs);
                                }} className="w-10 h-10 p-2 bg-white/10 rounded-xl text-center flex-shrink-0" placeholder="Icon" />
                                <input type="text" value={h.name} onChange={(e) => {
                                  const newHabs = [...habits];
                                  newHabs[globalIdx].name = e.target.value;
                                  setHabits(newHabs);
                                }} className="flex-1 p-3 bg-white/10 rounded-xl text-xs font-bold" />
                              </div>
                              <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-xs text-gray-400">
                                  <input type="checkbox" checked={h.isActive} onChange={(e) => {
                                    const newHabs = [...habits];
                                    newHabs[globalIdx].isActive = e.target.checked;
                                    setHabits(newHabs);
                                  }} className="rounded border-white/10 bg-white/5 accent-[var(--accent)] w-4 h-4" />
                                  Active Habit
                                </label>
                              </div>
                            </div>
                          );
                        })}
                        <button onClick={() => {
                          const newHabs = [...habits];
                          newHabs.push({ name: 'New Habit', category: cat, icon: '✨', isActive: true, sortOrder: 99 });
                          setHabits(newHabs);
                        }} className="p-4 border border-dashed border-white/10 rounded-2xl text-[10px] font-black text-gray-500 hover:text-white flex items-center justify-center">+ Add {cat.replace('_', ' ')} Habit</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={handleSaveHabits} className="fixed bottom-6 right-6 md:bottom-10 md:right-10 px-6 py-4 bg-[var(--accent)] text-black font-black rounded-2xl shadow-2xl hover:scale-105 transition-all z-50 flex items-center gap-3 text-sm">
                {loading ? 'Saving...' : <><Save size={20} /> Save Habits</>}
              </button>
            </motion.div>
          )}

          {/* LIFE HUB MANAGER */}
          {activeSubTab === 'lifehub' && (
            <motion.div key="lifehub" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Yearly Plans Manager */}
                <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem]">
                  <h3 className="text-sm font-black uppercase italic mb-8 flex items-center gap-3"><Rocket size={18} className="text-[var(--accent)]" /> One Year Plan Editor</h3>
                  <div className="space-y-6">
                    {['mindset', 'skill', 'health', 'family'].map(cat => (
                      <div key={cat}>
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">{cat} Growth</h4>
                        <div className="space-y-3">
                          {yearlyPlans.filter(p => p.category === cat).map((plan, i) => {
                            const globalIdx = yearlyPlans.findIndex(item => item.id === plan.id);
                            return (
                              <div key={plan.id || i} className="p-4 bg-black/40 border border-white/5 rounded-2xl flex flex-col gap-3">
                                <div className="flex gap-2">
                                  <input type="text" value={plan.item} onChange={(e) => {
                                    const newPlans = [...yearlyPlans];
                                    newPlans[globalIdx].item = e.target.value;
                                    setYearlyPlans(newPlans);
                                  }} className="flex-1 bg-white/5 border border-white/5 rounded-xl p-3 text-xs font-bold" placeholder="Plan target..." />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <input type="text" placeholder="Daily..." value={plan.dailyHabit || ''} onChange={(e) => {
                                    const newPlans = [...yearlyPlans];
                                    newPlans[globalIdx].dailyHabit = e.target.value;
                                    setYearlyPlans(newPlans);
                                  }} className="bg-white/5 rounded-lg p-2 text-[10px]" />
                                  <input type="text" placeholder="Weekly..." value={plan.weeklyHabit || ''} onChange={(e) => {
                                    const newPlans = [...yearlyPlans];
                                    newPlans[globalIdx].weeklyHabit = e.target.value;
                                    setYearlyPlans(newPlans);
                                  }} className="bg-white/5 rounded-lg p-2 text-[10px]" />
                                  <input type="text" placeholder="Monthly..." value={plan.monthlyHabit || ''} onChange={(e) => {
                                    const newPlans = [...yearlyPlans];
                                    newPlans[globalIdx].monthlyHabit = e.target.value;
                                    setYearlyPlans(newPlans);
                                  }} className="bg-white/5 rounded-lg p-2 text-[10px]" />
                                </div>
                              </div>
                            );
                          })}
                          <button onClick={() => {
                            const newPlans = [...yearlyPlans];
                            newPlans.push({ item: 'Target Baru', category: cat, year: 2026, sortOrder: 99 });
                            setYearlyPlans(newPlans);
                          }} className="w-full p-3 border border-dashed border-white/10 rounded-xl text-[10px] font-black text-gray-600 hover:text-white">+ Add {cat} Target</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleSaveYearlyPlans} className="mt-8 w-full p-4 bg-white/10 rounded-2xl font-bold hover:bg-white/20 transition-all">Save Yearly Plans</button>
                </div>

                {/* Savings Manager */}
                <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem]">
                  <h3 className="text-sm font-black uppercase italic mb-8 flex items-center gap-3"><Wallet size={18} className="text-green-500" /> Savings Tracker Editor</h3>
                  <div className="space-y-6">
                    {savings.map((s, i) => (
                      <div key={s.id || i} className="p-6 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                        <div className="flex gap-3 items-center">
                          <div className="w-12 h-12 p-3 bg-white/10 rounded-xl flex items-center justify-center text-xl font-black">
                            {s.category === 'diri_sendiri' ? '🕌' : s.category === 'mahram' ? '👤' : s.category === 'keluarga' ? '👨‍👩‍👧‍👦' : '🤲'}
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Kategori Tabungan</p>
                            <h4 className="font-bold text-sm capitalize">{s.category.replace('_', ' ')}</h4>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[8px] font-black text-gray-500 mb-1 uppercase">Current Amount (Rp)</p>
                            <input type="number" value={s.amount} onChange={(e) => {
                              const newSav = [...savings];
                              newSav[i].amount = Number(e.target.value);
                              setSavings(newSav);
                            }} className="w-full p-3 bg-white/10 rounded-xl text-xs" />
                          </div>
                          <div>
                            <p className="text-[8px] font-black text-gray-500 mb-1 uppercase">Target Amount (Rp)</p>
                            <input type="number" value={s.target} onChange={(e) => {
                              const newSav = [...savings];
                              newSav[i].target = Number(e.target.value);
                              setSavings(newSav);
                            }} className="w-full p-3 bg-white/10 rounded-xl text-xs" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleSaveSavings} className="mt-8 w-full p-4 bg-green-500/20 text-green-500 rounded-2xl font-bold hover:bg-green-500/30 transition-all">Save Savings Tracker</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ANALYTICS LOG */}
          {activeSubTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem]">
                <h3 className="text-sm font-black uppercase italic mb-8">Performance Logs (Last 30 Days)</h3>
                <div className="space-y-3">
                  {history.map((h, i) => {
                    const tasks = JSON.parse(h.tasks);
                    const rate = tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0;
                    return (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white/5 rounded-xl flex flex-col items-center justify-center">
                            <span className="text-sm font-black leading-none">{new Date(h.date).getDate()}</span>
                            <span className="text-[8px] font-black text-gray-500 uppercase">{new Date(h.date).toLocaleDateString('id-ID', { month: 'short' })}</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold">{h.date}</p>
                            <p className="text-[10px] text-gray-500 uppercase font-black">{h.dayType} Mode • {h.mood || '😐'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0">
                          <span className={`text-xs font-black ${rate >= 80 ? 'text-green-500' : 'text-orange-500'}`}>{rate}%</span>
                          <div className="w-full md:w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--accent)]" style={{ width: `${rate}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {history.length === 0 && <p className="text-center text-gray-500 text-sm">No history logs found.</p>}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
