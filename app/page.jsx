import { createClient } from '@/utils/supabase/server';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Skills from '@/components/Skills';
import Timeline from '@/components/Timeline';
import Achievements from '@/components/Achievements';
import LatestBlogs from '@/components/LatestBlogs';
import Gallery from '@/components/Gallery';
import Organizations from '@/components/Organizations';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
  const { data: organizations } = await supabase
    .from('Organization')
    .select('*')
    .order('order', { ascending: true });
  const { data: gallery } = await supabase
    .from('Gallery')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(6);

  return {
    profile,
    projects,
    skills,
    experiences,
    educations,
    awards,
    publications,
    blogs,
    organizations,
    gallery,
  };
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

      <Organizations organizations={data.organizations} />
      <Projects projects={data.projects} />
      <LatestBlogs blogs={data.blogs} />
      <Gallery galleryItems={data.gallery} />

      <Achievements awards={data.awards} publications={data.publications} />

      {/* Footer */}
      <footer id="kontak" className="py-24 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8 font-outfit tracking-tighter uppercase">
            {data.profile?.footer_title?.split(' ').slice(0, -1).join(' ') || "LET'S WORK"}{' '}
            <span className="text-teal-500">
              {data.profile?.footer_title?.split(' ').pop() || 'TOGETHER'}
            </span>
          </h2>
          <p className="text-gray-500 mb-12 max-w-lg mx-auto text-lg leading-relaxed font-medium">
            {data.profile?.footer_sub ||
              "I'm currently available for freelance work and new opportunities. Let's build something amazing together."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${data.profile?.email || 'contact@ridhopasii.id'}`}
              className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-teal-500 hover:text-white transition-all text-sm uppercase tracking-widest"
            >
              Start a Project
            </a>
            <a
              href="#proyek"
              className="px-10 py-5 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-sm uppercase tracking-widest"
            >
              View Work
            </a>
          </div>
          <div className="mt-24 pt-8 border-t border-white/5 text-gray-600 text-xs font-bold uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-4">
            <p>
              © {new Date().getFullYear()} {data.profile?.name || 'Ridho Robbi Pasi'}. All rights
              reserved.
            </p>
            <div className="flex flex-wrap gap-8 justify-center">
              {[
                { label: 'GitHub', href: data.profile?.github_url },
                { label: 'LinkedIn', href: data.profile?.linkedin_url },
                { label: 'Instagram', href: data.profile?.instagram_url },
                { label: 'Twitter', href: data.profile?.twitter_url },
                { label: 'Facebook', href: data.profile?.facebook_url },
                { label: 'Email', href: `mailto:${data.profile?.email}` },
              ]
                .filter((s) => s.href)
                .map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    className="hover:text-teal-500 transition-colors"
                  >
                    {social.label}
                  </a>
                ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
