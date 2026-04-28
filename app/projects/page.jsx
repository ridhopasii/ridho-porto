import { createClient } from '@/utils/supabase/server';
import Navbar from '@/components/Navbar';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProjectFilter from '@/components/ProjectFilter';

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: projects } = await supabase
    .from('Project')
    .select('*')
    .order('createdAt', { ascending: false });

  return (
    <div className="min-h-screen bg-background text-foreground font-jakarta selection:bg-[var(--accent)]/30">
      <Navbar />

      {/* Hero Section Page */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[var(--accent)]/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--accent)] text-xs font-bold uppercase tracking-widest mb-8 hover:gap-4 transition-all"
          >
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>

          <h1 className="text-5xl md:text-8xl font-black font-outfit tracking-tighter uppercase mb-6 leading-none">
            Selected{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-purple-600">
              Works.
            </span>
          </h1>
          <p className="text-gray-500 max-w-2xl text-lg md:text-xl font-medium leading-relaxed">
            Kumpulan proyek pengembangan web, desain UI/UX, dan eksperimen kode yang telah saya
            selesaikan.
          </p>
        </div>
      </section>

      {/* Projects Grid with Filter */}
      <ProjectFilter initialProjects={projects || []} />
    </div>
  );
}
