import { ExternalLink, CodeXml, ArrowUpRight } from 'lucide-react';
import PhotoSwiper from './PhotoSwiper';
import Link from 'next/link';

export default function Projects({ projects }) {
  return (
    <section id="proyek" className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <h2 className="text-sm font-bold text-teal-500 uppercase tracking-[0.3em] mb-3">
              Portfolio
            </h2>
            <h3 className="text-4xl md:text-6xl font-black font-outfit tracking-tight text-white uppercase">
              Featured <span className="text-teal-500">Work</span>
            </h3>
          </div>
          <Link
            href="/#kontak"
            className="text-gray-500 font-bold flex items-center gap-2 cursor-pointer hover:text-teal-500 transition-all uppercase text-xs tracking-widest"
          >
            Start a Project <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {Array.isArray(projects) &&
            projects.map((project, idx) => (
              <div key={project.id} className="group relative">
                {/* Project Card */}
                <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden border border-white/5 bg-[#111] transition-all duration-500 group-hover:border-teal-500/30">
                  {/* Carousel Integration */}
                  <PhotoSwiper
                    images={
                      Array.isArray(project.images) && project.images.length > 0
                        ? project.images
                        : [project.imageUrl || '']
                    }
                    aspectRatio="aspect-[16/10]"
                    rounded="rounded-[2rem]"
                  />

                  {/* Overlay Info (Hanya muncul saat hover) */}
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-center p-12">
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags?.split(',').map((tag) => (
                        <span
                          key={tag}
                          className="px-4 py-1 bg-teal-500/10 rounded-full text-[10px] font-bold text-teal-500 border border-teal-500/20 uppercase tracking-widest"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-white font-outfit">
                      {project.title || 'Project Title'}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3">
                      {project.description || ''}
                    </p>

                    <div className="flex gap-4">
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          className="px-6 py-3 bg-teal-500 text-black rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-teal-400 transition-all flex items-center gap-2"
                        >
                          View Project <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {projects?.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">
              Belum ada proyek yang dipublikasikan.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
