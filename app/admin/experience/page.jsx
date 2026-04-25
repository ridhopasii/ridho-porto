import { createClient } from '@/utils/supabase/server';
import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';
import { Plus, Trash2, Briefcase, Calendar, Pencil } from 'lucide-react';
import ExperienceForm from '@/components/ExperienceForm';
import ExperienceList from '@/components/ExperienceList';

export default async function AdminExperience() {
  const supabase = await createClient();
  const { data: experiences } = await supabase
    .from('Experience')
    .select('*')
    .order('period', { ascending: false });

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-jakarta">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold">Kelola Pengalaman</h1>
            <p className="text-gray-500 text-sm">Riwayat karir profesional Anda.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Tambah Pengalaman */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl sticky top-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus size={20} className="text-teal-500" /> Tambah Pengalaman
              </h2>
              <ExperienceForm />
            </div>
          </div>

          {/* List Pengalaman */}
          <div className="lg:col-span-2 space-y-4">
            <ExperienceList initialExperiences={experiences} />
          </div>
        </div>
      </main>
    </div>
  );
}
