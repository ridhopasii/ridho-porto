import { createClient } from '@/utils/supabase/server';
import AdminSidebar from '@/components/AdminSidebar';
import MessageItem from '@/components/MessageItem';

export default async function AdminMessages() {
  const supabase = await createClient();
  const { data: messages, error } = await supabase
    .from('Message')
    .select('*')
    .order('createdAt', { ascending: false });

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-jakarta">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black font-outfit uppercase tracking-tight">
              Pesan Masuk
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Anda memiliki <span className="text-teal-500 font-bold">{messages?.length || 0}</span>{' '}
              pesan dari pengunjung.
            </p>
          </div>
        </header>

        <div className="grid gap-6 max-w-4xl">
          {messages?.map((msg) => (
            <MessageItem key={msg.id} msg={msg} />
          ))}

          {messages?.length === 0 && (
            <div className="text-center py-20 bg-white/5 border border-dashed border-white/10 rounded-3xl">
              <p className="text-gray-500 text-sm italic">Belum ada pesan masuk.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
