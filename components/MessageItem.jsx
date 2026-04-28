'use client';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Trash2, Mail, Calendar, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function MessageItem({ msg }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const markAsRead = async () => {
    if (msg.isRead) return;
    const supabase = createClient();
    await supabase.from('Message').update({ isRead: true }).eq('id', msg.id);
    router.refresh();
  };

  const handleDelete = async () => {
    if (!confirm('Hapus pesan ini?')) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from('Message').delete().eq('id', msg.id);
    router.refresh();
  };

  return (
    <div
      onClick={markAsRead}
      className={`p-6 border rounded-3xl transition-all relative group cursor-pointer ${
        msg.isRead
          ? 'bg-white/5 border-[var(--border-subtle)] grayscale-[0.5] opacity-70'
          : 'bg-teal-500/5 border-teal-500/30 shadow-lg shadow-teal-500/5'
      }`}
    >
      {!msg.isRead && (
        <div className="absolute top-6 right-6 px-3 py-1 bg-teal-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full animate-pulse">
          Baru
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
              msg.isRead ? 'bg-white/5 text-gray-500' : 'bg-teal-500 text-black'
            }`}
          >
            <Mail size={24} />
          </div>
          <div>
            <h3 className="font-black text-xl font-outfit uppercase tracking-tight">{msg.name}</h3>
            <p className="text-sm text-gray-500 font-medium">{msg.email}</p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest flex items-center gap-2 justify-end">
            <Calendar size={12} />
            {new Date(msg.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="p-6 bg-black/40 rounded-2xl mb-6 border border-white/5">
        <p className="text-gray-300 leading-relaxed font-medium">
          <span className="text-teal-500 font-bold mr-2">Subject:</span>{' '}
          {msg.subject || 'Tanpa Subjek'}
        </p>
        <div className="h-px bg-white/5 my-4" />
        <p className="text-gray-400 leading-relaxed italic text-sm">"{msg.message}"</p>
      </div>

      <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all">
        <div className="flex items-center gap-2 text-[10px] text-teal-500 font-bold uppercase tracking-widest">
          {msg.isRead && (
            <>
              <CheckCircle2 size={12} /> Sudah Dibaca
            </>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-red-500/20"
        >
          <Trash2 size={14} />
          Hapus Pesan
        </button>
      </div>
    </div>
  );
}
