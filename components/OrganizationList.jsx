'use client';
import { Trash2, Edit, ExternalLink, Calendar, Users } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function OrganizationList({ organizations }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus pengalaman organisasi ini?')) return;

    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from('Organization').delete().eq('id', id);

    if (error) {
      alert('Gagal menghapus: ' + error.message);
      setDeletingId(null);
    } else {
      router.refresh();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {organizations?.map((org) => (
        <div
          key={org.id}
          className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex flex-col justify-between group hover:border-teal-500/30 transition-all"
        >
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-teal-500/10 text-teal-500 rounded-2xl">
                <Users size={24} />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/admin/organizations/edit/${org.id}`)}
                  className="p-3 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(org.id)}
                  disabled={deletingId === org.id}
                  className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all disabled:opacity-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">{org.name}</h3>
            <p className="text-teal-500 font-bold uppercase text-[10px] tracking-widest mb-4">
              {org.role}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-4">
              <Calendar size={14} /> {org.period}
            </div>
            <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">{org.description}</p>
          </div>

          {org.images?.length > 0 && (
            <div className="mt-6 flex gap-2 overflow-hidden">
              {org.images.slice(0, 3).map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  className="w-12 h-12 rounded-lg object-cover border border-white/10"
                  alt="Doc"
                />
              ))}
              {org.images.length > 3 && (
                <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-gray-500">
                  +{org.images.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
