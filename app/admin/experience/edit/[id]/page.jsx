'use client';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ExperienceForm from '@/components/ExperienceForm';
import AdminSidebar from '@/components/AdminSidebar';

export default function EditExperience() {
  const { id } = useParams();
  const [experience, setExperience] = useState(null);

  useEffect(() => {
    const fetchExperience = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('Experience').select('*').eq('id', id).single();
      setExperience(data);
    };
    if (id) fetchExperience();
  }, [id]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-8 text-teal-500">Edit Pengalaman</h1>
        {experience ? (
          <ExperienceForm initialData={experience} />
        ) : (
          <div className="text-gray-500">Memuat data...</div>
        )}
      </main>
    </div>
  );
}
