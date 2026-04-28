import { createClient } from '@/utils/supabase/server';
import AdminSidebar from '@/components/AdminSidebar';
import GalleryForm from '@/components/GalleryForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function EditGalleryPage({ params }) {
  const { id } = params;
  const supabase = await createClient();

  const { data: item } = await supabase.from('Gallery').select('*').eq('id', id).single();

  if (!item) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex font-jakarta">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl">
          <header className="mb-10 flex items-center gap-4">
            <Link
              href="/admin/gallery"
              className="p-2 hover:bg-white/5 rounded-full transition-all text-gray-400"
            >
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Edit Item Galeri</h1>
              <p className="text-gray-500 text-sm">
                Perbarui informasi momen atau kegiatan dalam galeri Anda.
              </p>
            </div>
          </header>

          <div className="bg-white/5 border border-[var(--border-subtle)] rounded-3xl p-8">
            <GalleryForm initialData={item} />
          </div>
        </div>
      </main>
    </div>
  );
}
