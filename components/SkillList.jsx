'use client';
import { Trash2, Cpu, Loader2, Pencil, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function SkillList({ initialSkills }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus skill ini?')) return;

    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from('Skill').delete().eq('id', id);

    if (error) {
      alert('Gagal menghapus: ' + error.message);
      setDeletingId(null);
    } else {
      router.refresh();
      setDeletingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {initialSkills?.map((skill) => (
        <div
          key={skill.id}
          className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-teal-500/50 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 text-teal-500 rounded-lg">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="font-bold">{skill.name}</h3>
              <p className="text-xs text-gray-500">
                {skill.category || 'skill'} • {skill.level || 'Expert'}{' '}
                {skill.percentage ? `• ${skill.percentage}%` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
            <button
              onClick={async () => {
                const supabase = createClient();
                const { error } = await supabase
                  .from('Skill')
                  .update({ showOnHome: !skill.showOnHome })
                  .eq('id', skill.id);
                if (!error) router.refresh();
              }}
              className={`p-2 transition-all rounded-lg ${
                skill.showOnHome !== false ? 'text-teal-500 hover:bg-teal-500/10' : 'text-gray-600 hover:bg-white/5'
              }`}
              title={skill.showOnHome !== false ? "Sembunyikan" : "Tampilkan"}
            >
              {skill.showOnHome !== false ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <Link
              href={`/admin/skills/edit/${skill.id}`}
              className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg"
            >
              <Pencil size={16} />
            </Link>
            <button
              onClick={() => handleDelete(skill.id)}
              disabled={deletingId === skill.id}
              className="p-2 text-red-500 transition-all hover:bg-red-500/10 rounded-lg disabled:opacity-50"
            >
              {deletingId === skill.id ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          </div>
        </div>
      ))}
      {initialSkills?.length === 0 && <p className="text-gray-600 italic">Belum ada data skill.</p>}
    </div>
  );
}
