import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import { Trophy, ArrowLeft, ExternalLink, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import PhotoSwiper from '@/components/PhotoSwiper';

export default async function AwardsPage() {
  const supabase = await createClient();
  const { data: awards } = await supabase.from('Award').select('*').order('date', { ascending: false });

  return (
    <div className="min-h-screen bg-[#050505] text-white font-jakarta selection:bg-yellow-500/30">
      <Navbar />
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-yellow-500/10 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-yellow-500 text-xs font-bold uppercase tracking-widest mb-8 hover:gap-4 transition-all">
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
          <h1 className="text-5xl md:text-8xl font-black font-outfit tracking-tighter uppercase mb-6 leading-none flex items-center gap-4">
            <Trophy className="text-yellow-500 w-12 h-12 md:w-20 md:h-20" /> Awards.
          </h1>
          <p className="text-gray-500 max-w-2xl text-lg md:text-xl font-medium leading-relaxed mb-12">
            Kumpulan penghargaan, sertifikat, dan pencapaian profesional.
          </p>
        </div>
      </section>

      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {awards?.map((award) => (
            <div key={award.id} className="p-6 bg-white/5 border border-white/10 rounded-[2.5rem] group hover:border-yellow-500/30 transition-all flex flex-col h-[26rem]">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-2xl">
                  <Trophy size={20} />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {award.date || 'Date N/A'}
                </span>
              </div>
              <Link href={`/awards/${award.slug}`}>
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-500 transition-colors line-clamp-2">
                  {award.title || 'Award Title'}
                </h3>
              </Link>
              <p className="text-yellow-500/80 font-bold uppercase text-[10px] tracking-widest mb-4">
                {award.organizer || 'Organizer'}
              </p>
              
              {Array.isArray(award.images) && award.images.length > 0 && (
                <div className="mb-4 flex-1 min-h-0 relative">
                  <PhotoSwiper images={award.images} aspectRatio="h-full w-full absolute inset-0" rounded="rounded-2xl" />
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                <Link href={`/awards/${award.slug}`} className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-yellow-500 transition-colors">
                  <ImageIcon size={10} /> Details
                </Link>
                {award.proofUrl && (
                  <a href={award.proofUrl} target="_blank" className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-yellow-500 hover:text-white transition-colors">
                    <ExternalLink size={10} /> Credentials
                  </a>
                )}
              </div>
            </div>
          ))}
          {(!awards || awards.length === 0) && (
            <p className="text-gray-600 italic col-span-full">Belum ada penghargaan.</p>
          )}
        </div>
      </section>
    </div>
  );
}
