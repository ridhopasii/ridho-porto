import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import PhotoSwiper from '@/components/PhotoSwiper';
import {
  Calendar,
  GraduationCap,
  MapPin,
  ExternalLink,
  ArrowLeft,
  Award,
  Link as LinkIcon,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EducationDetailPage({ params }) {
  const { slug } = params;
  const supabase = await createClient();

  const { data: edu } = await supabase.from('Education').select('*').eq('slug', slug).single();

  if (!edu) notFound();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      {/* Header Section */}
      <div className="relative pt-32 pb-20 px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-purple-500/5 blur-[120px] rounded-full -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/#pendidikan"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-500 transition-all mb-12 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
            to Portfolio
          </Link>

          <div className="flex flex-col md:flex-row gap-10 items-start md:items-center mb-10">
            {edu.logoUrl ? (
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-[2.5rem] p-5 border border-white/10 flex-shrink-0">
                <img
                  src={edu.logoUrl}
                  alt={edu.institution}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 bg-purple-500/10 rounded-[2.5rem] flex items-center justify-center border border-purple-500/20 flex-shrink-0">
                <GraduationCap size={48} className="text-purple-500" />
              </div>
            )}
            <div>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                  Education History
                </span>
                <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                  <Calendar size={12} /> {edu.period || edu.year}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black font-outfit uppercase tracking-tighter leading-tight mb-2">
                {edu.degree}
              </h1>
              <p className="text-2xl text-purple-500 font-bold uppercase tracking-tight">
                {edu.institution} {edu.major ? `• ${edu.major}` : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em] mb-6">
                Course & Achievements
              </h2>
              <div className="text-gray-400 text-lg leading-relaxed space-y-4 whitespace-pre-wrap font-medium">
                {edu.description || 'No description provided for this educational background.'}
              </div>
            </section>

            {/* Documentation Section */}
            {Array.isArray(edu.images) && edu.images.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em] mb-8">
                  Diplomas & Certificates
                </h2>
                <div className="rounded-[3rem] overflow-hidden border border-white/10 p-2 bg-white/5 shadow-2xl">
                  <PhotoSwiper
                    images={edu.images}
                    aspectRatio="aspect-video"
                    rounded="rounded-[2.5rem]"
                  />
                </div>
                <p className="mt-4 text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                  Official documentation & certificates
                </p>
              </section>
            )}
          </div>

          {/* Sidebar / Quick Details */}
          <div className="space-y-8">
            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40">
                Status & Proof
              </h3>
              <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl">
                <p className="text-[10px] font-bold text-purple-500 uppercase mb-1">Status</p>
                <p className="font-bold text-white uppercase tracking-tight">
                  {edu.status || 'Graduated'}
                </p>
              </div>
              <div className="space-y-4 pt-2">
                {edu.proofUrl && (
                  <a
                    href={edu.proofUrl}
                    target="_blank"
                    className="flex items-center justify-between p-4 bg-purple-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-purple-500/20"
                  >
                    Verify Diploma <Award size={16} />
                  </a>
                )}
                {edu.website && (
                  <a
                    href={edu.website}
                    target="_blank"
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Visit Campus <LinkIcon size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Copy */}
      <footer className="py-12 border-t border-white/5 text-center text-[10px] font-bold uppercase tracking-widest text-gray-600">
        © {new Date().getFullYear()} Ridho Robbi Pasi • Academic Background
      </footer>
    </main>
  );
}
