import { Briefcase, GraduationCap, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function Timeline({ experiences, educations }) {
  return (
    <section className="py-24 px-6 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Experience Section */}
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-accent/10 text-accent rounded-2xl">
              <Briefcase size={28} />
            </div>
            <h2 className="text-3xl md:text-5xl font-black font-outfit uppercase tracking-tight">
              Experience
            </h2>
          </div>

          <div className="grid grid-rows-2 grid-flow-col gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 px-4 -mx-4 md:px-0 md:mx-0">
            {Array.isArray(experiences) && experiences.length > 0 ? (
              experiences.map((exp, idx) => {
                const isBig = idx === 0 || idx % 3 === 0;
                return (
                  <div 
                    key={exp.id} 
                    className={`relative p-6 md:p-8 rounded-[2rem] snap-center flex flex-col group transition-all duration-500 ${
                      isBig 
                        ? 'row-span-2 w-[85vw] md:w-[45vw] lg:w-[35vw] bg-accent/5 border border-accent/20 hover:border-accent/50 hover:bg-accent/10 min-h-[300px] md:min-h-[400px]' 
                        : 'row-span-1 w-[75vw] md:w-[35vw] lg:w-[25vw] bg-white/5 border border-[var(--border-subtle)] hover:border-white/30 min-h-[140px] md:min-h-[190px]'
                    }`}
                  >
                    <div className="mt-auto flex flex-col h-full justify-between">
                      <div>
                        {isBig && idx === 0 && (
                          <span className="inline-block px-3 py-1.5 rounded-full bg-accent text-black font-bold text-[10px] uppercase tracking-widest mb-4">
                            Latest Position
                          </span>
                        )}
                        <p className={`font-bold uppercase tracking-widest mb-2 ${isBig ? 'text-accent text-xs' : 'text-muted-foreground text-[10px]'}`}>
                          {exp.period || 'Period N/A'}
                        </p>
                        <Link href={`/experience/${exp.slug}`} className="inline-block">
                          <h3 className={`font-black tracking-tight mb-1 flex items-center gap-2 group-hover:text-accent transition-colors ${isBig ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                            {exp.position || 'Position'} <ArrowUpRight size={isBig ? 18 : 14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h3>
                        </Link>
                        <p className={`uppercase tracking-widest mb-4 ${isBig ? 'text-accent font-bold text-xs' : 'text-muted-foreground font-semibold text-[10px]'}`}>
                          {exp.company || 'Company'}
                        </p>
                      </div>
                      <p className={`text-muted-foreground leading-relaxed line-clamp-3 ${isBig ? 'text-sm md:text-base' : 'text-xs'}`}>
                        {exp.description || ''}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground italic px-4">Belum ada data pengalaman.</p>
            )}
          </div>
        </div>

        {/* Education Section */}
        <div className="animate-fade-in-up animation-delay-500">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
              <GraduationCap size={28} />
            </div>
            <h2 className="text-3xl md:text-5xl font-black font-outfit uppercase tracking-tight">
              Education
            </h2>
          </div>

          <div className="grid grid-rows-2 grid-flow-col gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 px-4 -mx-4 md:px-0 md:mx-0">
            {Array.isArray(educations) && educations.length > 0 ? (
              educations.map((edu, idx) => {
                const isBig = idx === 0 || idx % 3 === 0;
                return (
                  <div 
                    key={edu.id} 
                    className={`relative p-6 md:p-8 rounded-[2rem] snap-center flex flex-col group transition-all duration-500 ${
                      isBig 
                        ? 'row-span-2 w-[85vw] md:w-[45vw] lg:w-[35vw] bg-purple-500/5 border border-purple-500/20 hover:border-purple-500/50 hover:bg-purple-500/10 min-h-[300px] md:min-h-[400px]' 
                        : 'row-span-1 w-[75vw] md:w-[35vw] lg:w-[25vw] bg-white/5 border border-[var(--border-subtle)] hover:border-white/30 min-h-[140px] md:min-h-[190px]'
                    }`}
                  >
                    <div className="mt-auto flex flex-col h-full justify-between">
                      <div>
                        {isBig && idx === 0 && (
                          <span className="inline-block px-3 py-1.5 rounded-full bg-purple-500 text-black font-bold text-[10px] uppercase tracking-widest mb-4">
                            Recent Education
                          </span>
                        )}
                        <p className={`font-bold uppercase tracking-widest mb-2 ${isBig ? 'text-purple-500 text-xs' : 'text-muted-foreground text-[10px]'}`}>
                          {edu.period || edu.year || 'Period N/A'}
                        </p>
                        <Link href={`/education/${edu.slug}`} className="inline-block">
                          <h3 className={`font-black tracking-tight mb-1 flex items-center gap-2 group-hover:text-purple-500 transition-colors ${isBig ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                            {edu.degree || 'Degree'} <ArrowUpRight size={isBig ? 18 : 14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h3>
                        </Link>
                        <p className={`uppercase tracking-widest mb-4 ${isBig ? 'text-purple-400 font-bold text-xs' : 'text-muted-foreground font-semibold text-[10px]'}`}>
                          {edu.institution || 'Institution'} {edu.major ? `• ${edu.major}` : ''}
                        </p>
                      </div>
                      <p className={`text-muted-foreground leading-relaxed line-clamp-3 ${isBig ? 'text-sm md:text-base' : 'text-xs'}`}>
                        {edu.description || ''}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-muted-foreground italic px-4">Belum ada data pendidikan.</p>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
