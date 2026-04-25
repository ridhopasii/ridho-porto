import { createClient } from '@/utils/supabase/server';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Timeline from '@/components/Timeline';
import Achievements from '@/components/Achievements';
import LatestBlogs from '@/components/LatestBlogs';

async function getData() {
  const supabase = await createClient();

  const { data: profile } = await supabase.from('Profile').select('*').single();
  const { data: projects } = await supabase
    .from('Project')
    .select('*')
    .order('createdAt', { ascending: false });
  const { data: skills } = await supabase.from('Skill').select('*');
  const { data: experiences } = await supabase
    .from('Experience')
    .select('*')
    .order('period', { ascending: false });
  const { data: educations } = await supabase
    .from('Education')
    .select('*')
    .order('year', { ascending: false });
  const { data: awards } = await supabase
    .from('Award')
    .select('*')
    .order('year', { ascending: false });
  const { data: publications } = await supabase
    .from('Publication')
    .select('*')
    .order('year', { ascending: false });
  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  return { profile, projects, skills, experiences, educations, awards, publications, blogs };
}

export default async function Home() {
  const data = await getData();

  return (
    <main className="min-h-screen bg-[#0a0a0a] selection:bg-teal-500/30 selection:text-white">
      <Navbar />

      <Hero profile={data.profile} />

      <About profile={data.profile} />

      <Skills skills={data.skills} />

      <Timeline experiences={data.experiences} educations={data.educations} />

      <Projects projects={data.projects} />
      <LatestBlogs blogs={data.blogs} />

      <Achievements awards={data.awards} publications={data.publications} />

      {/* Footer */}
      <footer id="kontak" className="py-24 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8 font-outfit tracking-tighter">
            LET'S WORK <span className="text-teal-500">TOGETHER</span>
          </h2>
          <p className="text-gray-500 mb-12 max-w-lg mx-auto text-lg">
            I'm currently available for freelance work and new opportunities. Let's build something
            amazing together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${data.profile?.email || 'contact@ridhopasii.id'}`}
              className="px-10 py-5 bg-white text-black font-bold rounded-2xl hover:bg-teal-500 hover:text-white transition-all text-lg"
            >
              Start a Project
            </a>
            <a
              href="#proyek"
              className="px-10 py-5 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-lg"
            >
              View Work
            </a>
          </div>
          <div className="mt-24 pt-8 border-t border-white/5 text-gray-600 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} Ridho Robbi Pasi. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-teal-500 transition-colors">
                GitHub
              </a>
              <a href="#" className="hover:text-teal-500 transition-colors">
                LinkedIn
              </a>
              <a href="#" className="hover:text-teal-500 transition-colors">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
