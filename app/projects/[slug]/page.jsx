import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import PhotoSwiper from '@/components/PhotoSwiper';
import { Github, Globe, ArrowLeft, Tag, Calendar, ExternalLink, Code } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }) {
  const { slug } = params;
  const supabase = await createClient();

  const { data: project } = await supabase.from('Project').select('*').eq('slug', slug).single();

  if (!project) notFound();

  return (
    <main className="min-h-screen bg-[#050505] text-white font-jakarta">
      <Navbar />

      {/* Hero Banner Section */}
      <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={project.imageUrl || project.images?.[0]}
            alt={project.title}
            className="w-full h-full object-cover brightness-[0.3] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        </div>

        <div className="absolute inset-0 z-10 flex flex-col justify-end px-6 pb-20">
          <div className="max-w-6xl mx-auto w-full">
            <Link
              href="/#proyek"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-teal-500 transition-all mb-10 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />{' '}
              Back to Work
            </Link>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags?.split(',').map((tag) => (
                <span
                  key={tag}
                  className="px-5 py-2 bg-teal-500/10 border border-teal-500/20 text-teal-500 text-[10px] font-black uppercase tracking-widest rounded-full backdrop-blur-md"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>

            <h1 className="text-5xl md:text-8xl font-black font-outfit uppercase tracking-tighter leading-[0.9] mb-6">
              {project.title}
            </h1>

            <div className="flex flex-wrap gap-8 items-center text-gray-500 text-xs font-bold uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-teal-500" /> {project.category}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-teal-500" />{' '}
                {new Date(project.createdAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-20">
            {/* Overview */}
            <section>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                <span className="w-8 h-px bg-teal-500"></span> The Project
              </h2>
              <div className="text-gray-300 text-xl leading-relaxed whitespace-pre-wrap font-medium">
                {project.description}
              </div>
            </section>

            {/* Content Detail */}
            {project.content && (
              <section className="prose prose-invert prose-teal max-w-none">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                  <span className="w-8 h-px bg-teal-500"></span> Technical Breakdown
                </h2>
                <div className="text-gray-400 text-lg leading-relaxed">{project.content}</div>
              </section>
            )}

            {/* Image Gallery */}
            {Array.isArray(project.images) && project.images.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                  <span className="w-8 h-px bg-teal-500"></span> Visual Showcase
                </h2>
                <div className="rounded-[3rem] overflow-hidden border border-white/10 p-2 bg-white/5 shadow-2xl">
                  <PhotoSwiper
                    images={project.images}
                    aspectRatio="aspect-[16/10]"
                    rounded="rounded-[2.5rem]"
                  />
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] space-y-10">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-6">
                  Launch Details
                </h3>
                <div className="space-y-4">
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      className="w-full flex items-center justify-between p-5 bg-teal-500 text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-teal-500/20"
                    >
                      Live Preview <Globe size={20} />
                    </a>
                  )}
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                      View Repository <Github size={20} />
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-10 border-t border-white/5">
                <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-6">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags?.split(',').map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                    >
                      <Code size={12} className="text-teal-500" /> {tag.trim()}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-10 border border-white/5 rounded-[3rem] bg-gradient-to-br from-teal-500/5 to-transparent">
              <h3 className="text-xs font-black uppercase tracking-widest text-white/40 mb-4">
                Project Impact
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed italic">
                This project represents a fusion of technical excellence and creative problem
                solving, delivered to meet specific user needs and performance standards.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-700 mb-2">
          Designed & Built by Ridho Robbi Pasi
        </p>
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-800 italic">
          Global Perspective • Innovation Driven
        </p>
      </footer>
    </main>
  );
}
