import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-body text-foreground flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-6 py-32">
        <div className="text-center max-w-2xl mx-auto">
          {/* Giant 404 */}
          <div className="relative mb-12">
            <p className="text-[200px] md:text-[300px] font-black font-outfit leading-none text-foreground/5 select-none">
              404
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 rounded-[2rem] bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto">
                  <Search size={32} className="text-accent" />
                </div>
                <p className="text-accent text-sm font-black uppercase tracking-[0.4em]">
                  Halaman Tidak Ditemukan
                </p>
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black font-outfit uppercase tracking-tighter mb-6">
            Ups! Halaman ini <span className="text-accent">Hilang</span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-12 font-medium max-w-lg mx-auto">
            Halaman yang Anda cari tidak ada, mungkin sudah dipindahkan, atau URL yang Anda ketik
            salah.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-10 py-5 bg-accent text-black font-black rounded-2xl hover:bg-accent transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm uppercase tracking-widest shadow-xl shadow-accent/20"
            >
              <Home size={18} /> Kembali ke Beranda
            </Link>
            <Link
              href="/#proyek"
              className="px-10 py-5 bg-white/5 text-foreground font-bold rounded-2xl border border-[var(--border-subtle)] hover:bg-white/10 transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
            >
              <ArrowLeft size={18} /> Lihat Portofolio
            </Link>
          </div>

          {/* Decorative Grid */}
          <div className="mt-20 grid grid-cols-4 gap-4 opacity-10">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-1 bg-accent rounded-full"
                style={{ opacity: Math.random() }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]"></div>
      </div>
    </main>
  );
}
