import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import PhotoSwiper from '@/components/PhotoSwiper';
import { Cpu, ArrowLeft, Layers, History, Briefcase, ExternalLink, Code2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SkillDetailPage({ params }) {
  const { slug } = params;
  const supabase = await createClient();

  const { data: skill } = await supabase.from('Skill').select('*').eq('slug', slug).single();

  if (!skill) notFound();

  // Fetch related content (projects that have tags matching this skill name)
  const { data: relatedProjects } = await supabase
    .from('Project')
    .select('*')
    .ilike('tags', `%${skill.name}%`)
    .limit(4);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Header */}
      <div className="relative pt-32 pb-20 px-6 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <Link
            href="/#keterampilan"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-teal-500 transition-all mb-12 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
            to Tech Stack
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-center text-center md:text-left">
            <div className="w-32 h-32 bg-white/5 border border-[var(--border-subtle)] rounded-[2.5rem] flex items-center justify-center text-teal-500 shadow-2xl shadow-teal-500/10">
              <Code2 size={64} strokeWidth={1} />
            </div>
            <div>
              <div className="flex flex-wrap gap-3 mb-4 justify-center md:justify-start">
                <span className="px-4 py-1.5 bg-white/5 border border-[var(--border-subtle)] text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {skill.category || 'Technical Skill'}
                </span>
                <span className="px-4 py-1.5 bg-teal-500/10 border border-teal-500/20 text-teal-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {skill.level || 'Expert'} Proficiency
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black font-outfit uppercase tracking-tighter leading-tight mb-2">
                {skill.name}
              </h1>
              <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden max-w-xs mx-auto md:mx-0">
                <div
                  className="h-full bg-teal-500 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(20,184,166,0.5)]"
                  style={{ width: `${skill.percentage || 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            {/* Description */}
            <section>
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
                <Layers size={14} className="text-teal-500" /> Mastery Details
              </h2>
              <div className="text-gray-400 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                {skill.description ||
                  `I have extensive experience working with ${skill.name} to build modern, efficient, and scalable solutions. This skill has been a core part of my professional journey and projects.`}
              </div>
            </section>

            {/* Documentation/Related Photos */}
            {Array.isArray(skill.images) && skill.images.length > 0 && (
              <section>
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
                  <History size={14} className="text-teal-500" /> Applied Projects & Documentation
                </h2>
                <div className="rounded-[3rem] overflow-hidden border border-[var(--border-subtle)] p-2 bg-white/5 shadow-2xl">
                  <PhotoSwiper
                    images={skill.images}
                    aspectRatio="aspect-video"
                    rounded="rounded-[2.5rem]"
                  />
                </div>
              </section>
            )}

            {/* Related Portfolios */}
            {relatedProjects && relatedProjects.length > 0 && (
              <section>
                <h2 className="text-xs font-black text-gray-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
                  <Briefcase size={14} className="text-teal-500" /> Featured Portfolios
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.slug}`}
                      className="group p-6 bg-white/5 border border-[var(--border-subtle)] rounded-3xl hover:border-teal-500/30 transition-all"
                    >
                      <div className="aspect-video rounded-2xl overflow-hidden mb-4 border border-white/5">
                        <img
                          src={project.imageUrl || project.images?.[0]}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <h3 className="font-bold text-foreground group-hover:text-teal-500 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                        {project.category}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-8">
            <div className="p-8 bg-white/5 border border-[var(--border-subtle)] rounded-[2.5rem] space-y-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-teal-500">
                Skill Statistics
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">
                    Proficiency
                  </p>
                  <p className="text-3xl font-black text-foreground">{skill.percentage || 100}%</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">
                    Projects Delivered
                  </p>
                  <p className="text-3xl font-black text-foreground">{relatedProjects?.length || 0}+</p>
                </div>
                <div>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">
                    Experience Level
                  </p>
                  <p className="text-3xl font-black text-foreground">{skill.level || 'Expert'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-12 border-t border-white/5 text-center text-[10px] font-bold uppercase tracking-widest text-gray-600">
        © {new Date().getFullYear()} Ridho Robbi Pasi • Technical Mastery
      </footer>
    </main>
  );
}
