import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import { Briefcase, GraduationCap, ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function ExperiencePage() {
  const supabase = await createClient();

  const { data: experiences } = await supabase
    .from('Experience')
    .select('*')
    .not('showOnHome', 'eq', false)
    .order('period', { ascending: false });

  const { data: educations } = await supabase
    .from('Education')
    .select('*')
    .not('showOnHome', 'eq', false)
    .order('period', { ascending: false });

  return (
    <div className="min-h-screen bg-background text-foreground font-jakarta selection:bg-accent/30">
      <Navbar />

      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-[500px] bg-accent/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-8 hover:gap-4 transition-all"
          >
            <ArrowLeft size={16} /> Beranda
          </Link>

          <h1 className="text-5xl md:text-8xl font-black font-outfit tracking-tighter uppercase mb-6 leading-none">
            Journey{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-indigo-600">
              & Growth.
            </span>
          </h1>
          <p className="text-gray-500 max-w-2xl text-lg md:text-xl font-medium leading-relaxed">
            Rekam jejak profesional dan akademis saya dalam membangun keahlian di industri
            teknologi.
          </p>
        </div>
      </section>

      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Experience Column */}
          <div>
            <h2 className="text-2xl font-black font-outfit uppercase mb-12 flex items-center gap-4">
              <span className="p-3 bg-accent/20 text-accent rounded-2xl">
                <Briefcase size={24} />
              </span>
              Work Experience
            </h2>

            <div className="space-y-12 relative before:absolute before:left-[27px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
              {experiences?.map((exp) => (
                <div key={exp.id} className="relative pl-20 group">
                  <div className="absolute left-0 top-0 w-14 h-14 bg-background border border-[var(--border-subtle)] rounded-2xl flex items-center justify-center z-10 group-hover:border-accent/50 transition-all">
                    <div className="w-2 h-2 bg-accent rounded-full group-hover:scale-150 transition-all" />
                  </div>

                  <div className="p-8 bg-white/5 border border-[var(--border-subtle)] rounded-3xl group-hover:bg-white/[0.08] transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <span className="px-4 py-1.5 bg-accent/10 text-accent border border-accent/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {exp.period}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1 font-bold italic">
                        <Calendar size={12} /> {exp.location || 'Remote'}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-foreground uppercase mb-1">{exp.role}</h3>
                    <p className="text-accent font-bold text-sm mb-4">{exp.company}</p>
                    <p className="text-gray-400 text-sm leading-relaxed font-medium">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education Column */}
          <div>
            <h2 className="text-2xl font-black font-outfit uppercase mb-12 flex items-center gap-4">
              <span className="p-3 bg-indigo-500/20 text-indigo-500 rounded-2xl">
                <GraduationCap size={24} />
              </span>
              Education
            </h2>

            <div className="space-y-12 relative before:absolute before:left-[27px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/5">
              {educations?.map((edu) => (
                <div key={edu.id} className="relative pl-20 group">
                  <div className="absolute left-0 top-0 w-14 h-14 bg-background border border-[var(--border-subtle)] rounded-2xl flex items-center justify-center z-10 group-hover:border-indigo-500/50 transition-all">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full group-hover:scale-150 transition-all" />
                  </div>

                  <div className="p-8 bg-white/5 border border-[var(--border-subtle)] rounded-3xl group-hover:bg-white/[0.08] transition-all">
                    <div className="mb-4">
                      <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                        {edu.period}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-foreground uppercase mb-1">{edu.degree}</h3>
                    <p className="text-indigo-500 font-bold text-sm mb-4">{edu.school}</p>
                    <p className="text-gray-400 text-sm leading-relaxed font-medium">
                      {edu.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
