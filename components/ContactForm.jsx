'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Send, Loader2, CheckCircle2, User, Mail, MessageSquare } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: dbError } = await supabase.from('Message').insert([formData]);

    setLoading(false);
    if (dbError) {
      setError('Gagal mengirim pesan. Silakan coba lagi.');
    } else {
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  if (success) {
    return (
      <div className="p-10 bg-teal-500/10 border border-teal-500/30 rounded-3xl text-center">
        <CheckCircle2 size={48} className="text-teal-500 mx-auto mb-4" />
        <h3 className="text-xl font-black text-foreground mb-2 uppercase tracking-tight">
          Pesan Terkirim!
        </h3>
        <p className="text-gray-400 text-sm">
          Terima kasih! Saya akan membalas pesan Anda secepatnya.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 px-6 py-3 bg-white/10 text-foreground text-xs font-bold rounded-xl hover:bg-white/20 transition-all uppercase tracking-widest"
        >
          Kirim Pesan Lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <User
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
          <input
            required
            type="text"
            placeholder="Nama Lengkap"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-2xl pl-12 pr-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-foreground placeholder:text-gray-600 text-sm font-medium"
          />
        </div>
        <div className="relative">
          <Mail
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
          <input
            required
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-2xl pl-12 pr-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-foreground placeholder:text-gray-600 text-sm font-medium"
          />
        </div>
      </div>

      <div className="relative">
        <MessageSquare
          size={16}
          className="absolute left-4 top-4 text-gray-500 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Perihal / Subjek"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-2xl pl-12 pr-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-foreground placeholder:text-gray-600 text-sm font-medium"
        />
      </div>

      <textarea
        required
        rows={5}
        placeholder="Tulis pesan Anda di sini..."
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        className="w-full bg-white/5 border border-[var(--border-subtle)] rounded-2xl px-5 py-4 focus:border-teal-500 focus:outline-none transition-all text-foreground placeholder:text-gray-600 resize-none text-sm font-medium"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full py-5 bg-teal-500 text-black font-black rounded-2xl hover:bg-teal-400 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-sm uppercase tracking-widest shadow-xl shadow-teal-500/20 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" /> Mengirim...
          </>
        ) : (
          <>
            <Send size={20} /> Kirim Pesan
          </>
        )}
      </button>
    </form>
  );
}
