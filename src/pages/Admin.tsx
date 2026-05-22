import { useState, useEffect } from 'react';
import { useNavigate, NavLink, Routes, Route } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  User,
  Briefcase,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  X,
  Sun,
  Moon,
  Shield,
  FileText,
  GraduationCap,
  Award,
  Contact,
  Code,
} from 'lucide-react';
import type {
  WorkExperience,
  Education,
  Activity,
  Project,
  BlogPost,
  Contact as ContactType,
  Recommendation,
  ChatMessage,
  Profile,
  PinnedMessage,
  SiteSettings,
} from '@/types';

/* ─── Login Screen ─── */
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const { data } = useData();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === data.settings.adminPassword) {
      localStorage.setItem('admin_authenticated', 'true');
      onLogin();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm p-8 rounded-2xl border border-border bg-card"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Shield size={24} className="text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-xl font-bold text-center mb-1">Admin Panel</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Enter your password to continue
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Password"
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              autoFocus
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Sign In
          </button>
        </form>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Default: admin123
        </p>
      </motion.div>
    </div>
  );
}

/* ─── Dashboard ─── */
function Dashboard() {
  const { data } = useData();
  const stats = [
    { label: 'Projects', value: data.projects.length, icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Blog Posts', value: data.blogPosts.length, icon: BookOpen, color: 'bg-green-500' },
    { label: 'Experiences', value: data.experiences.length, icon: FileText, color: 'bg-purple-500' },
    { label: 'Messages', value: data.chatMessages.length, icon: MessageSquare, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl border border-border bg-card"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg ${stat.color} bg-opacity-15 flex items-center justify-center`}>
                  <Icon size={20} className={stat.color.replace('bg-', 'text-')} />
                </div>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="font-medium">Recent Messages</h3>
        </div>
        <div className="divide-y divide-border">
          {data.chatMessages.slice(-5).reverse().map((msg) => (
            <div key={msg.id} className="px-4 py-3 flex items-center gap-3">
              <img src={msg.avatar} alt={msg.sender} className="w-8 h-8 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{msg.sender}</p>
                <p className="text-xs text-muted-foreground truncate">{msg.content}</p>
              </div>
              <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Profile Editor ─── */
function ProfileEditor() {
  const { data, updateProfile } = useData();
  const [form, setForm] = useState<Profile>({ ...data.profile });

  const handleSave = () => {
    updateProfile(form);
  };

  const fieldClass = "w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20";
  const labelClass = "block text-sm font-medium mb-1";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Edit Profile</h2>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Name</label>
          <input className={fieldClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Title</label>
          <input className={fieldClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input className={fieldClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input className={fieldClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Avatar URL</label>
          <input className={fieldClass} value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>Resume URL</label>
          <input className={fieldClass} value={form.resumeUrl} onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })} />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Bio</label>
          <textarea className={`${fieldClass} min-h-[100px] resize-y`} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
        </div>
        <div>
          <label className={labelClass}>GitHub</label>
          <input className={fieldClass} value={form.socials.github} onChange={(e) => setForm({ ...form, socials: { ...form.socials, github: e.target.value } })} />
        </div>
        <div>
          <label className={labelClass}>LinkedIn</label>
          <input className={fieldClass} value={form.socials.linkedin} onChange={(e) => setForm({ ...form, socials: { ...form.socials, linkedin: e.target.value } })} />
        </div>
        <div>
          <label className={labelClass}>Telegram</label>
          <input className={fieldClass} value={form.socials.telegram} onChange={(e) => setForm({ ...form, socials: { ...form.socials, telegram: e.target.value } })} />
        </div>
        <div>
          <label className={labelClass}>Instagram</label>
          <input className={fieldClass} value={form.socials.instagram} onChange={(e) => setForm({ ...form, socials: { ...form.socials, instagram: e.target.value } })} />
        </div>
      </div>
    </div>
  );
}

/* ─── Experience Editor ─── */
function ExperienceEditor() {
  const { data, updateExperiences } = useData();
  const [items, setItems] = useState<WorkExperience[]>([...data.experiences]);

  const addItem = () => {
    const newItem: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      logo: '/avatar1.jpg',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      type: 'Full-time',
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<WorkExperience>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleSave = () => {
    updateExperiences(items);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Edit Experience</h2>
        <div className="flex gap-2">
          <button onClick={addItem} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Plus size={16} />
            Add
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                placeholder="Company"
                value={item.company}
                onChange={(e) => updateItem(item.id, { company: e.target.value })}
              />
              <input
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                placeholder="Position"
                value={item.position}
                onChange={(e) => updateItem(item.id, { position: e.target.value })}
              />
              <input
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                placeholder="Start Date"
                value={item.startDate}
                onChange={(e) => updateItem(item.id, { startDate: e.target.value })}
              />
              <input
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                placeholder="End Date"
                value={item.endDate}
                onChange={(e) => updateItem(item.id, { endDate: e.target.value })}
              />
              <input
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm"
                placeholder="Type (e.g. Full-time, Freelance)"
                value={item.type}
                onChange={(e) => updateItem(item.id, { type: e.target.value })}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.current}
                  onChange={(e) => updateItem(item.id, { current: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Current</span>
              </div>
              <textarea
                className="md:col-span-2 px-3 py-2 rounded-lg border border-border bg-background text-sm min-h-[60px] resize-y"
                placeholder="Description"
                value={item.description}
                onChange={(e) => updateItem(item.id, { description: e.target.value })}
              />
            </div>
            <div className="flex justify-end">
              <button onClick={() => removeItem(item.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Education Editor ─── */
function EducationEditor() {
  const { data, updateEducations } = useData();
  const [items, setItems] = useState<Education[]>([...data.educations]);

  const addItem = () => {
    const newItem: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      logo: '/avatar1.jpg',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<Education>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleSave = () => {
    updateEducations(items);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Edit Education</h2>
        <div className="flex gap-2">
          <button onClick={addItem} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Plus size={16} />
            Add
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="School" value={item.school} onChange={(e) => updateItem(item.id, { school: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Degree" value={item.degree} onChange={(e) => updateItem(item.id, { degree: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Start Date" value={item.startDate} onChange={(e) => updateItem(item.id, { startDate: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="End Date" value={item.endDate} onChange={(e) => updateItem(item.id, { endDate: e.target.value })} />
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={item.current} onChange={(e) => updateItem(item.id, { current: e.target.checked })} className="rounded" />
                <span className="text-sm">Current</span>
              </div>
              <textarea className="md:col-span-2 px-3 py-2 rounded-lg border border-border bg-background text-sm min-h-[60px] resize-y" placeholder="Description" value={item.description} onChange={(e) => updateItem(item.id, { description: e.target.value })} />
            </div>
            <div className="flex justify-end">
              <button onClick={() => removeItem(item.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Activity Editor ─── */
function ActivityEditor() {
  const { data, updateActivities } = useData();
  const [items, setItems] = useState<Activity[]>([...data.activities]);

  const addItem = () => {
    const newItem: Activity = {
      id: Date.now().toString(),
      title: '',
      organization: '',
      logo: '/avatar1.jpg',
      date: '',
      description: '',
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<Activity>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleSave = () => {
    updateActivities(items);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Edit Activities</h2>
        <div className="flex gap-2">
          <button onClick={addItem} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Plus size={16} />
            Add
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Title" value={item.title} onChange={(e) => updateItem(item.id, { title: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Organization" value={item.organization} onChange={(e) => updateItem(item.id, { organization: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Date" value={item.date} onChange={(e) => updateItem(item.id, { date: e.target.value })} />
              <textarea className="md:col-span-2 px-3 py-2 rounded-lg border border-border bg-background text-sm min-h-[60px] resize-y" placeholder="Description" value={item.description} onChange={(e) => updateItem(item.id, { description: e.target.value })} />
            </div>
            <div className="flex justify-end">
              <button onClick={() => removeItem(item.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Projects Editor ─── */
function ProjectsEditor() {
  const { data, updateProjects } = useData();
  const [items, setItems] = useState<Project[]>([...data.projects]);

  const addItem = () => {
    const newItem: Project = {
      id: Date.now().toString(),
      title: '',
      description: '',
      image: '/project-ci-cd.jpg',
      featured: false,
      link: '#',
      github: '#',
      tags: [],
      category: 'web',
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<Project>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleSave = () => {
    updateProjects(items);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Edit Projects</h2>
        <div className="flex gap-2">
          <button onClick={addItem} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Plus size={16} />
            Add
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Title" value={item.title} onChange={(e) => updateItem(item.id, { title: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Image URL" value={item.image} onChange={(e) => updateItem(item.id, { image: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Live Demo URL" value={item.link} onChange={(e) => updateItem(item.id, { link: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="GitHub URL" value={item.github} onChange={(e) => updateItem(item.id, { github: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Tags (comma separated)" value={item.tags.join(', ')} onChange={(e) => updateItem(item.id, { tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} />
              <select className="px-3 py-2 rounded-lg border border-border bg-background text-sm" value={item.category} onChange={(e) => updateItem(item.id, { category: e.target.value })}>
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="devops">DevOps</option>
              </select>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={item.featured} onChange={(e) => updateItem(item.id, { featured: e.target.checked })} className="rounded" />
                <span className="text-sm">Featured</span>
              </div>
              <textarea className="md:col-span-2 px-3 py-2 rounded-lg border border-border bg-background text-sm min-h-[60px] resize-y" placeholder="Description" value={item.description} onChange={(e) => updateItem(item.id, { description: e.target.value })} />
            </div>
            <div className="flex justify-end">
              <button onClick={() => removeItem(item.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Blog Posts Editor ─── */
function BlogEditor() {
  const { data, updateBlogPosts } = useData();
  const [items, setItems] = useState<BlogPost[]>([...data.blogPosts]);

  const addItem = () => {
    const newItem: BlogPost = {
      id: Date.now().toString(),
      title: '',
      excerpt: '',
      content: '',
      image: '/blog-team.jpg',
      tags: [],
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      featured: false,
      views: 0,
      comments: 0,
      reactions: 0,
      author: data.profile.name,
      authorAvatar: data.profile.avatar,
      readTime: '5 min read',
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<BlogPost>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleSave = () => {
    updateBlogPosts(items);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Edit Blog Posts</h2>
        <div className="flex gap-2">
          <button onClick={addItem} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Plus size={16} />
            Add
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Title" value={item.title} onChange={(e) => updateItem(item.id, { title: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Image URL" value={item.image} onChange={(e) => updateItem(item.id, { image: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Date" value={item.date} onChange={(e) => updateItem(item.id, { date: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Read Time" value={item.readTime} onChange={(e) => updateItem(item.id, { readTime: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Tags (comma separated)" value={item.tags.join(', ')} onChange={(e) => updateItem(item.id, { tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} />
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={item.featured} onChange={(e) => updateItem(item.id, { featured: e.target.checked })} className="rounded" />
                <span className="text-sm">Featured</span>
              </div>
              <input className="md:col-span-2 px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Excerpt" value={item.excerpt} onChange={(e) => updateItem(item.id, { excerpt: e.target.value })} />
              <textarea className="md:col-span-2 px-3 py-2 rounded-lg border border-border bg-background text-sm min-h-[80px] resize-y" placeholder="Content" value={item.content} onChange={(e) => updateItem(item.id, { content: e.target.value })} />
            </div>
            <div className="flex justify-end">
              <button onClick={() => removeItem(item.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Contacts Editor ─── */
function ContactsEditor() {
  const { data, updateContacts } = useData();
  const [items, setItems] = useState<ContactType[]>([...data.contacts]);

  const addItem = () => {
    const newItem: ContactType = {
      id: Date.now().toString(),
      platform: '',
      username: '',
      url: '#',
      icon: 'MessageCircle',
      color: '#000000',
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<ContactType>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleSave = () => {
    updateContacts(items);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Edit Contacts</h2>
        <div className="flex gap-2">
          <button onClick={addItem} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Plus size={16} />
            Add
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Platform" value={item.platform} onChange={(e) => updateItem(item.id, { platform: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Username" value={item.username} onChange={(e) => updateItem(item.id, { username: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="URL" value={item.url} onChange={(e) => updateItem(item.id, { url: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Icon (Github, Linkedin, MessageCircle, Instagram)" value={item.icon} onChange={(e) => updateItem(item.id, { icon: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Color (hex)" value={item.color} onChange={(e) => updateItem(item.id, { color: e.target.value })} type="color" />
            </div>
            <div className="flex justify-end">
              <button onClick={() => removeItem(item.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Recommendations Editor ─── */
function RecommendationsEditor() {
  const { data, updateRecommendations } = useData();
  const [items, setItems] = useState<Recommendation[]>([...data.recommendations]);

  const addItem = () => {
    const newItem: Recommendation = {
      id: Date.now().toString(),
      name: '',
      role: '',
      company: '',
      avatar: '/avatar1.jpg',
      content: '',
      rating: 5,
      date: '2024',
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<Recommendation>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleSave = () => {
    updateRecommendations(items);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Edit Recommendations</h2>
        <div className="flex gap-2">
          <button onClick={addItem} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
            <Plus size={16} />
            Add
          </button>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Save size={16} />
            Save
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Name" value={item.name} onChange={(e) => updateItem(item.id, { name: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Role" value={item.role} onChange={(e) => updateItem(item.id, { role: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Company" value={item.company} onChange={(e) => updateItem(item.id, { company: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Avatar URL" value={item.avatar} onChange={(e) => updateItem(item.id, { avatar: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Date" value={item.date} onChange={(e) => updateItem(item.id, { date: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" type="number" min={1} max={5} placeholder="Rating" value={item.rating} onChange={(e) => updateItem(item.id, { rating: parseInt(e.target.value) || 1 })} />
              <textarea className="md:col-span-2 px-3 py-2 rounded-lg border border-border bg-background text-sm min-h-[60px] resize-y" placeholder="Content" value={item.content} onChange={(e) => updateItem(item.id, { content: e.target.value })} />
            </div>
            <div className="flex justify-end">
              <button onClick={() => removeItem(item.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Chat Messages Editor ─── */
function ChatEditor() {
  const { data, updateChatMessages, updatePinnedMessage } = useData();
  const [items, setItems] = useState<ChatMessage[]>([...data.chatMessages]);
  const [pinned, setPinned] = useState<PinnedMessage>({ ...data.pinnedMessage });

  const addItem = () => {
    const newItem: ChatMessage = {
      id: Date.now().toString(),
      sender: 'Guest',
      content: '',
      timestamp: 'Just now',
      likes: 0,
      avatar: '/avatar1.jpg',
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, updates: Partial<ChatMessage>) => {
    setItems(items.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const handleSave = () => {
    updateChatMessages(items);
    updatePinnedMessage(pinned);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Edit Guestbook</h2>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Save size={16} />
          Save
        </button>
      </div>

      {/* Pinned Message */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="font-medium text-sm">Pinned Message</h3>
        <textarea
          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm min-h-[60px] resize-y"
          placeholder="Pinned message content"
          value={pinned.content}
          onChange={(e) => setPinned({ ...pinned, content: e.target.value })}
        />
      </div>

      {/* Messages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Messages</h3>
          <button onClick={addItem} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
            <Plus size={14} />
            Add Message
          </button>
        </div>
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Sender" value={item.sender} onChange={(e) => updateItem(item.id, { sender: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Timestamp" value={item.timestamp} onChange={(e) => updateItem(item.id, { timestamp: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Avatar URL" value={item.avatar} onChange={(e) => updateItem(item.id, { avatar: e.target.value })} />
              <input className="px-3 py-2 rounded-lg border border-border bg-background text-sm" type="number" placeholder="Likes" value={item.likes} onChange={(e) => updateItem(item.id, { likes: parseInt(e.target.value) || 0 })} />
              <textarea className="md:col-span-2 px-3 py-2 rounded-lg border border-border bg-background text-sm min-h-[60px] resize-y" placeholder="Content" value={item.content} onChange={(e) => updateItem(item.id, { content: e.target.value })} />
            </div>
            <div className="flex justify-end">
              <button onClick={() => removeItem(item.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Tech Stacks Editor ─── */
function TechStacksEditor() {
  const { data, updateTechStacks } = useData();
  const [items, setItems] = useState<string[]>([...data.techStacks]);
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems([...items, newItem.trim()]);
    setNewItem('');
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    updateTechStacks(items);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Edit Tech Stacks</h2>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Save size={16} />
          Save
        </button>
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
          placeholder="Add tech stack..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <button onClick={addItem} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
          <Plus size={16} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-muted text-sm">
            <span>{item}</span>
            <button onClick={() => removeItem(index)} className="ml-1 text-muted-foreground hover:text-red-500 transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Settings Editor ─── */
function SettingsEditor() {
  const { data, updateSettings, resetToDefaults } = useData();
  const [form, setForm] = useState<SiteSettings>({ ...data.settings });
  const [showReset, setShowReset] = useState(false);

  const handleSave = () => {
    updateSettings(form);
  };

  const handleReset = () => {
    resetToDefaults();
    setShowReset(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Site Settings</h2>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Save size={16} />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Site Title</label>
          <input className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" value={form.siteTitle} onChange={(e) => setForm({ ...form, siteTitle: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Site Description</label>
          <input className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" value={form.siteDescription} onChange={(e) => setForm({ ...form, siteDescription: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Admin Password</label>
          <input type="password" className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" value={form.adminPassword} onChange={(e) => setForm({ ...form, adminPassword: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Default Theme</label>
          <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" value={form.theme} onChange={(e) => setForm({ ...form, theme: e.target.value as 'light' | 'dark' | 'system' })}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Primary Color</label>
          <div className="flex gap-2">
            <input type="color" className="w-10 h-10 rounded-lg border border-border" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} />
            <input className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-8 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 p-4">
        <h3 className="font-medium text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4">
          Reset all data to default values. This action cannot be undone.
        </p>
        {!showReset ? (
          <button onClick={() => setShowReset(true)} className="px-4 py-2 rounded-lg border border-red-300 dark:border-red-800 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
            Reset to Defaults
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleReset} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">
              Confirm Reset
            </button>
            <button onClick={() => setShowReset(false)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Admin Layout ─── */
export default function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.removeItem('admin_authenticated');
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
    navigate('/admin');
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  const sidebarItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/profile', label: 'Profile', icon: User },
    { path: '/admin/experience', label: 'Experience', icon: Briefcase },
    { path: '/admin/education', label: 'Education', icon: GraduationCap },
    { path: '/admin/activities', label: 'Activities', icon: Award },
    { path: '/admin/projects', label: 'Projects', icon: Code },
    { path: '/admin/blogs', label: 'Blogs', icon: BookOpen },
    { path: '/admin/contacts', label: 'Contacts', icon: Contact },
    { path: '/admin/recommendations', label: 'Recommendations', icon: MessageSquare },
    { path: '/admin/chats', label: 'Guestbook', icon: MessageSquare },
    { path: '/admin/techstacks', label: 'Tech Stacks', icon: Code },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-background/80 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <NavLink to="/" className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <ArrowLeft size={18} />
          </NavLink>
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield size={16} className="text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">Admin Panel</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors">
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Admin Sidebar + Content */}
      <div className="pt-14 flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r border-border bg-muted/30 overflow-y-auto">
          <nav className="flex-1 p-3 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`
                  }
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 flex overflow-x-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 text-xs whitespace-nowrap transition-colors ${
                    isActive ? 'text-primary font-medium border-t-2 border-primary' : 'text-muted-foreground'
                  }`
                }
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-20 md:pb-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<ProfileEditor />} />
            <Route path="/experience" element={<ExperienceEditor />} />
            <Route path="/education" element={<EducationEditor />} />
            <Route path="/activities" element={<ActivityEditor />} />
            <Route path="/projects" element={<ProjectsEditor />} />
            <Route path="/blogs" element={<BlogEditor />} />
            <Route path="/contacts" element={<ContactsEditor />} />
            <Route path="/recommendations" element={<RecommendationsEditor />} />
            <Route path="/chats" element={<ChatEditor />} />
            <Route path="/techstacks" element={<TechStacksEditor />} />
            <Route path="/settings" element={<SettingsEditor />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
