import { createClient } from '@/utils/supabase/server';
import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';
import { Plus, Trash2, GraduationCap, Calendar, Pencil } from 'lucide-react';
import EducationForm from '@/components/EducationForm';

export default async function AdminEducation() {
  const supabase = await createClient();
  const { data: educations } = await supabase
    .from('Education')
    .select('*')
    .order('year', { ascending: false });

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-jakarta">
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
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl sticky top-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus size={20} className="text-purple-500" /> Tambah Pendidikan
              </h2>
              <EducationForm />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {educations?.map((edu) => (
              <div
                key={edu.id}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-purple-500/30 transition-all"
              >
                <div className="flex gap-4">
                  <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl h-fit">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{edu.degree}</h3>
                    <p className="text-gray-400 font-medium">{edu.institution}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar size={12} /> {edu.year}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <Link
                    href={`/admin/education/edit/${edu.id}`}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    <Pencil size={18} />
                  </Link>
                  <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
            {educations?.length === 0 && (
              <p className="text-gray-600 italic">Belum ada data pendidikan.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
