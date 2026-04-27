'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Target, Zap, Smile, Timer as TimerIcon, Plus, 
  Trash2, Save, Calendar as CalendarIcon, ChevronRight,
  BarChart3, List, Wallet, Rocket, Leaf, ShieldCheck, 
  CheckCircle2, AlertCircle, TrendingUp, Sparkles, Award
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductivityAdmin() {
  const [activeSubTab, setActiveSubTab] = useState('daily'); // daily, lifehub, analytics
  const [loading, setLoading] = useState(false);
  const [dailyConfig, setDailyConfig] = useState({ block1: [], block2A: [], block2B: [], block2Sunday: [], block3: [] });
  const [lifeHubConfig, setLifeHubConfig] = useState({ yearly: [], savings: [], habits: [] });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchConfigs();
    fetchAnalytics();
  }, []);

  const fetchConfigs = async () => {
    const supabase = createClient();
    const { data: daily } = await supabase.from('SiteSettings').select('*').eq('key', 'productivity_config').single();
    const { data: life } = await supabase.from('SiteSettings').select('*').eq('key', 'life_hub_config').single();
    if (daily) setDailyConfig(JSON.parse(daily.value));
    if (life) setLifeHubConfig(JSON.parse(life.value));
  };

  const fetchAnalytics = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('Productivity').select('*').order('date', { ascending: false }).limit(30);
    if (data) setHistory(data);
  };

  const handleSaveDaily = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from('SiteSettings').upsert({ key: 'productivity_config', value: JSON.stringify(dailyConfig) });
    setLoading(false);
    alert('Daily Templates Saved!');
  };

  const handleSaveLifeHub = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.from('SiteSettings').upsert({ key: 'life_hub_config', value: JSON.stringify(lifeHubConfig) });
    setLoading(false);
    alert('Life Hub Config Saved!');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-jakarta">
      <Navbar />
      <main className="pt-32 pb-20 px-4 md:px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black font-outfit uppercase italic tracking-tighter">Productivity <span className="text-[var(--accent)]">Control Center</span></h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Manage Daily, Life Hub, and Insights</p>
          </div>
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 w-full md:w-auto overflow-x-auto">
            <button onClick={() => setActiveSubTab('daily')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'daily' ? 'bg-[var(--accent)] text-black' : 'text-gray-500'}`}>Daily Templates</button>
            <button onClick={() => setActiveSubTab('lifehub')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'lifehub' ? 'bg-[var(--accent)] text-black' : 'text-gray-500'}`}>Life Hub Manager</button>
            <button onClick={() => setActiveSubTab('analytics')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'analytics' ? 'bg-[var(--accent)] text-black' : 'text-gray-500'}`}>Analytics Log</button>
          </div>
        </div>

        <AnimatePresence mode="wait">
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
                          }} className="flex-1 bg-white/5 border border-white/5 rounded-xl p-3 text-xs outline-none focus:border-[var(--accent)]/50" />
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
              <button onClick={handleSaveDaily} className="fixed bottom-10 right-10 px-8 py-4 bg-[var(--accent)] text-black font-black rounded-2xl shadow-2xl hover:scale-110 transition-all z-50 flex items-center gap-3">
                {loading ? 'Saving...' : <><Save size={20} /> Save Changes</>}
              </button>
            </motion.div>
          )}

          {activeSubTab === 'lifehub' && (
            <motion.div key="lifehub" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Yearly Plans Manager */}
                <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem]">
                  <h3 className="text-sm font-black uppercase italic mb-8 flex items-center gap-3"><Rocket size={18} className="text-[var(--accent)]" /> One Year Plan Editor</h3>
                  <div className="space-y-4">
                    {lifeHubConfig.yearly.map((plan, i) => (
                      <div key={i} className="flex gap-3">
                        <input type="text" value={plan} onChange={(e) => {
                          const newLife = {...lifeHubConfig};
                          newLife.yearly[i] = e.target.value;
                          setLifeHubConfig(newLife);
                        }} className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-4 text-xs font-medium" />
                        <button onClick={() => {
                          const newLife = {...lifeHubConfig};
                          newLife.yearly.splice(i, 1);
                          setLifeHubConfig(newLife);
                        }} className="p-4 bg-red-500/10 text-red-500 rounded-2xl"><Trash2 size={16} /></button>
                      </div>
                    ))}
                    <button onClick={() => {
                      const newLife = {...lifeHubConfig};
                      newLife.yearly.push('Target Baru');
                      setLifeHubConfig(newLife);
                    }} className="w-full p-4 border border-dashed border-white/10 rounded-2xl text-[10px] font-black text-gray-600 hover:text-white">+ Add Yearly Target</button>
                  </div>
                </div>

                {/* Savings Manager */}
                <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem]">
                  <h3 className="text-sm font-black uppercase italic mb-8 flex items-center gap-3"><Wallet size={18} className="text-green-500" /> Savings Tracker Editor</h3>
                  <div className="space-y-6">
                    {lifeHubConfig.savings.map((s, i) => (
                      <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                        <div className="flex gap-3 items-center">
                          <input type="text" value={s.icon} onChange={(e) => {
                            const newLife = {...lifeHubConfig};
                            newLife.savings[i].icon = e.target.value;
                            setLifeHubConfig(newLife);
                          }} className="w-12 p-3 bg-white/10 rounded-xl text-center" />
                          <input type="text" value={s.name} onChange={(e) => {
                            const newLife = {...lifeHubConfig};
                            newLife.savings[i].name = e.target.value;
                            setLifeHubConfig(newLife);
                          }} className="flex-1 p-3 bg-white/10 rounded-xl text-xs font-black uppercase" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-[8px] font-black text-gray-500 mb-1 uppercase">Current Amount</p>
                            <input type="text" value={s.current} onChange={(e) => {
                              const newLife = {...lifeHubConfig};
                              newLife.savings[i].current = e.target.value;
                              setLifeHubConfig(newLife);
                            }} className="w-full p-3 bg-white/10 rounded-xl text-xs" />
                          </div>
                          <div>
                            <p className="text-[8px] font-black text-gray-500 mb-1 uppercase">Target Amount</p>
                            <input type="text" value={s.target} onChange={(e) => {
                              const newLife = {...lifeHubConfig};
                              newLife.savings[i].target = e.target.value;
                              setLifeHubConfig(newLife);
                            }} className="w-full p-3 bg-white/10 rounded-xl text-xs" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button onClick={handleSaveLifeHub} className="fixed bottom-10 right-10 px-8 py-4 bg-[var(--accent)] text-black font-black rounded-2xl shadow-2xl hover:scale-110 transition-all z-50 flex items-center gap-3">
                {loading ? 'Saving...' : <><Save size={20} /> Save Life Hub</>}
              </button>
            </motion.div>
          )}

          {activeSubTab === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem]">
                <h3 className="text-sm font-black uppercase italic mb-8">Performance Logs (Last 30 Days)</h3>
                <div className="space-y-3">
                  {history.map((h, i) => {
                    const tasks = JSON.parse(h.tasks);
                    const rate = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);
                    return (
                      <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
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
                        <div className="flex items-center gap-4">
                          <span className={`text-xs font-black ${rate >= 80 ? 'text-green-500' : 'text-orange-500'}`}>{rate}%</span>
                          <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--accent)]" style={{ width: `${rate}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
