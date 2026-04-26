import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import { Folders, ExternalLink, Github, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from('Project')
    .select('*')
    .not('showOnHome', 'eq', false)
    .order('createdAt', { ascending: false });

  return (
    <div className="min-h-screen bg-[#050505] text-white font-jakarta selection:bg-teal-500/30">
      <Navbar />

      {/* Hero Section Page */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-teal-500/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-teal-500 text-xs font-bold uppercase tracking-widest mb-8 hover:gap-4 transition-all"
          >
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>

          <h1 className="text-5xl md:text-8xl font-black font-outfit tracking-tighter uppercase mb-6 leading-none">
            Selected{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-teal-600">
              Works.
            </span>
          </h1>
          <p className="text-gray-500 max-w-2xl text-lg md:text-xl font-medium leading-relaxed">
            Kumpulan proyek pengembangan web, desain UI/UX, dan eksperimen kode yang telah saya
            selesaikan.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects?.map((project) => {
            const images = project.images || [];
            const cover = images[0] || 'https://via.placeholder.com/800x600?text=No+Image';

            return (
              <div
                key={project.id}
                className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden hover:border-teal-500/30 transition-all duration-500"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={cover}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />

                  {/* Category Badge */}
                  <div className="absolute top-6 left-6 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {project.category || 'Development'}
                  </div>
                </div>

                <div className="p-8 md:p-10">
                  <h3 className="text-2xl md:text-3xl font-black font-outfit uppercase mb-4 group-hover:text-teal-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 line-clamp-3 font-medium">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.tech?.split(',').map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-500 uppercase tracking-tight"
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
                        className="flex-1 flex items-center justify-center gap-2 py-4 bg-teal-500 text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-teal-400 transition-all active:scale-95 shadow-lg shadow-teal-500/20"
                      >
                        Live Demo <ExternalLink size={14} />
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all active:scale-95"
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
      </section>

      {/* Footer Simple */}
      <footer className="py-10 border-t border-white/5 text-center">
        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
          © {new Date().getFullYear()} Ridho Robbi Pasi
        </p>
      </footer>
    </div>
  );
}
