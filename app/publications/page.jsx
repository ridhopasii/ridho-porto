import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import { FileText, ArrowLeft, ArrowRight, ImageIcon } from 'lucide-react';
import Link from 'next/link';
import PhotoSwiper from '@/components/PhotoSwiper';

export default async function PublicationsPage() {
  const supabase = await createClient();
  const { data: publications } = await supabase.from('Publication').select('*').order('date', { ascending: false });

  return (
    <div className="min-h-screen bg-background text-foreground font-jakarta selection:bg-accent/30">
      <Navbar />
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-accent/10 blur-[120px] rounded-full -z-10" />
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-8 hover:gap-4 transition-all">
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
          <h1 className="text-5xl md:text-8xl font-black font-outfit tracking-tighter uppercase mb-6 leading-none flex items-center gap-4">
            <FileText className="text-accent w-12 h-12 md:w-20 md:h-20" /> Publikasi.
          </h1>
          <p className="text-gray-500 max-w-2xl text-lg md:text-xl font-medium leading-relaxed mb-12">
            Kumpulan jurnal, penelitian, artikel, dan publikasi akademik.
          </p>
        </div>
      </section>

      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {publications?.map((pub) => (
            <div key={pub.id} className="p-6 bg-white/5 border border-[var(--border-subtle)] rounded-[2.5rem] group hover:border-accent/30 transition-all flex flex-col h-[26rem]">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-accent/10 text-accent rounded-2xl">
                  <FileText size={20} />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {pub.date || 'Date N/A'}
                </span>
              </div>
              <Link href={`/publications/${pub.slug}`}>
                <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-accent transition-colors line-clamp-2">
                  {pub.title || 'Publication Title'}
                </h3>
              </Link>
              <p className="text-accent/80 font-bold uppercase text-[10px] tracking-widest mb-4">
                {pub.outlet || 'Publisher'}
              </p>
              
              {Array.isArray(pub.images) && pub.images.length > 0 && (
                <div className="mb-4 flex-1 min-h-0 relative">
                  <PhotoSwiper images={pub.images} aspectRatio="h-full w-full absolute inset-0" rounded="rounded-2xl" />
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-white/5">
                <Link href={`/publications/${pub.slug}`} className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-foreground/30 hover:text-accent transition-colors">
                  <ImageIcon size={10} /> Abstract
                </Link>
                {pub.url && (
                  <a href={pub.url} target="_blank" className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-accent hover:text-foreground transition-colors">
                    <ArrowRight size={10} /> Read Full
                  </a>
                )}
              </div>
            </div>
          ))}
          {(!publications || publications.length === 0) && (
            <p className="text-gray-600 italic col-span-full">Belum ada publikasi.</p>
          )}
        </div>
      </section>
    </div>
  );
}
