import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import PhotoSwiper from '@/components/PhotoSwiper';
import { FileText, ArrowLeft, Calendar, ExternalLink, BookOpen, Quote, Share2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PublicationDetailPage({ params }) {
  const { slug } = params;
  const supabase = await createClient();

  const { data: pub } = await supabase.from('Publication').select('*').eq('slug', slug).single();

  if (!pub) notFound();

  return (
    <main className="min-h-screen bg-[#030303] text-white">
      <Navbar />

      <div className="relative pt-32 pb-20 px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/#pencapaian"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-all mb-12 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
            to Portfolio
          </Link>

          <div className="flex flex-col md:flex-row gap-10 items-start md:items-center mb-10">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-500/10 rounded-[2.5rem] flex items-center justify-center border border-blue-500/20 flex-shrink-0 shadow-2xl shadow-blue-500/10 text-blue-500">
              <FileText size={48} />
            </div>
            <div>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                  Published Work
                </span>
                <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                  <Calendar size={12} /> {pub.date}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black font-outfit uppercase tracking-tighter leading-tight mb-2">
                {pub.title}
              </h1>
              <p className="text-2xl text-blue-500 font-bold uppercase tracking-tight">
                {pub.outlet}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <section className="relative">
              <Quote size={48} className="absolute -top-6 -left-6 text-white/5" />
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em] mb-6">
                Publication Abstract
              </h2>
              <div className="text-gray-400 text-lg leading-relaxed space-y-4 whitespace-pre-wrap font-medium">
                {pub.description ||
                  'This publication contributes to the ongoing discourse in its field, presenting key findings and perspectives.'}
              </div>
            </section>

            {Array.isArray(pub.images) && pub.images.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em] mb-8">
                  Related Figures & Media
                </h2>
                <div className="rounded-[3rem] overflow-hidden border border-white/10 p-2 bg-white/5 shadow-2xl">
                  <PhotoSwiper
                    images={pub.images}
                    aspectRatio="aspect-video"
                    rounded="rounded-[2.5rem]"
                  />
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40">
                Access & Info
              </h3>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {pub.tags?.split(',').map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>

                <div className="pt-4 space-y-4">
                  {pub.url && (
                    <a
                      href={pub.url}
                      target="_blank"
                      className="flex items-center justify-between p-4 bg-blue-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
                    >
                      Read Full Text <BookOpen size={16} />
                    </a>
                  )}
                  <button className="w-full flex items-center justify-between p-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                    Share Link <Share2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-12 border-t border-white/5 text-center text-[10px] font-bold uppercase tracking-widest text-gray-600">
        © {new Date().getFullYear()} Ridho Robbi Pasi • Academic Publications
      </footer>
    </main>
  );
}
