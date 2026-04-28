import PhotoSwiper from './PhotoSwiper';
import { Image as ImageIcon, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function Gallery({ galleryItems }) {
  // Ambil semua foto dari semua item galeri dan ratakan menjadi satu array
  // Atau tampilkan album per album. User minta "6 terbaru aja" di home.
  const latestPhotos = galleryItems?.slice(0, 6) || [];

  return (
    <section id="galeri" className="py-24 px-6 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <h2 className="text-teal-500 font-bold uppercase tracking-[0.3em] mb-3 text-sm">
              Momen & Kegiatan
            </h2>
            <h3 className="text-4xl md:text-6xl font-black font-outfit text-foreground uppercase leading-none">
              Visual <span className="text-teal-500">Gallery</span>
            </h3>
          </div>
          <Link
            href="/gallery"
            className="group flex items-center gap-2 text-gray-500 font-bold uppercase text-xs tracking-widest hover:text-teal-500 transition-all"
          >
            Lihat Semua Koleksi{' '}
            <ArrowUpRight
              size={18}
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPhotos.map((item, idx) => (
            <div
              key={item.id}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="relative rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#111] hover:border-teal-500/30 transition-all duration-500 shadow-2xl">
                <PhotoSwiper images={item.images} aspectRatio="aspect-[4/3]" />

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-3 py-1 bg-teal-500/10 text-teal-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-teal-500/20">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-gray-600 font-bold">{item.date}</span>
                  </div>
                  <h4 className="text-lg font-bold text-foreground group-hover:text-teal-500 transition-colors">
                    {item.title}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>

        {latestPhotos.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-[var(--border-subtle)]">
            <ImageIcon size={48} className="mx-auto text-gray-800 mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
              Galeri belum terisi.
            </p>
          </div>
        )}
      </div>

      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
    </section>
  );
}
