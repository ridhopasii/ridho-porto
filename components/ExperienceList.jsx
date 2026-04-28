'use client';
import React, { useState, useTransition } from 'react';
import { Trash2, Briefcase, Edit, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function ExperienceList({ initialExperiences }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus pengalaman ini?')) return;

    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from('Experience').delete().eq('id', id);

    if (error) {
      alert('Gagal menghapus: ' + error.message);
      setDeletingId(null);
    } else {
      startTransition(() => {
        router.refresh();
        setDeletingId(null);
      });
    }
  };

  return (
    <div className="space-y-4">
      {initialExperiences?.map((exp) => (
        <div
          key={exp.id}
          className="p-6 bg-white/5 border border-[var(--border-subtle)] rounded-3xl group hover:border-accent/50 transition-all"
        >
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                <Briefcase size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg">{exp.position}</h3>
                <p className="text-accent font-medium text-sm">{exp.company}</p>
                <p className="text-gray-500 text-xs mt-1">{exp.period}</p>
                {exp.description && (
                  <p className="text-gray-400 text-sm mt-3 line-clamp-2">{exp.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Toggle Visibility Shortcut - ALWAYS VISIBLE */}
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  const supabase = createClient();
                  const { error } = await supabase
                    .from('Experience')
                    .update({ showOnHome: !exp.showOnHome })
                    .eq('id', exp.id);
                  if (!error) router.refresh();
                }}
                className={`p-2.5 rounded-xl border transition-all ${
                  exp.showOnHome !== false
                    ? 'text-accent bg-accent/10 border-accent/20'
                    : 'text-gray-500 bg-white/5 border-[var(--border-subtle)]'
                }`}
                title={exp.showOnHome !== false ? 'Tampil di Home' : 'Disembunyikan'}
              >
                {exp.showOnHome !== false ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all border-l border-[var(--border-subtle)] pl-3">
                <Link
                  href={`/admin/experience/edit/${exp.id}`}
                  className="p-2 hover:bg-white/10 rounded-xl text-accent"
                >
                  <Edit size={20} />
                </Link>
                <button
                  onClick={() => handleDelete(exp.id)}
                  disabled={deletingId === exp.id}
                  className="p-2 hover:bg-red-500/10 rounded-xl text-red-400 disabled:opacity-50"
                >
                  {deletingId === exp.id ? (
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
      {initialExperiences?.length === 0 && (
        <div className="text-center py-20 bg-white/5 border border-dashed border-[var(--border-subtle)] rounded-3xl text-gray-500">
          Belum ada data pengalaman.
        </div>
      )}
    </div>
  );
}
