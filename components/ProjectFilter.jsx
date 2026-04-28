'use client';
import { useState } from 'react';
import { ExternalLink, Github } from 'lucide-react';

export default function ProjectFilter({ initialProjects }) {
  const categories = ['All', ...new Set(initialProjects.map((p) => p.category || 'Development'))];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects =
    activeCategory === 'All'
      ? initialProjects
      : initialProjects.filter((p) => (p.category || 'Development') === activeCategory);

  return (
    <>
      {/* Category Filter Buttons */}
      <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
              activeCategory === cat
                ? 'bg-[var(--accent)] text-black border-[var(--accent)] shadow-lg shadow-[var(--accent)]/20'
                : 'bg-white/5 text-gray-500 border-[var(--border-subtle)] hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 pb-32">
        {filteredProjects.map((project) => {
          const images = project.images || [];
          const cover = images[0] || 'https://via.placeholder.com/800x600?text=No+Image';

          return (
            <div
              key={project.id}
              className="group relative bg-white/5 border border-[var(--border-subtle)] rounded-[2.5rem] overflow-hidden hover:border-[var(--accent)]/30 transition-all duration-500"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img
                  src={cover}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />
                <div className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md border border-[var(--border-subtle)] rounded-full text-[10px] font-black uppercase tracking-widest text-foreground">
                  {project.category || 'Development'}
                </div>
              </div>

              <div className="p-8 md:p-10">
                <h3 className="text-2xl md:text-3xl font-black font-outfit uppercase mb-4 group-hover:text-[var(--accent)] transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 line-clamp-3 font-medium">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech?.split(',').map((t, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white/5 border border-[var(--border-subtle)] rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-tight"
                    >
                      {t.trim()}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-2 py-4 bg-[var(--accent)] text-black font-black rounded-2xl text-[10px] uppercase tracking-widest hover:brightness-110 transition-all active:scale-95 shadow-lg shadow-[var(--accent)]/20"
                    >
                      Live Demo <ExternalLink size={14} />
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      className="p-4 bg-white/5 border border-[var(--border-subtle)] rounded-2xl text-foreground hover:bg-white/10 transition-all active:scale-95"
                    >
                      <Github size={20} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
