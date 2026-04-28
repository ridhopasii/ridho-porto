import AdminSidebar from '@/components/AdminSidebar';
import GalleryForm from '@/components/GalleryForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddGallery() {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-500 mb-8 transition-colors uppercase text-[10px] font-black tracking-widest"
          >
            <ArrowLeft size={16} /> Kembali ke Galeri
          </Link>
          <h1 className="text-3xl font-black mb-10 font-outfit uppercase tracking-tight">
            Tambah <span className="text-purple-500">Momen Baru</span>
          </h1>

          <div className="bg-white/5 border border-[var(--border-subtle)] rounded-[3rem] p-10">
            <GalleryForm />
          </div>
        </div>
      </main>
    </div>
  );
}
