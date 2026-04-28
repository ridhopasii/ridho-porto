'use client';
import { Trash2, Edit, Image as ImageIcon, Calendar, Tag, Eye, EyeOff } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function GalleryList({ galleryItems }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus item galeri ini?')) return;

    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from('Gallery').delete().eq('id', id);

    if (error) {
      alert('Gagal menghapus: ' + error.message);
      setDeletingId(null);
    } else {
      router.refresh();
    }
  };

  const toggleVisibility = async (item) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('Gallery')
      .update({ showOnHome: !item.showOnHome })
      .eq('id', item.id);

    if (!error) {
      router.refresh();
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {galleryItems?.map((item) => (
        <div
          key={item.id}
          className="group bg-white/5 border border-[var(--border-subtle)] rounded-[2.5rem] overflow-hidden hover:border-purple-500/30 transition-all"
        >
          <div className="relative aspect-video">
            {item.images?.[0] ? (
              <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-black/40 flex items-center justify-center text-gray-700">
                <ImageIcon size={48} />
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
              <button
                onClick={() => toggleVisibility(item)}
                className={`p-3 rounded-xl hover:scale-110 transition-all ${
                  item.showOnHome !== false ? 'bg-blue-500 text-foreground' : 'bg-gray-500 text-foreground'
                }`}
              >
                {item.showOnHome !== false ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <button
                onClick={() => router.push(`/admin/gallery/edit/${item.id}`)}
                className="p-3 bg-white text-black rounded-xl hover:scale-110 transition-all"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="p-3 bg-red-500 text-foreground rounded-xl hover:scale-110 transition-all disabled:opacity-50"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-purple-500 text-foreground text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                {item.category}
              </span>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-1">{item.title}</h3>
            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              <Calendar size={12} /> {item.date || 'No Date'}
              <span className="ml-auto text-purple-500">{item.images?.length || 0} Photos</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
