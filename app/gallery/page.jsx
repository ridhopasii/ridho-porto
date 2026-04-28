import { createClient } from '@/utils/supabase/client';
import { createClient as createServerClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import { ImageIcon, ArrowLeft, Maximize2 } from 'lucide-react';
import Link from 'next/link';
import GalleryFilter from '@/components/GalleryFilter';

export default async function GalleryPage() {
  const supabase = await createServerClient();
  const { data: gallery } = await supabase
    .from('Gallery')
    .select('*')
    .order('createdAt', { ascending: false });

  return (
    <div className="min-h-screen bg-[#050505] text-white font-jakarta selection:bg-rose-500/30">
      <Navbar />

      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-full h-[500px] bg-rose-500/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-widest mb-8 hover:gap-4 transition-all"
          >
            <ArrowLeft size={16} /> Beranda
          </Link>

          <h1 className="text-5xl md:text-8xl font-black font-outfit tracking-tighter uppercase mb-6 leading-none">
            Visual{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-600">
              Archive.
            </span>
          </h1>
          <p className="text-gray-500 max-w-2xl text-lg md:text-xl font-medium leading-relaxed">
            Kumpulan dokumentasi, desain, dan momen visual dari berbagai kegiatan dan proyek.
          </p>
        </div>
      </section>

      <GalleryFilter items={gallery || []} />
    </div>
  );
}
