'use client';
import { Plus, Edit, Trash2, ExternalLink, Folders, Loader2 } from 'lucide-react';
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
          className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-teal-500/50 transition-all"
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
              <p className="text-sm text-gray-500 line-clamp-1 max-w-md">{project.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
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
            <a
              href={project.projectUrl}
              target="_blank"
              className="p-2 hover:bg-white/10 rounded-lg text-teal-400"
              title="Lihat"
            >
              <ExternalLink size={20} />
            </a>
          </div>
        </div>
      ))}

      {initialProjects?.length === 0 && (
        <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
          <p className="text-gray-500">Belum ada proyek. Klik "Tambah Proyek" untuk memulai.</p>
        </div>
      )}
    </div>
  );
}
