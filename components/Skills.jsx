import Link from 'next/link';
import { Cpu, Globe, Database, Layout, Smartphone, Server } from 'lucide-react';

export default function Skills({ skills }) {
  return (
    <section id="keterampilan" className="py-24 px-6 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black font-outfit mb-4 uppercase tracking-tighter">
            TECH <span className="text-teal-500">STACK</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto uppercase text-[10px] font-bold tracking-widest">
            The technologies and tools I use to bring innovative ideas to life.
          </p>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-8 px-4 -mx-4 md:px-0 md:mx-0">
          {Array.isArray(skills) &&
            skills.map((skill, idx) => (
              <Link
                key={skill.id}
                href={`/skills/${skill.slug}`}
                className="group p-6 bg-white/5 border border-[var(--border-subtle)] rounded-3xl hover:border-teal-500/50 hover:bg-teal-500/5 transition-all text-center flex-shrink-0 w-[40vw] sm:w-[25vw] md:w-[18vw] lg:w-[14vw] snap-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 text-muted-foreground group-hover:text-teal-500 group-hover:scale-110 transition-all">
                  <Cpu size={48} strokeWidth={1} />
                </div>
                <h3 className="font-bold text-sm tracking-widest uppercase text-foreground group-hover:text-teal-500 transition-colors">
                  {skill.name}
                </h3>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase group-hover:text-teal-500/50 transition-colors font-black tracking-widest">
                  {skill.level || 'Expert'}
                </p>
              </Link>
            ))}
        </div>

        {skills?.length === 0 && (
          <p className="text-center text-muted-foreground italic">
            Isi data Skill di panel admin untuk menampilkan di sini.
          </p>
        )}
      </div>

      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-[120px] z-0"></div>
    </section>
  );
}
