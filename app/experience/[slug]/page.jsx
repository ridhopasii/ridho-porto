import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import PhotoSwiper from '@/components/PhotoSwiper';
import Image from 'next/image';
import {
  Calendar,
  Building2,
  MapPin,
  ExternalLink,
  ArrowLeft,
  ShieldCheck,
  Link as LinkIcon,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ExperienceDetailPage({ params }) {
  const { slug } = params;
  const supabase = await createClient();

  const { data: exp } = await supabase.from('Experience').select('*').eq('slug', slug).single();

  if (!exp) notFound();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Header Section */}
      <div className="relative pt-32 pb-20 px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-teal-500/5 blur-[120px] rounded-full -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/#pengalaman"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-teal-500 transition-all mb-12 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
            to Portfolio
          </Link>

          <div className="flex flex-col md:flex-row gap-10 items-start md:items-center mb-10">
            {exp.logoUrl ? (
              <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-[2.5rem] p-5 border border-[var(--border-subtle)] flex-shrink-0">
                <Image src={exp.logoUrl} alt={exp.company} fill sizes="128px" className="object-contain p-5" />
              </div>
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 bg-teal-500/10 rounded-[2.5rem] flex items-center justify-center border border-teal-500/20 flex-shrink-0">
                <Building2 size={48} className="text-teal-500" />
              </div>
            )}
            <div>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 text-teal-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                  Professional Experience
                </span>
                <span className="px-4 py-1.5 bg-white/5 border border-[var(--border-subtle)] text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                  <Calendar size={12} /> {exp.period}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black font-outfit uppercase tracking-tighter leading-tight mb-2">
                {exp.position}
              </h1>
              <p className="text-2xl text-teal-500 font-bold uppercase tracking-tight">
                {exp.company}
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
                Overview & Role
              </h2>
              <div className="text-gray-400 text-lg leading-relaxed space-y-4 whitespace-pre-wrap font-medium">
                {exp.description}
              </div>
            </section>

            {/* Documentation Section */}
            {Array.isArray(exp.images) && exp.images.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em] mb-8">
                  Documentation & Evidence
                </h2>
                <div className="rounded-[3rem] overflow-hidden border border-[var(--border-subtle)] p-2 bg-white/5 shadow-2xl">
                  <PhotoSwiper
                    images={exp.images}
                    aspectRatio="aspect-video"
                    rounded="rounded-[2.5rem]"
                  />
                </div>
                <p className="mt-4 text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                  Swipe for more documentation/certificates
                </p>
              </section>
            )}
          </div>

          {/* Sidebar / Quick Details */}
          <div className="space-y-8">
            <div className="p-8 bg-white/5 border border-[var(--border-subtle)] rounded-[2.5rem] space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground/40">
                Quick Links
              </h3>
              <div className="space-y-4">
                {exp.proofUrl && (
                  <a
                    href={exp.proofUrl}
                    target="_blank"
                    className="flex items-center justify-between p-4 bg-teal-500 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all"
                  >
                    View Credentials <ShieldCheck size={16} />
                  </a>
                )}
                {exp.website && (
                  <a
                    href={exp.website}
                    target="_blank"
                    className="flex items-center justify-between p-4 bg-white/5 border border-[var(--border-subtle)] text-foreground rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    Visit Website <LinkIcon size={16} />
                  </a>
                )}
              </div>
            </div>

            <div className="p-8 border border-white/5 rounded-[2.5rem] bg-gradient-to-br from-teal-500/5 to-transparent">
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground/40 mb-4">
                Verification
              </h3>
              <p className="text-gray-500 text-xs leading-relaxed italic">
                All information and documentation provided has been verified. For further inquiries,
                contact me directly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Copy */}
      <footer className="py-12 border-t border-white/5 text-center text-[10px] font-bold uppercase tracking-widest text-gray-600">
        © {new Date().getFullYear()} Ridho Robbi Pasi • Global Relations Detail Page
      </footer>
    </main>
  );
}
