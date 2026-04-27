'use client';
import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  Save, Plus, Trash2, Target, RotateCcw, ClipboardList, 
  Settings, LayoutGrid, Calendar, TrendingUp, AlertCircle,
  Plane, Thermometer, Flame, History
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminProductivitySettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('config'); // config, templates, insights
  const [config, setConfig] = useState({
    block1: [],
    block2A: [],
    block2B: [],
    block2Sunday: [],
    block3: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [historyStats, setHistoryStats] = useState([]);

  useEffect(() => {
    fetchConfig();
    fetchStats();
  }, []);

  const fetchConfig = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('SiteSettings')
      .select('*')
      .eq('key', 'productivity_config')
      .single();

    if (data) {
      setConfig(JSON.parse(data.value));
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('Productivity')
      .select('date, pomodoroMinutes, tasks')
      .order('date', { ascending: false })
      .limit(10);
    
    if (data) setHistoryStats(data);
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('SiteSettings')
      .upsert({ key: 'productivity_config', value: JSON.stringify(config) }, { onConflict: 'key' });

    if (!error) {
      alert('Master Config Updated! 🚀');
      router.refresh();
    }
    setSaving(false);
  };

  const [newTaskInput, setNewTaskInput] = useState({ block: '', value: '' });

  const confirmAddTask = () => {
    if (newTaskInput.value.trim()) {
      setConfig({
        ...config,
        [newTaskInput.block]: [...config[newTaskInput.block], newTaskInput.value.trim()]
      });
      setNewTaskInput({ block: '', value: '' });
    }
  };

  if (loading) return <div className="p-20 text-center font-black uppercase tracking-widest text-gray-500 animate-pulse">Initializing System...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-jakarta">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <h1 className="text-4xl font-black font-outfit uppercase tracking-tighter mb-2 italic">Productivity <span className="text-[var(--accent)]">Engine</span></h1>
              <p className="text-gray-500 font-medium">Control center for your daily habits and performance tracking.</p>
            </div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-4 bg-[var(--accent)] text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-[var(--accent)]/20"
            >
              {saving ? 'Syncing...' : 'Sync Master Config'} <Save size={16} />
            </button>
          </header>

          {/* Sub Navigation */}
          <div className="flex gap-4 mb-10 border-b border-white/5 pb-4">
            {[
              { id: 'config', label: 'Master Tasks', icon: <Settings size={16} /> },
              { id: 'insights', label: 'History & Stats', icon: <TrendingUp size={16} /> }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white/10 text-[var(--accent)]' : 'text-gray-500 hover:text-white'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'config' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Object.keys(config).map((blockKey) => (
                <div key={blockKey} className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black font-outfit uppercase tracking-widest text-xs flex items-center gap-2 italic">
                      <LayoutGrid size={16} className="text-[var(--accent)]" /> {blockKey.replace(/([A-Z])/g, ' $1')}
                    </h3>
                    <button 
                      onClick={() => setNewTaskInput({ block: blockKey, value: '' })}
                      className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-[var(--accent)] transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {newTaskInput.block === blockKey && (
                      <div className="flex gap-2 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <input 
                          autoFocus
                          value={newTaskInput.value}
                          onChange={(e) => setNewTaskInput({...newTaskInput, value: e.target.value})}
                          onKeyDown={(e) => e.key === 'Enter' && confirmAddTask()}
                          placeholder="Task name..."
                          className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-[var(--accent)] text-sm transition-all"
                        />
                        <button onClick={confirmAddTask} className="p-4 bg-[var(--accent)] text-black rounded-2xl hover:scale-105 transition-all">
                          <Save size={16} />
                        </button>
                      </div>
                    )}

                    {config[blockKey].map((task, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl group hover:border-white/20 transition-all">
                        <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors">{task}</span>
                        <button 
                          onClick={() => {
                            const newBlock = config[blockKey].filter((_, index) => index !== i);
                            setConfig({ ...config, [blockKey]: newBlock });
                          }}
                          className="text-red-500/30 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="space-y-8">
              {/* Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Total Logs</p>
                  <h3 className="text-4xl font-black">74 <span className="text-sm text-gray-700">Hari</span></h3>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Success Rate</p>
                  <h3 className="text-4xl font-black text-green-500">82%</h3>
                </div>
                <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Current Streak</p>
                  <h3 className="text-4xl font-black text-orange-500 flex items-center gap-3">12 <Flame size={32} /></h3>
                </div>
              </div>

              {/* Recent Activity Table */}
              <div className="p-8 bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden">
                <h3 className="font-black font-outfit uppercase tracking-widest text-xs mb-8 flex items-center gap-2 italic">
                  <History size={16} className="text-blue-500" /> Recent User Logs
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] text-gray-600 font-black uppercase tracking-widest border-b border-white/5">
                        <th className="pb-4">Date</th>
                        <th className="pb-4">Completion</th>
                        <th className="pb-4">Pomodoro</th>
                        <th className="pb-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-bold">
                      {historyStats.map((row, i) => {
                        const comp = Math.round((JSON.parse(row.tasks).filter(t => t.completed).length / JSON.parse(row.tasks).length) * 100);
                        return (
                          <tr key={i} className="border-b border-white/5 group hover:bg-white/[0.02] transition-all">
                            <td className="py-5 text-gray-400">{new Date(row.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                            <td className="py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-[var(--accent)]" style={{ width: `${comp}%` }} />
                                </div>
                                <span>{comp}%</span>
                              </div>
                            </td>
                            <td className="py-5">{Math.floor(row.pomodoroMinutes / 25)} 🍅</td>
                            <td className="py-5">
                              <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black ${comp >= 80 ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                {comp >= 80 ? 'Optimal' : 'Low Focus'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
