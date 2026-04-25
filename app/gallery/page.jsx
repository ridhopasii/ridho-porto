import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import PhotoSwiper from '@/components/PhotoSwiper';
import { Image as ImageIcon, Tag, Calendar, LayoutGrid } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getGalleryData() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('Gallery')
    .select('*')
    .order('createdAt', { ascending: false });
  return data || [];
}

export default async function GalleryPage() {
  const galleryItems = await getGalleryData();
  const categories = ['kegiatan', 'prestasi', 'organisasi', 'lainnya'];

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <header className="mb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
            <LayoutGrid size={14} className="text-purple-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-500">
              Visual Journey
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-outfit uppercase tracking-tighter leading-none mb-6">
            Galeri <span className="text-purple-500">Foto</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Kumpulan momen, kegiatan, dan dokumentasi perjalanan profesional serta organisasi saya.
          </p>
        </header>

        {categories.map((cat) => {
          const items = galleryItems.filter((i) => i.category === cat);
          if (items.length === 0) return null;

          return (
            <div key={cat} className="mb-24">
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-2xl font-black uppercase tracking-widest font-outfit text-white/90">
                  {cat}
                </h2>
                <div className="flex-1 h-px bg-white/5"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-purple-500/30 transition-all"
                  >
                    <PhotoSwiper images={item.images} aspectRatio="aspect-video" />
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                          <Calendar size={12} /> {item.date}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-purple-500 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {galleryItems.length === 0 && (
          <div className="text-center py-40 bg-white/5 rounded-[4rem] border border-dashed border-white/10">
            <ImageIcon size={64} className="mx-auto text-gray-800 mb-6" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
              Galeri masih kosong.
            </p>
          </div>
        )}
      </div>

      {/* Footer Copy */}
      <footer className="py-12 border-t border-white/5 text-center text-[10px] font-bold uppercase tracking-widest text-gray-600">
        © {new Date().getFullYear()} Ridho Robbi Pasi • Global Relations Portfolio
      </footer>
    </main>
  );
}
