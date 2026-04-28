import { createClient } from '@/utils/supabase/server';
import AdminSidebar from '@/components/AdminSidebar';
import { Plus, Trash2, Cpu } from 'lucide-react';
import SkillForm from '@/components/SkillForm';
import SkillList from '@/components/SkillList';

export default async function AdminSkills() {
  const supabase = await createClient();
  const { data: skills } = await supabase.from('Skill').select('*').order('name');

  return (
    <div className="min-h-screen bg-background text-foreground flex font-jakarta">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-bold">Kelola Keterampilan</h1>
            <p className="text-gray-500 text-sm">
              Daftar teknologi yang Anda tampilkan di website.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Tambah Skill */}
          <div className="lg:col-span-1">
            <div className="p-6 bg-white/5 border border-[var(--border-subtle)] rounded-3xl sticky top-8">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus size={20} className="text-blue-500" /> Tambah Skill
              </h2>
              <SkillForm />
            </div>
          </div>

          {/* List Skill */}
          <div className="lg:col-span-2 space-y-4">
            <SkillList initialSkills={skills} />
          </div>
        </div>
      </main>
    </div>
  );
}
