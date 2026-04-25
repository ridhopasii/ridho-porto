'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import ExperienceForm from '@/components/ExperienceForm';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function EditExperiencePage() {
  const { id } = useParams();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('Experience').select('*').eq('id', id).single();
      setExperience(data);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex font-jakarta">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/admin/experience"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-teal-500 transition-all mb-8 group text-sm"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Daftar Pengalaman
          </Link>

          <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
            <h1 className="text-2xl font-bold mb-2">Edit Pengalaman</h1>
            <p className="text-gray-500 text-sm mb-8">
              Ubah data pengalaman kerja atau organisasi.
            </p>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-teal-500" size={32} />
              </div>
            ) : experience ? (
              <ExperienceForm initialData={experience} />
            ) : (
              <p className="text-gray-500 text-center py-10">Data pengalaman tidak ditemukan.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
