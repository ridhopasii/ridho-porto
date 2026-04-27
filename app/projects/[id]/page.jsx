import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import { ArrowLeft, ExternalLink, Github, Globe, Code2, Layout, Zap } from 'lucide-react';
import Link from 'next/link';

// DYNAMIC SEO METADATA
export async function generateMetadata({ params }) {
  const supabase = await createClient();
  const { data: project } = await supabase.from('Project').select('*').eq('id', params.id).single();
  
  if (!project) return { title: 'Project Not Found' };

  return {
    title: project.title,
    description: project.description?.substring(0, 160),
    openGraph: {
      title: project.title,
      description: project.description?.substring(0, 160),
      images: [project.images?.[0] || ''],
    },
  };
}

export default async function ProjectDetailPage({ params }) {
  const supabase = await createClient();
  const { data: project } = await supabase.from('Project').select('*').eq('id', params.id).single();

  if (!project) return <div className="p-20 text-center">Project not found.</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-jakarta">
      <Navbar />

      <section className="pt-32 pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/projects" className="inline-flex items-center gap-2 text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-12 hover:gap-4 transition-all">
            <ArrowLeft size={16} /> Kembali ke Proyek
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: Info */}
            <div className="animate-fade-in-up">
              <span className="px-4 py-1.5 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">
                {project.category || 'Development'}
              </span>
              <h1 className="text-4xl md:text-7xl font-black font-outfit uppercase tracking-tight leading-tight mb-8">
                {project.title}
              </h1>
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-12 font-medium">
                {project.description}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 mb-12">
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                  <Layout size={20} className="text-[var(--accent)] mb-3" />
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Role</p>
                  <p className="font-bold text-sm">Full Stack Developer</p>
                </div>
                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                  <Zap size={20} className="text-yellow-500 mb-3" />
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">Challenge</p>
                  <p className="font-bold text-sm">High Performance</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {project.projectUrl && (
                  <a href={project.projectUrl} target="_blank" className="px-8 py-4 bg-[var(--accent)] text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl shadow-[var(--accent)]/20">
                    Visit Live Site <Globe size={16} />
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                    Source Code <Github size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* Right: Gallery Layout */}
            <div className="space-y-6">
              {project.images?.map((img, idx) => (
                <div key={idx} className="rounded-[2.5rem] overflow-hidden border border-white/10 group">
                  <img 
                    src={img} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt={`Gallery ${idx}`} 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Section */}
          <div className="mt-32 pt-20 border-t border-white/5">
            <div className="flex items-center gap-3 mb-12">
              <Code2 className="text-[var(--accent)]" />
              <h2 className="text-2xl font-black font-outfit uppercase tracking-tighter">Technology Stack</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {project.tech?.split(',').map((t, i) => (
                <div key={i} className="px-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] text-center min-w-[140px] hover:border-[var(--accent)] transition-all">
                  <p className="text-white font-black uppercase text-xs tracking-widest">{t.trim()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
          Let's build something great together.
        </p>
      </footer>
    </div>
  );
}
