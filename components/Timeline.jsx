import { Briefcase, GraduationCap, Calendar, ExternalLink, ImageIcon } from 'lucide-react';
import PhotoSwiper from './PhotoSwiper';

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

            <div className="space-y-12 relative before:absolute before:left-8 before:top-0 before:bottom-0 before:w-px before:bg-white/10">
              {experiences?.map((exp) => (
                <div key={exp.id} className="relative pl-20 group">
                  <div className="absolute left-6 top-1 w-4 h-4 bg-teal-500 rounded-full border-4 border-[#0a0a0a] z-10 group-hover:scale-125 transition-transform"></div>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl group-hover:border-teal-500/30 transition-all">
                    <p className="text-teal-500 text-sm font-bold flex items-center gap-2 mb-2">
                      <Calendar size={14} /> {exp.period || '2020 - Present'}
                    </p>
                    <h3 className="text-xl font-bold mb-1">{exp.position}</h3>
                    <p className="text-teal-500 font-medium mb-4 uppercase text-xs tracking-widest">
                      {exp.company}
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">{exp.description}</p>

                    {/* Documentation Photos */}
                    {exp.images?.length > 0 && (
                      <div className="mb-6">
                        <PhotoSwiper
                          images={exp.images}
                          aspectRatio="aspect-video"
                          rounded="rounded-2xl"
                        />
                      </div>
                    )}

                    {/* Proof Link */}
                    {exp.proofUrl && (
                      <a
                        href={exp.proofUrl}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-teal-500 hover:text-white transition-colors"
                      >
                        <ExternalLink size={12} /> View Documentation
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {experiences?.length === 0 && (
                <p className="text-gray-600 italic pl-10">Belum ada data pengalaman.</p>
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

            <div className="space-y-12 relative before:absolute before:left-8 before:top-0 before:bottom-0 before:w-px before:bg-white/10">
              {educations?.map((edu) => (
                <div key={edu.id} className="relative pl-20 group">
                  <div className="absolute left-6 top-1 w-4 h-4 bg-purple-500 rounded-full border-4 border-[#0a0a0a] z-10 group-hover:scale-125 transition-transform"></div>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-3xl group-hover:border-purple-500/30 transition-all">
                    <p className="text-purple-500 text-sm font-bold flex items-center gap-2 mb-2">
                      <Calendar size={14} /> {edu.year || '2015 - 2019'}
                    </p>
                    <h3 className="text-xl font-bold mb-1">{edu.degree}</h3>
                    <p className="text-purple-500 font-medium mb-2 uppercase text-xs tracking-widest">
                      {edu.institution} {edu.major ? `• ${edu.major}` : ''}
                    </p>
                    <p className="text-gray-400 text-sm mb-6">{edu.description}</p>

                    {/* Documentation Photos */}
                    {edu.images?.length > 0 && (
                      <div className="mb-6">
                        <PhotoSwiper
                          images={edu.images}
                          aspectRatio="aspect-video"
                          rounded="rounded-2xl"
                        />
                      </div>
                    )}

                    {/* Proof Link */}
                    {edu.proofUrl && (
                      <a
                        href={edu.proofUrl}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-500 hover:text-white transition-colors"
                      >
                        <ExternalLink size={12} /> View Credentials
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {educations?.length === 0 && (
                <p className="text-gray-600 italic pl-10">Belum ada data pendidikan.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
