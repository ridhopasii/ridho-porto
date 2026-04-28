'use client';
import { Plus, Edit, Trash2, ExternalLink, Folders, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProjectList({ initialProjects }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus proyek ini?')) return;

    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from('Project').delete().eq('id', id);

    if (error) {
      alert('Gagal menghapus: ' + error.message);
      setDeletingId(null);
    } else {
      router.refresh();
      setDeletingId(null);
    }
  };

  return (
    <div className="grid gap-4">
      {initialProjects?.map((project) => (
        <div
          key={project.id}
          className="p-4 bg-white/5 border border-[var(--border-subtle)] rounded-2xl flex items-center justify-between group hover:border-blue-500/50 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/10 overflow-hidden">
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  <Folders />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg">{project.title}</h3>
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-500 line-clamp-1 max-w-md">{project.description}</p>
                {project.showOnHome !== false ? (
                  <span className="flex items-center gap-1 text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                    <Eye size={10} /> Home
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] bg-white/5 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                    <EyeOff size={10} /> Hidden
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle Visibility Shortcut - ALWAYS VISIBLE */}
            <button
              onClick={async (e) => {
                e.preventDefault();
                const supabase = createClient();
                const { error } = await supabase
                  .from('Project')
                  .update({ showOnHome: !project.showOnHome })
                  .eq('id', project.id);
                if (!error) router.refresh();
              }}
              className={`p-2.5 rounded-xl border transition-all ${
                project.showOnHome !== false 
                  ? 'text-blue-500 bg-blue-500/10 border-blue-500/20' 
                  : 'text-gray-500 bg-white/5 border-white/5'
              }`}
              title={project.showOnHome !== false ? "Tampil di Home" : "Disembunyikan"}
            >
              {project.showOnHome !== false ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all border-l border-[var(--border-subtle)] pl-3">
              <Link
                href={`/admin/projects/edit/${project.id}`}
                className="p-2 hover:bg-white/10 rounded-lg text-blue-400"
                title="Edit"
              >
                <Edit size={20} />
              </Link>
              <button
                onClick={() => handleDelete(project.id)}
                disabled={deletingId === project.id}
                className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 disabled:opacity-50"
                title="Hapus"
              >
                {deletingId === project.id ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Trash2 size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}

      {initialProjects?.length === 0 && (
        <div className="text-center py-20 bg-white/5 border border-dashed border-[var(--border-subtle)] rounded-3xl">
          <p className="text-gray-500">Belum ada proyek. Klik "Tambah Proyek" untuk memulai.</p>
        </div>
      )}
    </div>
  );
}
