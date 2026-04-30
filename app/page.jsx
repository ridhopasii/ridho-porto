import { createClient } from '@/utils/supabase/server';
import nextDynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import About from '@/components/About';
import ScrollUtils from '@/components/ScrollUtils';

const Projects = nextDynamic(() => import('@/components/Projects'), { ssr: true });
const Skills = nextDynamic(() => import('@/components/Skills'), { ssr: true });
const Timeline = nextDynamic(() => import('@/components/Timeline'), { ssr: true });
const Achievements = nextDynamic(() => import('@/components/Achievements'), { ssr: true });
const LatestBlogs = nextDynamic(() => import('@/components/LatestBlogs'), { ssr: true });
const Gallery = nextDynamic(() => import('@/components/Gallery'), { ssr: true });
const Organizations = nextDynamic(() => import('@/components/Organizations'), { ssr: true });
const ContactForm = nextDynamic(() => import('@/components/ContactForm'), { ssr: true });
const InstagramFeed = nextDynamic(() => import('@/components/InstagramFeed'), { ssr: false }); // client-only feed

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getData() {
  const supabase = await createClient();

  const [
    { data: profile },
    { data: projects },
    { data: skills },
    { data: experiences },
    { data: educations },
    { data: awards },
    { data: publications },
    { data: blogs },
    { data: organizations },
    { data: gallery },
    { data: settingsData },
  ] = await Promise.all([
    supabase.from('Profile').select('*').order('id', { ascending: true }).limit(1).maybeSingle(),
    supabase
      .from('Project')
      .select('*')
      .not('showOnHome', 'eq', false)
      .order('createdAt', { ascending: false })
      .limit(3),
    supabase.from('Skill').select('*').not('showOnHome', 'eq', false),
    supabase
      .from('Experience')
      .select('*')
      .not('showOnHome', 'eq', false)
      .order('period', { ascending: false }),
    supabase
      .from('Education')
      .select('*')
      .not('showOnHome', 'eq', false)
      .order('period', { ascending: false }),
    supabase
      .from('Award')
      .select('*')
      .not('showOnHome', 'eq', false)
      .order('date', { ascending: false })
      .limit(3),
    supabase
      .from('Publication')
      .select('*')
      .not('showOnHome', 'eq', false)
      .order('date', { ascending: false })
      .limit(3),
    supabase
      .from('Article')
      .select('*')
      .not('showOnHome', 'eq', false)
      .order('createdAt', { ascending: false })
      .limit(3),
    supabase
      .from('Organization')
      .select('*')
      .not('showOnHome', 'eq', false)
      .order('updatedAt', { ascending: false }),
    supabase
      .from('Gallery')
      .select('*')
      .not('showOnHome', 'eq', false)
      .order('createdAt', { ascending: false })
      .limit(6),
    supabase.from('SiteSettings').select('*'),
  ]);

  const settings = {};
  (settingsData || []).forEach((s) => {
    settings[s.key] = s.value;
  });

  const defaultSettings = {
    show_about: true,
    show_projects: true,
    show_experience: true,
    show_education: true,
    show_blog: true,
    show_gallery: true,
    show_skills: true,
    show_achievements: true,
    show_contact: true,
  };

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
    settings: Object.keys(settings).length > 0 ? settings : defaultSettings,
  };
}

export default async function Home() {
  const data = await getData();
  const s = data.settings || {};

  return (
    <main className="min-h-screen bg-body selection:bg-accent/30 selection:text-foreground">
      <ScrollUtils />
      <Navbar />

      <Hero profile={data.profile} />

      {s.show_about !== false && <About profile={data.profile} />}

      {s.show_skills !== false && <Skills skills={data.skills} />}

      {(s.show_experience !== false || s.show_education !== false) && (
        <Timeline
          experiences={s.show_experience !== false ? data.experiences : []}
          educations={s.show_education !== false ? data.educations : []}
        />
      )}

      {s.show_organizations !== false && <Organizations organizations={data.organizations} />}

      {s.show_projects !== false && <Projects projects={data.projects} />}

      {s.show_blog !== false && <LatestBlogs blogs={data.blogs} />}

      {s.show_gallery !== false && <Gallery galleryItems={data.gallery} />}

      {s.show_achievements !== false && (
        <section id="pencapaian">
          <Achievements awards={data.awards} publications={data.publications} />
        </section>
      )}

      {/* Instagram Feed */}
      <InstagramFeed />

      {/* Footer / Contact Section */}
      {s.show_contact !== false && (
        <footer id="kontak" className="py-24 px-6 border-t border-[var(--border-subtle)] bg-body">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
              {/* Left: Info */}
              <div>
                <p className="text-accent font-bold uppercase tracking-[0.3em] mb-4 text-sm">
                  Contact
                </p>
                <h2 className="text-4xl md:text-6xl font-black mb-8 font-outfit tracking-tighter uppercase text-foreground">
                  {data.profile?.footer_title ? (
                    <>
                      {data.profile.footer_title.split(' ').slice(0, -1).join(' ')}{' '}
                      <span className="text-accent">
                        {data.profile.footer_title.split(' ').pop()}
                      </span>
                    </>
                  ) : (
                    <>
                      LET&apos;S WORK <span className="text-accent">TOGETHER</span>
                    </>
                  )}
                </h2>
                <p className="text-muted-foreground mb-10 max-w-md text-lg leading-relaxed font-medium">
                  {data.profile?.footer_sub ||
                    "I'm currently available for freelance work and new opportunities. Let's build something amazing together."}
                </p>
                <div className="space-y-4">
                  {data.profile?.email && (
                    <a
                      href={`mailto:${data.profile.email}`}
                      aria-label={`Email ${data.profile.email}`}
                      className="flex items-center gap-4 text-muted-foreground hover:text-accent transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-[var(--border-subtle)] flex items-center justify-center group-hover:bg-accent group-hover:border-accent group-hover:text-black transition-all">
                        @
                      </div>
                      <span className="text-sm font-medium">{data.profile.email}</span>
                    </a>
                  )}
                </div>
                <div className="mt-12 pt-12 border-t border-[var(--border-subtle)] flex flex-wrap gap-6">
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
                        className="text-xs font-black text-muted-foreground/60 hover:text-accent transition-colors uppercase tracking-widest"
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

            <div className="mt-24 pt-8 border-t border-[var(--border-subtle)] text-muted-foreground text-xs font-bold uppercase tracking-widest flex flex-col md:flex-row justify-between items-center gap-4">
              <p>
                © {new Date().getFullYear()} {data.profile?.name || 'Ridho Robbi Pasi'}. All rights
                reserved.
              </p>
              <p className="italic">Built with Next.js + Supabase</p>
            </div>
          </div>
        </footer>
      )}
    </main>
  );
}
