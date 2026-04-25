import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import PhotoSwiper from '@/components/PhotoSwiper';
import {
  Users,
  ArrowLeft,
  Calendar,
  Globe,
  MapPin,
  Briefcase,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function OrganizationDetailPage({ params }) {
  const { slug } = params;
  const supabase = await createClient();

  const { data: org } = await supabase.from('Organization').select('*').eq('slug', slug).single();

  if (!org) notFound();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <div className="relative pt-32 pb-20 px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-teal-500/5 blur-[120px] rounded-full -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/#organisasi"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-teal-500 transition-all mb-12 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
            to Leadership
          </Link>

          <div className="flex flex-col md:flex-row gap-10 items-start md:items-center mb-10">
            {org.logoUrl ? (
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-[2.5rem] p-5 border border-white/10 flex-shrink-0">
                <img src={org.logoUrl} alt={org.name} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 bg-teal-500/10 rounded-[2.5rem] flex items-center justify-center border border-teal-500/20 flex-shrink-0">
                <Users size={48} className="text-teal-500" />
              </div>
            )}
            <div>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 text-teal-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                  Leadership Involvement
                </span>
                <span className="px-4 py-1.5 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                  <Calendar size={12} /> {org.period}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black font-outfit uppercase tracking-tighter leading-tight mb-2">
                {org.role}
              </h1>
              <p className="text-2xl text-teal-500 font-bold uppercase tracking-tight">
                {org.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em] mb-6">
                Responsibilities & Impact
              </h2>
              <div className="text-gray-400 text-lg leading-relaxed space-y-4 whitespace-pre-wrap font-medium">
                {org.description ||
                  'Contributed to various organizational activities, fostering teamwork and achieving shared goals.'}
              </div>
            </section>

            {Array.isArray(org.images) && org.images.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em] mb-8">
                  Activity Documentation
                </h2>
                <div className="rounded-[3rem] overflow-hidden border border-white/10 p-2 bg-white/5 shadow-2xl">
                  <PhotoSwiper
                    images={org.images}
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
                Engagement Details
              </h3>
              <div className="space-y-4">
                {org.website && (
                  <a
                    href={org.website}
                    target="_blank"
                    className="flex items-center justify-between p-4 bg-teal-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-teal-500/20"
                  >
                    Visit Site <Globe size={16} />
                  </a>
                )}
                {org.proofUrl && (
                  <a
                    href={org.proofUrl}
                    target="_blank"
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Proof Link <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-12 border-t border-white/5 text-center text-[10px] font-bold uppercase tracking-widest text-gray-600">
        © {new Date().getFullYear()} Ridho Robbi Pasi • Organizational Leadership
      </footer>
    </main>
  );
}
