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
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-500 line-clamp-1 max-w-md">{project.description}</p>
                {project.showOnHome !== false ? (
                  <span className="flex items-center gap-1 text-[10px] bg-teal-500/10 text-teal-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
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

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
            {/* Toggle Visibility Shortcut */}
            <button
              onClick={async () => {
                const supabase = createClient();
                const { error } = await supabase
                  .from('Project')
                  .update({ showOnHome: !project.showOnHome })
                  .eq('id', project.id);
                if (!error) router.refresh();
              }}
              className={`p-2 rounded-lg transition-all ${
                project.showOnHome !== false 
                  ? 'text-teal-500 hover:bg-teal-500/10' 
                  : 'text-gray-600 hover:bg-white/5'
              }`}
              title={project.showOnHome !== false ? "Sembunyikan dari Home" : "Tampilkan di Home"}
            >
              {project.showOnHome !== false ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>

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
