import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import { GraduationCap, ArrowLeft, ExternalLink, ImageIcon, Calendar } from 'lucide-react';
import Link from 'next/link';
import PhotoSwiper from '@/components/PhotoSwiper';

export default async function EducationPage() {
  const supabase = await createClient();
  const { data: educations } = await supabase.from('Education').select('*').order('period', { ascending: false });

  return (
    <div className="min-h-screen bg-body text-foreground font-jakarta selection:bg-purple-500/30">
      <Navbar />
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-purple-500/10 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-purple-500 text-xs font-bold uppercase tracking-widest mb-8 hover:gap-4 transition-all">
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
          <h1 className="text-5xl md:text-8xl font-black font-outfit tracking-tighter uppercase mb-6 leading-none flex items-center gap-4">
            <GraduationCap className="text-purple-500 w-12 h-12 md:w-20 md:h-20" /> Pendidikan.
          </h1>
          <p className="text-gray-500 max-w-2xl text-lg md:text-xl font-medium leading-relaxed mb-12">
            Riwayat pendidikan formal maupun informal yang telah saya tempuh.
          </p>
        </div>
      </section>

      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {educations?.map((edu) => (
            <div key={edu.id} className="p-8 bg-white/5 border border-[var(--border-subtle)] rounded-[2.5rem] group hover:border-purple-500/30 transition-all flex flex-col h-[28rem]">
              <p className="text-purple-500 text-xs font-bold flex items-center gap-2 mb-3">
                <Calendar size={14} /> {edu.period || edu.year || 'Period N/A'}
              </p>
              <Link href={`/education/${edu.slug}`}>
                <h3 className="text-2xl font-black text-foreground mb-2 group-hover:text-purple-500 transition-colors line-clamp-2">
                  {edu.degree || 'Degree'}
                </h3>
              </Link>
              <p className="text-purple-500/80 font-bold uppercase text-[10px] tracking-widest mb-4">
                {edu.institution || 'Institution'} {edu.major ? `• ${edu.major}` : ''}
              </p>
              
              {Array.isArray(edu.images) && edu.images.length > 0 && (
                <div className="mb-4 flex-1 min-h-0 relative">
                  <PhotoSwiper images={edu.images} aspectRatio="h-full w-full absolute inset-0" rounded="rounded-2xl" />
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-[var(--border-subtle)]">
                <Link href={`/education/${edu.slug}`} className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-foreground/30 hover:text-purple-500 transition-colors">
                  <ImageIcon size={10} /> Detail
                </Link>
                {edu.proofUrl && (
                  <a href={edu.proofUrl} target="_blank" className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-purple-500 hover:text-foreground transition-colors">
                    <ExternalLink size={10} /> Sertifikat/Ijazah
                  </a>
                )}
              </div>
            </div>
          ))}
          {(!educations || educations.length === 0) && (
            <p className="text-gray-600 italic col-span-full">Belum ada riwayat pendidikan.</p>
          )}
        </div>
      </section>
    </div>
  );
}
