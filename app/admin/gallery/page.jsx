import { createClient } from '@/utils/supabase/server';
import AdminSidebar from '@/components/AdminSidebar';
import GalleryList from '@/components/GalleryList';
import Link from 'next/link';
import { Plus, Image as ImageIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminGallery() {
  const supabase = await createClient();
  const { data: galleryItems } = await supabase
    .from('Gallery')
    .select('*')
    .order('createdAt', { ascending: false });

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <AdminSidebar />

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ImageIcon className="text-purple-500" /> Manajemen Galeri
            </h1>
            <p className="text-gray-500 mt-2 text-sm uppercase tracking-widest font-bold">
              Kumpulkan dan atur momen visual terbaik Anda.
            </p>
          </div>
          <Link
            href="/admin/gallery/add"
            className="px-6 py-4 bg-purple-500 text-white font-black rounded-2xl flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-purple-500/20 uppercase tracking-widest text-xs"
          >
            <Plus size={18} /> Tambah ke Galeri
          </Link>
        </header>

        <GalleryList galleryItems={galleryItems} />

        {(!galleryItems || galleryItems.length === 0) && (
          <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10 mt-10">
            <ImageIcon size={48} className="mx-auto text-gray-800 mb-4" />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
              Galeri masih kosong.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
