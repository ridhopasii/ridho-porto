'use client';
import React, { useState, useEffect, useTransition } from 'react';
import Navbar from '@/components/Navbar';
import { 
  Target, Activity, Zap, Moon, Sun, Clipboard, 
  Download, FileText, RotateCcw, CheckCircle2, 
  Smile, Trophy, Timer as TimerIcon, Plus, 
  Trash2, Save, Calendar, ChevronRight
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function ProduktifPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState({
    completion: 0,
    completedCount: 0,
    totalCount: 0,
    streak: 0,
    pomodoro: 0
  });
  const [isPending, startTransition] = useTransition();

  // Default Task Definitions (From your HTML)
  const defaultTaskBlocks = {
    block1: [
      "Tahajud", "Subuh + Qur'an + Al-Waqiah", "Zikir pagi", "Dhuha",
      "Zuhur + Ar-Rahman", "Ashar + Al-Insyirah", "Magrib + Yasin",
      "Isya + Al-Mulk", "Tilawah 10 halaman", "5 vocabulary",
      "Jurnal malam", "Listening Episode"
    ],
    block2A: ["Deep Work Python", "Speaking (record 30 menit)", "Latihan desain 30 menit"],
    block2B: ["Deep Work C", "English reading & writing", "Belajar materi (WPU / konsep)"],
    block2Sunday: ["Administrasi file", "Review mingguan", "Istirahat / buffer"],
    block3: ["Review minggu", "Rapikan file", "Buffer task"]
  };

  useEffect(() => {
    fetchTodayData();
  }, []);

  const getDayType = () => {
    const day = new Date().getDay();
    if (day === 0) return 'Sunday';
    if (day === 1 || day === 3 || day === 5) return 'A';
    return 'B';
  };

  const fetchTodayData = async () => {
    setLoading(true);
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];
    
    // 1. Fetch Custom Config from SiteSettings
    const { data: configData } = await supabase
      .from('SiteSettings')
      .select('value')
      .eq('key', 'productivity_config')
      .single();

    const customBlocks = configData ? JSON.parse(configData.value) : defaultTaskBlocks;

    // 2. Fetch Today's Progress
    let { data, error } = await supabase
      .from('Productivity')
      .select('*')
      .eq('date', today)
      .single();

    if (!data) {
      // Initialize new day with dynamic config
      const dayType = getDayType();
      let block2 = dayType === 'A' ? customBlocks.block2A : 
                   dayType === 'B' ? customBlocks.block2B : 
                   customBlocks.block2Sunday || customBlocks.block2A;
      
      const allTasks = [
        ...(customBlocks.block1 || []).map(t => ({ name: t, completed: false, block: 1 })),
        ...(block2 || []).map(t => ({ name: t, completed: false, block: 2 })),
        ...(customBlocks.block3 || []).map(t => ({ name: t, completed: false, block: 3 }))
      ];

      const { data: newData } = await supabase
        .from('Productivity')
        .insert([{ 
          date: today, 
          tasks: JSON.stringify(allTasks),
          dayType: dayType
        }])
        .select()
        .single();
      
      data = newData;
    }

    if (data) {
      const parsedTasks = JSON.parse(data.tasks);
      setTasks(parsedTasks);
      calculateStats(parsedTasks);
    }
    setLoading(false);
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

    // Save to Supabase
    const supabase = createClient();
    const today = new Date().toISOString().split('T')[0];
    await supabase
      .from('Productivity')
      .update({ tasks: JSON.stringify(newTasks) })
      .eq('date', today);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 font-jakarta">
        <div className="w-full max-w-md p-10 bg-white/5 border border-white/10 rounded-[3rem] text-center">
          <div className="w-20 h-20 bg-[var(--accent)]/10 text-[var(--accent)] rounded-[2rem] flex items-center justify-center mx-auto mb-8">
            <Zap size={40} />
          </div>
          <h1 className="text-3xl font-black font-outfit uppercase tracking-tighter mb-2">Access Protected</h1>
          <p className="text-gray-500 mb-8 font-medium">Masukkan kata sandi untuk mengakses dasbor produktivitas kamu.</p>
          
          <input 
            type="password" 
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (e.target.value === 'zxcvbnm') setIsAuthenticated(true);
            }}
            placeholder="••••••••"
            className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-center text-xl tracking-[0.5em] focus:border-[var(--accent)] outline-none transition-all"
          />
          
          <p className="mt-8 text-[10px] text-gray-700 font-black uppercase tracking-widest">
            Ridho Robbi Pasi Dashboard v2.0
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-jakarta">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black font-outfit uppercase tracking-tighter mb-2">
              Produktif <span className="text-[var(--accent)]">Dashboard</span>
            </h1>
            <p className="text-gray-500 font-medium flex items-center gap-2">
              <Calendar size={16} /> {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          
          <div className="flex gap-3">
            <button className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-gray-400">
              <RotateCcw size={20} />
            </button>
            <button className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-gray-400">
              <Download size={20} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target size={80} />
            </div>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Progress Hari Ini</p>
            <h3 className="text-4xl font-black text-[var(--accent)]">{stats.completion}%</h3>
            <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
              <div 
                className="h-full bg-[var(--accent)] transition-all duration-1000" 
                style={{ width: `${stats.completion}%` }}
              />
            </div>
          </div>

          <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Tugas Selesai</p>
            <h3 className="text-4xl font-black">{stats.completedCount} <span className="text-lg text-gray-600 font-bold">/ {stats.totalCount}</span></h3>
          </div>

          <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Streak Konsisten</p>
            <h3 className="text-4xl font-black text-orange-500">7 <span className="text-lg text-gray-600 font-bold">Hari</span></h3>
          </div>

          <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Pomodoro 🍅</p>
            <h3 className="text-4xl font-black text-red-500">0</h3>
          </div>
        </div>

        {/* Task Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Block 1 */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black font-outfit uppercase tracking-tighter flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center text-sm">1</span>
                Fondasi Harian
              </h2>
            </div>
            <div className="space-y-3">
              {tasks.filter(t => t.block === 1).map((task, idx) => {
                const globalIdx = tasks.findIndex(t => t.name === task.name);
                return (
                  <button 
                    key={idx}
                    onClick={() => toggleTask(globalIdx)}
                    className={`w-full p-5 rounded-[1.5rem] border text-left transition-all flex items-center justify-between group ${
                      task.completed 
                        ? 'bg-[var(--accent)]/5 border-[var(--accent)]/30 text-[var(--accent)]' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <span className="font-bold text-sm">{task.name}</span>
                    {task.completed ? <CheckCircle2 size={18} /> : <div className="w-4 h-4 rounded-full border-2 border-white/10 group-hover:border-[var(--accent)]/50 transition-colors" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Block 2 */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black font-outfit uppercase tracking-tighter flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center text-sm">2</span>
                Rotasi Fokus
              </h2>
            </div>
            <div className="space-y-3">
              {tasks.filter(t => t.block === 2).map((task, idx) => {
                const globalIdx = tasks.findIndex(t => t.name === task.name);
                return (
                  <button 
                    key={idx}
                    onClick={() => toggleTask(globalIdx)}
                    className={`w-full p-5 rounded-[1.5rem] border text-left transition-all flex items-center justify-between group ${
                      task.completed 
                        ? 'bg-[var(--accent)]/5 border-[var(--accent)]/30 text-[var(--accent)]' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <span className="font-bold text-sm">{task.name}</span>
                    {task.completed ? <CheckCircle2 size={18} /> : <div className="w-4 h-4 rounded-full border-2 border-white/10 group-hover:border-[var(--accent)]/50 transition-colors" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Block 3 */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black font-outfit uppercase tracking-tighter flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center text-sm">3</span>
                Mingguan
              </h2>
            </div>
            <div className="space-y-3">
              {tasks.filter(t => t.block === 3).map((task, idx) => {
                const globalIdx = tasks.findIndex(t => t.name === task.name);
                return (
                  <button 
                    key={idx}
                    onClick={() => toggleTask(globalIdx)}
                    className={`w-full p-5 rounded-[1.5rem] border text-left transition-all flex items-center justify-between group ${
                      task.completed 
                        ? 'bg-[var(--accent)]/5 border-[var(--accent)]/30 text-[var(--accent)]' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <span className="font-bold text-sm">{task.name}</span>
                    {task.completed ? <CheckCircle2 size={18} /> : <div className="w-4 h-4 rounded-full border-2 border-white/10 group-hover:border-[var(--accent)]/50 transition-colors" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions Floating */}
        <div className="fixed bottom-10 right-10 flex flex-col gap-3">
          <button className="w-14 h-14 bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-red-500/20 hover:scale-110 transition-all">
            <TimerIcon size={24} />
          </button>
          <button className="w-14 h-14 bg-[var(--accent)] text-black rounded-2xl flex items-center justify-center shadow-xl shadow-[var(--accent)]/20 hover:scale-110 transition-all">
            <Plus size={24} />
          </button>
        </div>
      </main>
    </div>
  );
}
