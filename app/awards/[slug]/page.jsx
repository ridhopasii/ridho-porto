import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import PhotoSwiper from '@/components/PhotoSwiper';
import {
  Trophy,
  ArrowLeft,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Award as AwardIcon,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AwardDetailPage({ params }) {
  const { slug } = params;
  const supabase = await createClient();

  const { data: award } = await supabase.from('Award').select('*').eq('slug', slug).single();

  if (!award) notFound();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="relative pt-32 pb-20 px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-yellow-500/5 blur-[120px] rounded-full -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/#pencapaian"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-yellow-500 transition-all mb-12 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
            to Achievements
          </Link>

          <div className="flex flex-col md:flex-row gap-10 items-start md:items-center mb-10">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-yellow-500/10 rounded-[2.5rem] flex items-center justify-center border border-yellow-500/20 flex-shrink-0 shadow-2xl shadow-yellow-500/10">
              <Trophy size={48} className="text-yellow-500" />
            </div>
            <div>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                  Achievement & Honor
                </span>
                <span className="px-4 py-1.5 bg-white/5 border border-[var(--border-subtle)] text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                  <Calendar size={12} /> {award.date}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black font-outfit uppercase tracking-tighter leading-tight mb-2">
                {award.title}
              </h1>
              <p className="text-2xl text-yellow-500 font-bold uppercase tracking-tight">
                {award.organizer}
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
                About the Award
              </h2>
              <div className="text-gray-400 text-lg leading-relaxed space-y-4 whitespace-pre-wrap font-medium">
                {award.description ||
                  'This award was granted in recognition of outstanding performance and contribution to the community/organization.'}
              </div>
            </section>

            {Array.isArray(award.images) && award.images.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em] mb-8">
                  Official Documentation
                </h2>
                <div className="rounded-[3rem] overflow-hidden border border-[var(--border-subtle)] p-2 bg-white/5 shadow-2xl">
                  <PhotoSwiper
                    images={award.images}
                    aspectRatio="aspect-video"
                    rounded="rounded-[2.5rem]"
                  />
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
            <div className="p-8 bg-white/5 border border-[var(--border-subtle)] rounded-[2.5rem] space-y-6 text-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground/40">
                Credential Verification
              </h3>
              <div className="p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex flex-col items-center">
                <AwardIcon size={32} className="text-yellow-500 mb-4" />
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Credential ID</p>
                <p className="font-mono text-foreground text-xs">
                  {award.credentialId || 'Verified Record'}
                </p>
              </div>

              {award.proofUrl && (
                <a
                  href={award.proofUrl}
                  target="_blank"
                  className="flex items-center justify-center gap-3 p-4 bg-yellow-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-yellow-500/20"
                >
                  View Official Link <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="py-12 border-t border-white/5 text-center text-[10px] font-bold uppercase tracking-widest text-gray-600">
        © {new Date().getFullYear()} Ridho Robbi Pasi • Honors & Achievements
      </footer>
    </main>
  );
}
