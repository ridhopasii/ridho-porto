import { Briefcase, GraduationCap, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function Timeline({ experiences, educations }) {
  return (
    <section className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Experience Column */}
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-4 mb-12">
              <div className="p-3 bg-teal-500/10 text-teal-500 rounded-2xl">
                <Briefcase size={28} />
              </div>
              <h2 className="text-3xl font-black font-outfit uppercase tracking-tight">
                Experience
              </h2>
            </div>

            <div className="space-y-12 relative before:absolute before:left-[7px] before:top-2 before:bottom-0 before:w-px before:bg-white/10">
              {Array.isArray(experiences) &&
                experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-10 group">
                    <div className="absolute left-0 top-1.5 w-4 h-4 bg-[#0a0a0a] rounded-full border border-teal-500/50 z-10 group-hover:bg-teal-500 transition-colors"></div>
                    <div className="pt-0.5">
                      <p className="text-gray-500 text-[10px] font-black tracking-widest uppercase mb-1">
                        {exp.period || 'Period N/A'}
                      </p>
                      <Link href={`/experience/${exp.slug}`} className="inline-block group-hover:text-teal-500 transition-colors">
                        <h3 className="text-xl font-bold mb-1 tracking-tight flex items-center gap-2">
                          {exp.position || 'Position'} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                      </Link>
                      <p className="text-teal-500 font-bold uppercase text-[10px] tracking-widest mb-3">
                        {exp.company || 'Company'}
                      </p>
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                        {exp.description || ''}
                      </p>
                    </div>
                  </div>
                ))}

              {(!Array.isArray(experiences) || experiences.length === 0) && (
                <p className="text-gray-600 italic pl-10 text-sm">Belum ada data pengalaman.</p>
              )}
            </div>
          </div>

          {/* Education Column */}
          <div className="animate-fade-in-up animation-delay-2000">
            <div className="flex items-center gap-4 mb-12">
              <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
                <GraduationCap size={28} />
              </div>
              <h2 className="text-3xl font-black font-outfit uppercase tracking-tight">
                Education
              </h2>
            </div>

            <div className="space-y-12 relative before:absolute before:left-[7px] before:top-2 before:bottom-0 before:w-px before:bg-white/10">
              {Array.isArray(educations) &&
                educations.map((edu) => (
                  <div key={edu.id} className="relative pl-10 group">
                    <div className="absolute left-0 top-1.5 w-4 h-4 bg-[#0a0a0a] rounded-full border border-purple-500/50 z-10 group-hover:bg-purple-500 transition-colors"></div>
                    <div className="pt-0.5">
                      <p className="text-gray-500 text-[10px] font-black tracking-widest uppercase mb-1">
                        {edu.period || edu.year || 'Period N/A'}
                      </p>
                      <Link href={`/education/${edu.slug}`} className="inline-block group-hover:text-purple-500 transition-colors">
                        <h3 className="text-xl font-bold mb-1 tracking-tight flex items-center gap-2">
                          {edu.degree || 'Degree'} <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                      </Link>
                      <p className="text-purple-500 font-bold uppercase text-[10px] tracking-widest mb-3">
                        {edu.institution || 'Institution'} {edu.major ? `• ${edu.major}` : ''}
                      </p>
                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                        {edu.description || ''}
                      </p>
                    </div>
                  </div>
                ))}

              {(!Array.isArray(educations) || educations.length === 0) && (
                <p className="text-gray-600 italic pl-10 text-sm">Belum ada data pendidikan.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
