'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import SkillForm from '@/components/SkillForm';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function EditSkillPage() {
  const { id } = useParams();
  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkill = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('Skill').select('*').eq('id', id).single();
      setSkill(data);
      setLoading(false);
    };
    fetchSkill();
  }, [id]);

  return (
    <div className="min-h-screen bg-background text-foreground flex font-jakarta">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/admin/skills"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-teal-500 transition-all mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Daftar Skill
          </Link>

          <div className="p-8 bg-white/5 border border-[var(--border-subtle)] rounded-3xl">
            <h1 className="text-2xl font-bold mb-8">Edit Skill</h1>
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-teal-500" size={32} />
              </div>
            ) : skill ? (
              <SkillForm initialData={skill} />
            ) : (
              <p className="text-gray-500 text-center py-10">Skill tidak ditemukan.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
