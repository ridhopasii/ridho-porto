import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AppData } from '@/types';
import { defaultData } from '@/data/defaultData';
import supabase from '@/lib/supabase';

interface DataContextType {
  data: AppData;
  loading: boolean;
  updateProfile: (profile: AppData['profile']) => void;
  updateExperiences: (experiences: AppData['experiences']) => void;
  updateEducations: (educations: AppData['educations']) => void;
  updateActivities: (activities: AppData['activities']) => void;
  updateProjects: (projects: AppData['projects']) => void;
  updateBlogPosts: (blogPosts: AppData['blogPosts']) => void;
  updateContacts: (contacts: AppData['contacts']) => void;
  updateRecommendations: (recommendations: AppData['recommendations']) => void;
  updateChatMessages: (chatMessages: AppData['chatMessages']) => void;
  updatePinnedMessage: (pinnedMessage: AppData['pinnedMessage']) => void;
  updateSettings: (settings: AppData['settings']) => void;
  updateTechStacks: (techStacks: AppData['techStacks']) => void;
  resetToDefaults: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'portfolio_data';

function loadCachedData(): AppData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const merged = { ...defaultData };
      
      if (parsed && typeof parsed === 'object') {
        if (parsed.profile) merged.profile = { ...defaultData.profile, ...parsed.profile };
        if (Array.isArray(parsed.experiences)) merged.experiences = parsed.experiences;
        if (Array.isArray(parsed.educations)) merged.educations = parsed.educations;
        if (Array.isArray(parsed.activities)) merged.activities = parsed.activities;
        if (Array.isArray(parsed.projects)) merged.projects = parsed.projects;
        if (Array.isArray(parsed.blogPosts)) merged.blogPosts = parsed.blogPosts;
        if (Array.isArray(parsed.contacts)) merged.contacts = parsed.contacts;
        if (Array.isArray(parsed.recommendations)) merged.recommendations = parsed.recommendations;
        if (Array.isArray(parsed.chatMessages)) merged.chatMessages = parsed.chatMessages;
        if (parsed.pinnedMessage) merged.pinnedMessage = parsed.pinnedMessage;
        if (parsed.settings) merged.settings = { ...defaultData.settings, ...parsed.settings };
        if (Array.isArray(parsed.techStacks)) merged.techStacks = parsed.techStacks;
      }
      
      return merged;
    }
  } catch (e) {
    console.error('Error loading data from localStorage:', e);
  }
  return { ...defaultData };
}

function saveCachedData(data: AppData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data to localStorage:', e);
  }
}

// Helpers for periods parsing
const parsePeriod = (periodStr: string) => {
  if (!periodStr) return { startDate: '', endDate: '', current: false };
  const parts = periodStr.split(' - ');
  const startDate = parts[0]?.trim() || '';
  const endDatePart = parts[1]?.trim() || '';
  const current = endDatePart.toLowerCase() === 'sekarang' || endDatePart.toLowerCase() === 'present' || endDatePart === '';
  const endDate = current ? '' : endDatePart;
  return { startDate, endDate, current };
};

