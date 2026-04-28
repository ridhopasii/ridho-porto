'use client';
import { Trash2, GraduationCap, Edit, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EducationList({ initialEducations }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus data pendidikan ini?')) return;

    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from('Education').delete().eq('id', id);

    if (error) {
      alert('Gagal menghapus: ' + error.message);
      setDeletingId(null);
    } else {
      router.refresh();
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {initialEducations?.map((edu) => (
        <div
          key={edu.id}
          className="p-6 bg-white/5 border border-[var(--border-subtle)] rounded-3xl group hover:border-blue-500/50 transition-all"
        >
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <GraduationCap size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">{edu.major}</h3>
                <p className="text-blue-500 font-medium text-sm">{edu.institution}</p>
                <p className="text-gray-500 text-xs mt-1">{edu.year || edu.period}</p>
                <p className="text-gray-400 text-sm mt-1">{edu.degree}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Toggle Visibility Shortcut - ALWAYS VISIBLE */}
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  const supabase = createClient();
                  const { error } = await supabase
                    .from('Education')
                    .update({ showOnHome: !edu.showOnHome })
                    .eq('id', edu.id);
                  if (!error) router.refresh();
                }}
                className={`p-2.5 rounded-xl border transition-all ${
                  edu.showOnHome !== false
                    ? 'text-blue-500 bg-blue-500/10 border-blue-500/20'
                    : 'text-gray-500 bg-white/5 border-white/5'
                }`}
                title={edu.showOnHome !== false ? 'Tampil di Home' : 'Disembunyikan'}
              >
                {edu.showOnHome !== false ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all border-l border-[var(--border-subtle)] pl-3">
                <Link
                  href={`/admin/education/edit/${edu.id}`}
                  className="p-2 hover:bg-white/10 rounded-xl text-blue-400"
                >
                  <Edit size={20} />
                </Link>
                <button
                  onClick={() => handleDelete(edu.id)}
                  disabled={deletingId === edu.id}
                  className="p-2 hover:bg-red-500/10 rounded-xl text-red-400 disabled:opacity-50"
                >
                  {deletingId === edu.id ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Trash2 size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      {initialEducations?.length === 0 && (
        <div className="text-center py-20 bg-white/5 border border-dashed border-[var(--border-subtle)] rounded-3xl text-gray-500">
          Belum ada data pendidikan.
        </div>
      )}
    </div>
  );
}
