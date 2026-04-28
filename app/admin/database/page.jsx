import { createClient } from '@/utils/supabase/server';
import AdminSidebar from '@/components/AdminSidebar';
import { Database, Table, HardDrive, Zap, RefreshCcw } from 'lucide-react';

export default async function DatabaseDashboard() {
  const supabase = await createClient();
  
  // Fetch Row Counts for major tables
  const tables = ['Project', 'Article', 'Experience', 'Message', 'Organization', 'Skill'];
  const stats = await Promise.all(
    tables.map(async (table) => {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      return { name: table, count: count || 0 };
    })
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex font-jakarta">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-500/10 rounded-2xl">
                <Database size={24} className="text-blue-500" />
              </div>
              <h1 className="text-3xl font-black font-outfit uppercase tracking-tighter">Database Control Center</h1>
            </div>
            <p className="text-gray-500 ml-16">Pantau status data dan performa Supabase kamu secara real-time.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-8 bg-white/5 border border-[var(--border-subtle)] rounded-[2.5rem]">
              <Zap className="text-yellow-500 mb-4" />
              <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Status Koneksi</h3>
              <p className="text-2xl font-black text-green-500">CONNECTED</p>
            </div>
            <div className="p-8 bg-white/5 border border-[var(--border-subtle)] rounded-[2.5rem]">
              <HardDrive className="text-purple-500 mb-4" />
              <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Entri Data</h3>
              <p className="text-4xl font-black">{stats.reduce((a, b) => a + b.count, 0)}</p>
            </div>
            <div className="p-8 bg-white/5 border border-[var(--border-subtle)] rounded-[2.5rem]">
              <RefreshCcw className="text-blue-500 mb-4" />
              <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Sync Status</h3>
              <p className="text-2xl font-black">AUTOMATIC</p>
            </div>
          </div>

          <h2 className="text-xl font-black font-outfit uppercase tracking-tighter mb-6 flex items-center gap-2">
            <Table size={20} className="text-gray-500" /> Tabel Statisik
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((table) => (
              <div key={table.name} className="p-6 bg-white/5 border border-[var(--border-subtle)] rounded-3xl flex items-center justify-between hover:border-white/20 transition-all group">
                <div>
                  <p className="text-gray-400 font-bold text-sm">{table.name}</p>
                  <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mt-1">Production Table</p>
                </div>
                <div className="text-3xl font-black group-hover:text-[var(--accent)] transition-colors">
                  {table.count}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-8 bg-blue-500/10 border border-blue-500/20 rounded-[2.5rem]">
            <h3 className="font-bold text-blue-400 mb-2">💡 Tips Database</h3>
            <p className="text-sm text-blue-300/70 leading-relaxed">
              Selalu lakukan backup berkala jika ingin melakukan manipulasi data besar. Kamu bisa melihat log aktivitas lengkap langsung di Dashboard Supabase Cloud jika membutuhkan debugging mendalam.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
