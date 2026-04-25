import { createClient } from '@/utils/supabase/server';
import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';
import { Plus, Trash2, Briefcase, Calendar, Pencil } from 'lucide-react';
import ExperienceForm from '@/components/ExperienceForm';

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
            {experiences?.map((exp) => (
              <div
                key={exp.id}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between group hover:border-teal-500/30 transition-all"
              >
                <div className="flex gap-4">
                  <div className="p-3 bg-teal-500/10 text-teal-500 rounded-xl h-fit">
                    <Briefcase size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{exp.position}</h3>
                    <p className="text-gray-400 font-medium">{exp.company}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar size={12} /> {exp.period}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <Link
                    href={`/admin/experience/edit/${exp.id}`}
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
            {experiences?.length === 0 && (
              <p className="text-gray-600 italic">Belum ada data pengalaman kerja.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
