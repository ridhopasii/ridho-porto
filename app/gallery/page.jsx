import { createClient } from '@/utils/supabase/client';
import { createClient as createServerClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import { ImageIcon, ArrowLeft, Maximize2 } from 'lucide-react';
import Link from 'next/link';

export default async function GalleryPage() {
  const supabase = await createServerClient();
  const { data: gallery } = await supabase
    .from('Gallery')
    .select('*')
    .not('showOnHome', 'eq', false)
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

      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {gallery?.map((item) => (
            <div
              key={item.id}
              className="relative group rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 break-inside-avoid shadow-2xl"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-auto grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 p-8 flex flex-col justify-end">
                <h3 className="text-xl font-black font-outfit uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-xs mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  {item.description || 'Visual Documentation'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
