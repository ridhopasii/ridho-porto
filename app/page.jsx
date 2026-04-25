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
import ScrollUtils from '@/components/ScrollUtils';
import ContactForm from '@/components/ContactForm';

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
    .order('period', { ascending: false });
  const { data: awards } = await supabase
    .from('Award')
    .select('*')
    .order('date', { ascending: false });
  const { data: publications } = await supabase
    .from('Publication')
    .select('*')
    .order('date', { ascending: false });
  const { data: blogs } = await supabase
    .from('Article')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(3);
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
      <ScrollUtils />
      <Navbar />

      <Hero profile={data.profile} />

      <About profile={data.profile} />

      <Skills skills={data.skills} />

      <Timeline experiences={data.experiences} educations={data.educations} />

      <Organizations organizations={data.organizations} />
      <Projects projects={data.projects} />
      <LatestBlogs blogs={data.blogs} />
      <Gallery galleryItems={data.gallery} />

      <section id="pencapaian">
        <Achievements awards={data.awards} publications={data.publications} />
      </section>

      {/* Footer / Contact Section */}
      <footer id="kontak" className="py-24 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* Left: Info */}
            <div>
              <p className="text-teal-500 font-bold uppercase tracking-[0.3em] mb-4 text-sm">
                Contact
              </p>
              <h2 className="text-4xl md:text-6xl font-black mb-8 font-outfit tracking-tighter uppercase text-white">
                {data.profile?.footer_title ? (
                  <>
                    {data.profile.footer_title.split(' ').slice(0, -1).join(' ')}{' '}
                    <span className="text-teal-500">
                      {data.profile.footer_title.split(' ').pop()}
                    </span>
                  </>
                ) : (
                  <>
                    LET&apos;S WORK <span className="text-teal-500">TOGETHER</span>
                  </>
                )}
              </h2>
              <p className="text-gray-500 mb-10 max-w-md text-lg leading-relaxed font-medium">
                {data.profile?.footer_sub ||
                  "I'm currently available for freelance work and new opportunities. Let's build something amazing together."}
              </p>
              <div className="space-y-4">
                {data.profile?.email && (
                  <a
                    href={`mailto:${data.profile.email}`}
                    className="flex items-center gap-4 text-gray-400 hover:text-teal-500 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-teal-500 group-hover:border-teal-500 group-hover:text-black transition-all">
                      @
                    </div>
                    <span className="text-sm font-medium">{data.profile.email}</span>
                  </a>
                )}
              </div>
              <div className="mt-12 pt-12 border-t border-white/5 flex flex-wrap gap-6">
                {[
                  { label: 'GitHub', href: data.profile?.github_url },
                  { label: 'LinkedIn', href: data.profile?.linkedin_url },
                  { label: 'Instagram', href: data.profile?.instagram_url },
                  { label: 'Twitter', href: data.profile?.twitter_url },
                  { label: 'Facebook', href: data.profile?.facebook_url },
                ]
                  .filter((s) => s.href)
                  .map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      className="text-xs font-black text-gray-600 hover:text-teal-500 transition-colors uppercase tracking-widest"
                    >
                      {social.label}
                    </a>
                  ))}
              </div>
            </div>
            {/* Right: Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>

          <div className="mt-24 pt-8 border-t border-white/5 text-gray-600 text-xs font-bold uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-4">
            <p>
              © {new Date().getFullYear()} {data.profile?.name || 'Ridho Robbi Pasi'}. All rights
              reserved.
            </p>
            <p className="text-gray-800 italic">Built with Next.js + Supabase</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
