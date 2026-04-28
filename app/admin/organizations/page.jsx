import { createClient } from '@/utils/supabase/server';
import AdminSidebar from '@/components/AdminSidebar';
import OrganizationList from '@/components/OrganizationList';
import Link from 'next/link';
import { Plus, Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminOrganizations() {
  const supabase = await createClient();
  const { data: organizations } = await supabase
    .from('Organization')
    .select('*')
    .order('order', { ascending: true });

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Users className="text-accent" /> Manajemen Organisasi
            </h1>
            <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest font-bold">
              Kelola pengalaman organisasi dan kepemimpinan Anda.
            </p>
          </div>
          <Link
            href="/admin/organizations/add"
            className="px-6 py-4 bg-accent text-black font-black rounded-2xl flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-accent/20 uppercase tracking-widest text-xs"
          >
            <Plus size={18} /> Tambah Organisasi
          </Link>
        </header>

        <OrganizationList organizations={organizations} />

        {(!organizations || organizations.length === 0) && (
          <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-[var(--border-subtle)] mt-10">
            <Users size={48} className="mx-auto text-gray-800 mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
              Belum ada data organisasi.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
