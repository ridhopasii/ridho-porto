'use client';
import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { Save, Plus, Trash2, Target, RotateCcw, ClipboardList } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminProductivitySettings() {
  const router = useRouter();
  const [config, setConfig] = useState({
    block1: [],
    block2A: [],
    block2B: [],
    block2Sunday: [],
    block3: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
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
    } else {
      // Default initial config if not exists
      const defaultConfig = {
        block1: ["Tahajud", "Subuh", "Zikir", "Dhuha"],
        block2A: ["Deep Work Python", "Speaking"],
        block2B: ["Deep Work C", "English"],
        block2Sunday: ["Review", "File Cleanup"],
        block3: ["Weekly Review", "Buffer"]
      };
      setConfig(defaultConfig);
    }
    setLoading(false);
  };

  const handleAddTask = (blockKey) => {
    const newTask = prompt('Masukkan nama tugas baru:');
    if (newTask) {
      setConfig({
        ...config,
        [blockKey]: [...config[blockKey], newTask]
      });
    }
  };

  const handleRemoveTask = (blockKey, index) => {
    const newBlock = config[blockKey].filter((_, i) => i !== index);
    setConfig({ ...config, [blockKey]: newBlock });
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    
    // Check if exists
    const { data: existing } = await supabase
      .from('SiteSettings')
      .select('*')
      .eq('key', 'productivity_config')
      .single();

    let result;
    if (existing) {
      result = await supabase
        .from('SiteSettings')
        .update({ value: JSON.stringify(config) })
        .eq('key', 'productivity_config');
    } else {
      result = await supabase
        .from('SiteSettings')
        .insert([{ key: 'productivity_config', value: JSON.stringify(config) }]);
    }

    if (!result.error) {
      alert('Pengaturan Produktivitas Berhasil Disimpan! ✨');
      router.refresh();
    }
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-center">Memuat Pengaturan...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-jakarta">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-black font-outfit uppercase tracking-tighter mb-2">Master Tugas Produktif</h1>
              <p className="text-gray-500">Kelola daftar tugas default untuk dashboard produktivitas kamu.</p>
            </div>
            <button 
              onClick={handleSave}
              disabled={saving}
              className="px-8 py-4 bg-[var(--accent)] text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-[var(--accent)]/20"
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'} <Save size={16} />
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* BLOCK 1 */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black font-outfit uppercase tracking-widest text-blue-500 flex items-center gap-2">
                  <Target size={18} /> Blok 1: Fondasi
                </h3>
                <button onClick={() => handleAddTask('block1')} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 text-blue-500">
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-2">
                {config.block1.map((task, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-xl group">
                    <span className="text-sm font-medium text-gray-300">{task}</span>
                    <button onClick={() => handleRemoveTask('block1', i)} className="text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* BLOCK 2A */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black font-outfit uppercase tracking-widest text-orange-500 flex items-center gap-2">
                  <RotateCcw size={18} /> Blok 2A: Teknis
                </h3>
                <button onClick={() => handleAddTask('block2A')} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 text-orange-500">
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-2">
                {config.block2A.map((task, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-xl group">
                    <span className="text-sm font-medium text-gray-300">{task}</span>
                    <button onClick={() => handleRemoveTask('block2A', i)} className="text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* BLOCK 2B */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black font-outfit uppercase tracking-widest text-purple-500 flex items-center gap-2">
                  <RotateCcw size={18} /> Blok 2B: Bahasa
                </h3>
                <button onClick={() => handleAddTask('block2B')} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 text-purple-500">
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-2">
                {config.block2B.map((task, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-xl group">
                    <span className="text-sm font-medium text-gray-300">{task}</span>
                    <button onClick={() => handleRemoveTask('block2B', i)} className="text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* BLOCK 3 */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black font-outfit uppercase tracking-widest text-green-500 flex items-center gap-2">
                  <ClipboardList size={18} /> Blok 3: Mingguan
                </h3>
                <button onClick={() => handleAddTask('block3')} className="p-2 bg-white/5 rounded-xl hover:bg-white/10 text-green-500">
                  <Plus size={16} />
                </button>
              </div>
              <div className="space-y-2">
                {config.block3.map((task, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-xl group">
                    <span className="text-sm font-medium text-gray-300">{task}</span>
                    <button onClick={() => handleRemoveTask('block3', i)} className="text-red-500/50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
