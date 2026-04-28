import { ExternalLink, CodeXml, ArrowUpRight } from 'lucide-react';
import PhotoSwiper from './PhotoSwiper';
import Link from 'next/link';

export default function Projects({ projects }) {
  return (
    <section id="proyek" className="py-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
          <div>
            <h2 className="text-sm font-bold text-teal-500 uppercase tracking-[0.3em] mb-3">
              Portfolio
            </h2>
            <h3 className="text-4xl md:text-6xl font-black font-outfit tracking-tight text-foreground uppercase">
              Featured <span className="text-teal-500">Work</span>
            </h3>
          </div>
          <Link
            href="/#kontak"
            className="text-muted-foreground font-bold flex items-center gap-2 cursor-pointer hover:text-teal-500 transition-all uppercase text-xs tracking-widest"
          >
            Start a Project <ArrowUpRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {Array.isArray(projects) &&
            projects.map((project, idx) => (
              <div key={project.id} className="group card-premium p-4 flex flex-col">
                  <div className="relative aspect-[16/10] rounded-[1.5rem] overflow-hidden border border-[var(--border-subtle)] bg-muted">
                    <PhotoSwiper
                      images={
                        Array.isArray(project.images) && project.images.length > 0
                          ? project.images
                          : [project.imageUrl || '']
                      }
                      aspectRatio="aspect-[16/10]"
                      rounded="rounded-[2rem]"
                    />
                  </div>

                  {/* Project Info - Always Visible */}
                  <div className="pt-6 px-2 flex flex-col h-full">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags?.split(',').slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-bold text-teal-500 border border-[var(--border-subtle)] uppercase tracking-widest"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-black mb-3 text-foreground font-outfit uppercase tracking-tight group-hover:text-teal-500 transition-colors">
                      {project.title || 'Project Title'}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2">
                      {project.description || ''}
                    </p>

                    <div className="mt-auto flex gap-4">
                      {project.projectUrl && (
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          className="flex-1 py-3 bg-white/5 text-foreground rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-500 hover:text-black transition-all flex items-center justify-center gap-2 border border-[var(--border-subtle)] hover:border-teal-500"
                        >
                          View Project <ExternalLink size={14} />
                        </a>
                      )}
                      <Link 
                        href={`/projects/${project.slug || project.id}`}
                        className="py-3 px-6 bg-transparent text-muted-foreground rounded-xl font-black text-[10px] uppercase tracking-widest hover:text-foreground transition-all flex items-center justify-center border border-transparent hover:border-[var(--border-subtle)]"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
              </div>
            ))}
        </div>

        {projects?.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-[var(--border-subtle)]">
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
              Belum ada proyek yang dipublikasikan.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
