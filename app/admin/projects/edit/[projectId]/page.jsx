'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import ProjectForm from '@/components/ProjectForm';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function EditProject() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (projectId) fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    const { data, error } = await supabase.from('Project').select('*').eq('id', projectId).single();

    if (data) setProject(data);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/admin/projects"
            className="flex items-center gap-2 text-gray-500 hover:text-foreground transition-all mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Daftar Proyek
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-8">Edit Proyek</h1>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-teal-500 animate-spin" />
            </div>
          ) : project ? (
            <div className="bg-[#1a1a1a] p-8 rounded-3xl border border-white/5 shadow-2xl">
              <ProjectForm initialData={project} />
            </div>
          ) : (
            <div className="text-center py-20 bg-[#1a1a1a] rounded-3xl border border-white/5">
              <p className="text-gray-400">Proyek dengan ID {projectId} tidak ditemukan.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
