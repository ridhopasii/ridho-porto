import { createClient } from '@/utils/supabase/server';
import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';
import { Plus, Trash2, GraduationCap, Calendar, Pencil } from 'lucide-react';
import EducationForm from '@/components/EducationForm';
import EducationList from '@/components/EducationList';

export default async function AdminEducation() {
  const supabase = await createClient();
  const { data: educations } = await supabase
    .from('Education')
    .select('*')
    .order('year', { ascending: false });

  return (
    <div className="min-h-screen bg-body text-foreground flex font-jakarta">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold">Kelola Pendidikan</h1>
            <p className="text-gray-500 text-sm">Riwayat akademis dan sertifikasi Anda.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="p-6 bg-white/5 border border-[var(--border-subtle)] rounded-3xl sticky top-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus size={20} className="text-purple-500" /> Tambah Pendidikan
              </h2>
              <EducationForm />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <EducationList initialEducations={educations} />
          </div>
        </div>
      </main>
    </div>
  );
}