const getBrandColor = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'github': return '#333';
    case 'linkedin': return '#0A66C2';
    case 'telegram': return '#0088cc';
    case 'instagram': return '#E4405F';
    default: return '#14b8a6';
  }
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(loadCachedData);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase
  useEffect(() => {
    let active = true;

    async function fetchData() {
      try {
        const [
          { data: profileRes, error: profileErr },
          { data: experiencesRes, error: experiencesErr },
          { data: educationsRes, error: educationsErr },
          { data: activitiesRes, error: activitiesErr },
          { data: projectsRes, error: projectsErr },
          { data: articlesRes, error: articlesErr },
          { data: socialsRes, error: socialsErr },
          { data: testimonialsRes, error: testimonialsErr },
          { data: messagesRes, error: messagesErr },
          { data: settingsRes, error: settingsErr },
          { data: skillsRes, error: skillsErr },
        ] = await Promise.all([
          supabase.from('Profile').select('*').limit(1).maybeSingle(),
          supabase.from('Experience').select('*'),
          supabase.from('Education').select('*'),
          supabase.from('Organization').select('*'),
          supabase.from('Project').select('*'),
          supabase.from('Article').select('*'),
          supabase.from('Social').select('*'),
          supabase.from('Testimonial').select('*'),
          supabase.from('Message').select('*'),
          supabase.from('SiteSettings').select('*'),
          supabase.from('Skill').select('*'),
        ]);

        if (!active) return;

        const merged = { ...loadCachedData() };

        // 1. Profile Mapping
        if (profileRes && !profileErr) {
          merged.profile = {
            name: profileRes.fullName || profileRes.name || defaultData.profile.name,
            title: profileRes.title || defaultData.profile.title,
            bio: profileRes.bio || defaultData.profile.bio,
            email: profileRes.email || defaultData.profile.email,
            location: profileRes.location || defaultData.profile.location,
            avatar: profileRes.avatarUrl || defaultData.profile.avatar,
            resumeUrl: profileRes.cvLink || defaultData.profile.resumeUrl,
            socials: {
              github: socialsRes?.find(s => s.platform.toLowerCase() === 'github')?.url || profileRes.github_url || defaultData.profile.socials.github,
              linkedin: socialsRes?.find(s => s.platform.toLowerCase() === 'linkedin')?.url || profileRes.linkedin_url || defaultData.profile.socials.linkedin,
              telegram: socialsRes?.find(s => s.platform.toLowerCase() === 'telegram')?.url || defaultData.profile.socials.telegram,
              instagram: socialsRes?.find(s => s.platform.toLowerCase() === 'instagram')?.url || profileRes.instagram_url || defaultData.profile.socials.instagram,
            }
          };
        }

        // 2. Experiences Mapping
        if (experiencesRes && !experiencesErr && experiencesRes.length > 0) {
          const sorted = [...experiencesRes].sort((a, b) => (a.order || 0) - (b.order || 0));
          merged.experiences = sorted.map(exp => {
            const period = parsePeriod(exp.period);
            return {
              id: exp.id.toString(),
              company: exp.company,
              position: exp.position,
              logo: exp.logoUrl || '/avatar1.jpg',
              startDate: period.startDate,
              endDate: period.endDate,
              current: period.current,
              description: exp.description || '',
              type: exp.type || 'Full-time'
            };
          });
        }

        // 3. Educations Mapping
        if (educationsRes && !educationsErr && educationsRes.length > 0) {
          const sorted = [...educationsRes].sort((a, b) => (a.order || 0) - (b.order || 0));
          merged.educations = sorted.map(edu => {
            const period = parsePeriod(edu.period);
            return {
              id: edu.id.toString(),
              school: edu.institution,
              degree: edu.degree,
              logo: edu.logoUrl || '/avatar1.jpg',
              startDate: period.startDate,
              endDate: period.endDate,
              current: period.current,
              description: edu.description || edu.status || '',
            };
          });
        }

        // 4. Activities Mapping
        if (activitiesRes && !activitiesErr && activitiesRes.length > 0) {
          const sorted = [...activitiesRes].sort((a, b) => (a.order || 0) - (b.order || 0));
          merged.activities = sorted.map(act => ({
            id: act.id.toString(),
            title: act.role,
            organization: act.name,
            logo: act.logoUrl || '/avatar1.jpg',
            date: act.period,
            description: act.description || '',
          }));
        }

        // 5. Projects Mapping
        if (projectsRes && !projectsErr && projectsRes.length > 0) {
          const sorted = [...projectsRes].sort((a, b) => b.id - a.id);
          merged.projects = sorted.map(proj => ({
            id: proj.id.toString(),
            title: proj.title,
            description: proj.description,
            image: proj.imageUrl || '/project-ci-cd.jpg',
            featured: proj.featured || false,
            link: proj.demoUrl || proj.projectUrl || '#',
            github: proj.repoUrl || '#',
            tags: proj.tags ? proj.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
            category: proj.category || 'web',
          }));
        }

        // 6. BlogPosts Mapping
        if (articlesRes && !articlesErr && articlesRes.length > 0) {
          const sorted = [...articlesRes].sort((a, b) => b.id - a.id);
          merged.blogPosts = sorted.map(art => ({
            id: art.id.toString(),
            title: art.title,
            excerpt: art.excerpt || art.content.substring(0, 150) + '...',
            content: art.content,
            image: art.imageUrl || '/blog-team.jpg',
            tags: art.tags ? art.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
            date: new Date(art.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
            featured: art.showOnHome || art.published || false,
            views: art.views || 0,
            comments: art.comments || 0,
            reactions: art.reactions || 0,
            author: merged.profile.name,
            authorAvatar: merged.profile.avatar,
            readTime: art.readTime || '5 min read',
          }));
        }

        // 7. Contacts Mapping
        if (socialsRes && !socialsErr && socialsRes.length > 0) {
          merged.contacts = socialsRes.map(soc => ({
            id: soc.id.toString(),
            platform: soc.platform,
            username: `@${soc.platform.toLowerCase()}`,
            url: soc.url,
            icon: soc.platform,
            color: getBrandColor(soc.platform),
          }));
        }

        // 8. Recommendations Mapping
        if (testimonialsRes && !testimonialsErr && testimonialsRes.length > 0) {
          merged.recommendations = testimonialsRes.map(test => {
            let role = test.role;
            let company = '';
            if (role && role.includes(' at ')) {
              const parts = role.split(' at ');
              role = parts[0];
              company = parts[1];
            }
            return {
              id: test.id.toString(),
              name: test.name,
              role: role,
              company: company,
              avatar: test.avatarUrl || '/avatar1.jpg',
              content: test.message,
              rating: test.rating || 5,
              date: new Date(test.createdAt || Date.now()).getFullYear().toString(),
            };
          });
        }

        // 9. ChatMessages Mapping
        if (messagesRes && !messagesErr && messagesRes.length > 0) {
          merged.chatMessages = messagesRes.map(msg => ({
            id: msg.id.toString(),
            sender: msg.name,
            content: msg.message,
            timestamp: new Date(msg.createdAt).toLocaleDateString(),
            likes: msg.likes || 0,
            avatar: msg.avatarUrl || '/avatar1.jpg',
          }));
        }

        // 10. SiteSettings Mapping
        if (settingsRes && !settingsErr && settingsRes.length > 0) {
          const getValue = (key: string) => settingsRes.find(s => s.key === key)?.value;
          merged.settings = {
            siteTitle: getValue('site_title') || getValue('siteTitle') || defaultData.settings.siteTitle,
            siteDescription: getValue('site_description') || getValue('siteDescription') || defaultData.settings.siteDescription,
            adminPassword: getValue('admin_password') || getValue('adminPassword') || defaultData.settings.adminPassword,
            theme: (getValue('theme') as any) || defaultData.settings.theme,
            primaryColor: getValue('accent_color') || getValue('primaryColor') || defaultData.settings.primaryColor,
          };

          const pinnedStr = getValue('pinned_message');
          if (pinnedStr) {
            try {
              merged.pinnedMessage = JSON.parse(pinnedStr);
            } catch (e) {}
          }
        }

        // 11. TechStacks Mapping
        if (skillsRes && !skillsErr && skillsRes.length > 0) {
          merged.techStacks = skillsRes.map(s => s.name);
        }

        setData(merged);
        saveCachedData(merged);
      } catch (err) {
        console.error('Error fetching data from Supabase:', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => {
      active = false;
    };
  }, []);

  // Sync cache changes
  useEffect(() => {
    if (!loading) {
      saveCachedData(data);
    }
  }, [data, loading]);

  // Dynamically update document title based on profile name
  useEffect(() => {
    if (data.profile.name) {
      document.title = `${data.profile.name} Portfolio`;
    }
  }, [data.profile.name]);

  const updateProfile = useCallback(async (profile: AppData['profile']) => {
    setData((prev) => ({ ...prev, profile }));
    try {
      await supabase.from('Profile').upsert({
        id: 1,
        fullName: profile.name,
        name: profile.name,
        title: profile.title,
        bio: profile.bio,
        email: profile.email,
        location: profile.location,
        avatarUrl: profile.avatar,
        cvLink: profile.resumeUrl,
        github_url: profile.socials.github,
        linkedin_url: profile.socials.linkedin,
        instagram_url: profile.socials.instagram
      });

      const platforms = [
        { name: 'GitHub', url: profile.socials.github, icon: 'github' },
        { name: 'LinkedIn', url: profile.socials.linkedin, icon: 'linkedin' },
        { name: 'Telegram', url: profile.socials.telegram, icon: 'MessageCircle' },
        { name: 'Instagram', url: profile.socials.instagram, icon: 'instagram' },
      ];

      for (const plat of platforms) {
        if (plat.url) {
          const { data: existing } = await supabase.from('Social').select('id').eq('platform', plat.name).limit(1);
          if (existing && existing.length > 0) {
            await supabase.from('Social').update({ url: plat.url, icon: plat.icon }).eq('id', existing[0].id);
          } else {
            await supabase.from('Social').insert({ platform: plat.name, url: plat.url, icon: plat.icon });
          }
        }
      }
    } catch (err) {
      console.error('Error syncing Profile update to Supabase:', err);
    }
  }, []);

  const updateExperiences = useCallback(async (experiences: AppData['experiences']) => {
    setData((prev) => ({ ...prev, experiences }));
    try {
      const incomingIds = experiences.map(e => parseInt(e.id)).filter(id => id < 1000000000000 && !isNaN(id));
      if (incomingIds.length > 0) {
        await supabase.from('Experience').delete().not('id', 'in', `(${incomingIds.join(',')})`);
      } else {
        await supabase.from('Experience').delete().neq('id', 0);
      }
      for (const exp of experiences) {
        const isNew = parseInt(exp.id) > 1000000000000 || isNaN(parseInt(exp.id));
        const periodStr = exp.current ? `${exp.startDate} - Sekarang` : `${exp.startDate} - ${exp.endDate}`;
        const payload = {
          company: exp.company,
          position: exp.position,
          period: periodStr,
          description: exp.description,
          logoUrl: exp.logo,
          showOnHome: true
        };
        if (isNew) {
          await supabase.from('Experience').insert(payload);
        } else {
          await supabase.from('Experience').update(payload).eq('id', parseInt(exp.id));
        }
      }
    } catch (err) {
      console.error('Error syncing Experiences update to Supabase:', err);
    }
  }, []);

  const updateEducations = useCallback(async (educations: AppData['educations']) => {
    setData((prev) => ({ ...prev, educations }));
    try {
      const incomingIds = educations.map(e => parseInt(e.id)).filter(id => id < 1000000000000 && !isNaN(id));
      if (incomingIds.length > 0) {
        await supabase.from('Education').delete().not('id', 'in', `(${incomingIds.join(',')})`);
      } else {
        await supabase.from('Education').delete().neq('id', 0);
      }
      for (const edu of educations) {
        const isNew = parseInt(edu.id) > 1000000000000 || isNaN(parseInt(edu.id));
        const periodStr = edu.current ? `${edu.startDate} - Sekarang` : `${edu.startDate} - ${edu.endDate}`;
        const payload = {
          institution: edu.school,
          degree: edu.degree,
          major: '',
          period: periodStr,
          description: edu.description,
          logoUrl: edu.logo,
          showOnHome: true
        };
        if (isNew) {
          await supabase.from('Education').insert(payload);
        } else {
          await supabase.from('Education').update(payload).eq('id', parseInt(edu.id));
        }
      }
    } catch (err) {
      console.error('Error syncing Educations update to Supabase:', err);
    }
  }, []);

  const updateActivities = useCallback(async (activities: AppData['activities']) => {
    setData((prev) => ({ ...prev, activities }));
    try {
      const incomingIds = activities.map(a => parseInt(a.id)).filter(id => id < 1000000000000 && !isNaN(id));
      if (incomingIds.length > 0) {
        await supabase.from('Organization').delete().not('id', 'in', `(${incomingIds.join(',')})`);
      } else {
        await supabase.from('Organization').delete().neq('id', 0);
      }
      for (const act of activities) {
        const isNew = parseInt(act.id) > 1000000000000 || isNaN(parseInt(act.id));
        const payload = {
          role: act.title,
          name: act.organization,
          period: act.date,
          description: act.description,
          logoUrl: act.logo,
          showOnHome: true
        };
        if (isNew) {
          await supabase.from('Organization').insert(payload);
        } else {
          await supabase.from('Organization').update(payload).eq('id', parseInt(act.id));
        }
      }
    } catch (err) {
      console.error('Error syncing Activities update to Supabase:', err);
    }
  }, []);

  const updateProjects = useCallback(async (projects: AppData['projects']) => {
    setData((prev) => ({ ...prev, projects }));
    try {
      const incomingIds = projects.map(p => parseInt(p.id)).filter(id => id < 1000000000000 && !isNaN(id));
      if (incomingIds.length > 0) {
        await supabase.from('Project').delete().not('id', 'in', `(${incomingIds.join(',')})`);
      } else {
        await supabase.from('Project').delete().neq('id', 0);
      }
      for (const proj of projects) {
        const isNew = parseInt(proj.id) > 1000000000000 || isNaN(parseInt(proj.id));
        const slug = proj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `project-${Date.now()}`;
        const payload = {
          title: proj.title,
          slug,
          description: proj.description,
          imageUrl: proj.image,
          featured: proj.featured,
          demoUrl: proj.link,
          repoUrl: proj.github,
          tags: proj.tags.join(','),
          category: proj.category,
          showOnHome: true
        };
        if (isNew) {
          await supabase.from('Project').insert(payload);
        } else {
          await supabase.from('Project').update(payload).eq('id', parseInt(proj.id));
        }
      }
    } catch (err) {
      console.error('Error syncing Projects update to Supabase:', err);
    }
  }, []);

  const updateBlogPosts = useCallback(async (blogPosts: AppData['blogPosts']) => {
    setData((prev) => ({ ...prev, blogPosts }));
    try {
      const incomingIds = blogPosts.map(b => parseInt(b.id)).filter(id => id < 1000000000000 && !isNaN(id));
      if (incomingIds.length > 0) {
        await supabase.from('Article').delete().not('id', 'in', `(${incomingIds.join(',')})`);
      } else {
        await supabase.from('Article').delete().neq('id', 0);
      }
      for (const post of blogPosts) {
        const isNew = parseInt(post.id) > 1000000000000 || isNaN(parseInt(post.id));
        const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `blog-${Date.now()}`;
        const payload = {
          title: post.title,
          slug,
          content: post.content,
          imageUrl: post.image,
          tags: post.tags.join(','),
          showOnHome: post.featured,
          published: true,
          excerpt: post.excerpt,
        };
        if (isNew) {
          await supabase.from('Article').insert(payload);
        } else {
          await supabase.from('Article').update(payload).eq('id', parseInt(post.id));
        }
      }
    } catch (err) {
      console.error('Error syncing BlogPosts update to Supabase:', err);
    }
  }, []);

  const updateContacts = useCallback(async (contacts: AppData['contacts']) => {
    setData((prev) => ({ ...prev, contacts }));
    try {
      const incomingIds = contacts.map(c => parseInt(c.id)).filter(id => id < 1000000000000 && !isNaN(id));
      if (incomingIds.length > 0) {
        await supabase.from('Social').delete().not('id', 'in', `(${incomingIds.join(',')})`);
      } else {
        await supabase.from('Social').delete().neq('id', 0);
      }
      for (const contact of contacts) {
        const isNew = parseInt(contact.id) > 1000000000000 || isNaN(parseInt(contact.id));
        const payload = {
          platform: contact.platform,
          url: contact.url,
          icon: contact.icon.toLowerCase(),
        };
        if (isNew) {
          await supabase.from('Social').insert(payload);
        } else {
          await supabase.from('Social').update(payload).eq('id', parseInt(contact.id));
        }
      }
    } catch (err) {
      console.error('Error syncing Contacts update to Supabase:', err);
    }
  }, []);

  const updateRecommendations = useCallback(async (recommendations: AppData['recommendations']) => {
    setData((prev) => ({ ...prev, recommendations }));
    try {
      const incomingIds = recommendations.map(r => parseInt(r.id)).filter(id => id < 1000000000000 && !isNaN(id));
      if (incomingIds.length > 0) {
        await supabase.from('Testimonial').delete().not('id', 'in', `(${incomingIds.join(',')})`);
      } else {
        await supabase.from('Testimonial').delete().neq('id', 0);
      }
      for (const rec of recommendations) {
        const isNew = parseInt(rec.id) > 1000000000000 || isNaN(parseInt(rec.id));
        const roleStr = rec.company ? `${rec.role} at ${rec.company}` : rec.role;
        const payload = {
          name: rec.name,
          role: roleStr,
          message: rec.content,
          avatarUrl: rec.avatar,
        };
        if (isNew) {
          await supabase.from('Testimonial').insert(payload);
        } else {
          await supabase.from('Testimonial').update(payload).eq('id', parseInt(rec.id));
        }
      }
    } catch (err) {
      console.error('Error syncing Recommendations update to Supabase:', err);
    }
  }, []);

  const updateChatMessages = useCallback(async (chatMessages: AppData['chatMessages']) => {
    setData((prev) => ({ ...prev, chatMessages }));
    try {
      const incomingIds = chatMessages.map(m => parseInt(m.id)).filter(id => id < 1000000000000 && !isNaN(id));
      if (incomingIds.length > 0) {
        await supabase.from('Message').delete().not('id', 'in', `(${incomingIds.join(',')})`);
      } else {
        await supabase.from('Message').delete().neq('id', 0);
      }
      for (const msg of chatMessages) {
        const isNew = parseInt(msg.id) > 1000000000000 || isNaN(parseInt(msg.id));
        const payload = {
          name: msg.sender,
          email: 'guest@example.com',
          subject: 'Guestbook Message',
          message: msg.content,
          likes: msg.likes,
        };
        if (isNew) {
          await supabase.from('Message').insert(payload);
        } else {
          await supabase.from('Message').update(payload).eq('id', parseInt(msg.id));
        }
      }
    } catch (err) {
      console.error('Error syncing ChatMessages update to Supabase:', err);
    }
  }, []);

  const updatePinnedMessage = useCallback(async (pinnedMessage: AppData['pinnedMessage']) => {
    setData((prev) => ({ ...prev, pinnedMessage }));
    try {
      await supabase.from('SiteSettings').upsert({
        key: 'pinned_message',
        value: JSON.stringify(pinnedMessage)
      }, { onConflict: 'key' });
    } catch (err) {
      console.error('Error syncing PinnedMessage update to Supabase:', err);
    }
  }, []);

  const updateSettings = useCallback(async (settings: AppData['settings']) => {
    setData((prev) => ({ ...prev, settings }));
    try {
      const settingsKeys = [
        { key: 'site_title', value: settings.siteTitle },
        { key: 'site_description', value: settings.siteDescription },
        { key: 'admin_password', value: settings.adminPassword },
        { key: 'theme', value: settings.theme },
        { key: 'accent_color', value: settings.primaryColor },
      ];
      for (const item of settingsKeys) {
        await supabase.from('SiteSettings').upsert({
          key: item.key,
          value: item.value
        }, { onConflict: 'key' });
      }
    } catch (err) {
      console.error('Error syncing Settings update to Supabase:', err);
    }
  }, []);

  const updateTechStacks = useCallback(async (techStacks: AppData['techStacks']) => {
    setData((prev) => ({ ...prev, techStacks }));
    try {
      const { data: currentSkills } = await supabase.from('Skill').select('id, name');
      if (currentSkills) {
        const toDelete = currentSkills.filter(s => !techStacks.includes(s.name)).map(s => s.id);
        if (toDelete.length > 0) {
          await supabase.from('Skill').delete().in('id', toDelete);
        }
        const currentNames = currentSkills.map(s => s.name);
        const toInsert = techStacks.filter(name => !currentNames.includes(name));
        for (const name of toInsert) {
          await supabase.from('Skill').insert({
            name,
            category: 'hardskill',
            percentage: 80,
            showOnHome: true
          });
        }
      }
    } catch (err) {
      console.error('Error syncing TechStacks update to Supabase:', err);
    }
  }, []);

  const resetToDefaults = useCallback(() => {
    setData({ ...defaultData });
  }, []);

  return (
    <DataContext.Provider
      value={{
        data,
        loading,
        updateProfile,
        updateExperiences,
        updateEducations,
        updateActivities,
        updateProjects,
        updateBlogPosts,
        updateContacts,
        updateRecommendations,
        updateChatMessages,
        updatePinnedMessage,
        updateSettings,
        updateTechStacks,
        resetToDefaults,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
