'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import AdminSidebar from '@/components/AdminSidebar';
import EducationForm from '@/components/EducationForm';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function EditEducationPage() {
  const { eduId } = useParams();
  const [education, setEducation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('Education').select('*').eq('id', eduId).single();
      setEducation(data);
      setLoading(false);
    };
    fetchData();
  }, [eduId]);

  return (
    <div className="min-h-screen bg-background text-foreground flex font-jakarta">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/admin/education"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-teal-500 transition-all mb-8 group text-sm"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Daftar Pendidikan
          </Link>

          <div className="p-8 bg-white/5 border border-[var(--border-subtle)] rounded-3xl">
            <h1 className="text-2xl font-bold mb-2">Edit Pendidikan</h1>
            <p className="text-gray-500 text-sm mb-8">Ubah data riwayat pendidikan.</p>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-teal-500" size={32} />
              </div>
            ) : education ? (
              <EducationForm initialData={education} />
            ) : (
              <p className="text-gray-500 text-center py-10">Data pendidikan tidak ditemukan.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
