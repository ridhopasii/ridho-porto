import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { Plus, Edit, Trash2, ExternalLink, Folders } from 'lucide-react';
import ProjectList from '@/components/ProjectList';

export default async function AdminProjects() {
  const supabase = await createClient();
  const { data: projects, error } = await supabase
    .from('Project')
    .select('*')
    .order('createdAt', { ascending: false });

  return (
    <div className="min-h-screen bg-background text-foreground flex font-jakarta">
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold">Kelola Proyek</h1>
            <p className="text-gray-500 text-sm">Total: {projects?.length || 0} Proyek ditemukan</p>
          </div>
          <Link
            href="/admin/projects/new"
            className="px-6 py-3 bg-teal-500 text-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-all"
          >
            <Plus size={20} />
            Tambah Proyek
          </Link>
        </header>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 mb-6">
            Error: {error.message} (Cek RLS di Supabase)
          </div>
        )}

        {/* Projects List */}
        <ProjectList initialProjects={projects} />
      </main>
    </div>
  );
}
