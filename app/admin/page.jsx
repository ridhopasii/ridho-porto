import { createClient } from '@/utils/supabase/server';
import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';
import {
  Folders,
  MessageSquare,
  Cpu,
  Briefcase,
  GraduationCap,
  Trophy,
  FileText,
  Users,
  Image as ImageIcon,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Eye,
  Mail,
} from 'lucide-react';

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: projectCount, data: projectsHome },
    { count: messageCount, data: recentMessages },
    { count: unreadCount },
    { count: skillCount },
    { count: expCount },
    { count: eduCount },
    { count: awardCount },
    { count: pubCount },
    { count: orgCount },
    { count: galleryCount },
    { count: blogCount, data: blogsHome },
  ] = await Promise.all([
    supabase.from('Project').select('showOnHome', { count: 'exact' }),
    supabase
      .from('Message')
      .select('name, email, subject, createdAt, isRead', { count: 'exact' })
      .order('createdAt', { ascending: false })
      .limit(5),
    supabase.from('Message').select('*', { count: 'exact', head: true }).eq('isRead', false),
    supabase.from('Skill').select('*', { count: 'exact', head: true }),
    supabase.from('Experience').select('*', { count: 'exact', head: true }),
    supabase.from('Education').select('*', { count: 'exact', head: true }),
    supabase.from('Award').select('*', { count: 'exact', head: true }),
    supabase.from('Publication').select('*', { count: 'exact', head: true }),
    supabase.from('Organization').select('*', { count: 'exact', head: true }),
    supabase.from('Gallery').select('*', { count: 'exact', head: true }),
    supabase.from('Article').select('showOnHome', { count: 'exact' }),
  ]);

  const projectsOnHome = projectsHome?.filter((p) => p.showOnHome !== false).length || 0;
  const blogsOnHome = blogsHome?.filter((b) => b.showOnHome !== false).length || 0;

  const stats = [
    {
      label: 'Proyek',
      value: projectCount || 0,
      icon: <Folders size={22} />,
      color: 'blue',
      href: '/admin/projects',
    },
    {
      label: 'Blog',
      value: blogCount || 0,
      icon: <BookOpen size={22} />,
      color: 'blue',
      href: '/admin/blogs',
    },
    {
      label: 'Skill',
      value: skillCount || 0,
      icon: <Cpu size={22} />,
      color: 'purple',
      href: '/admin/skills',
    },
    {
      label: 'Pengalaman',
      value: expCount || 0,
      icon: <Briefcase size={22} />,
      color: 'green',
      href: '/admin/experience',
    },
    {
      label: 'Pendidikan',
      value: eduCount || 0,
      icon: <GraduationCap size={22} />,
      color: 'yellow',
      href: '/admin/education',
    },
    {
      label: 'Penghargaan',
      value: awardCount || 0,
      icon: <Trophy size={22} />,
      color: 'orange',
      href: '/admin/awards',
    },
    {
      label: 'Publikasi',
      value: pubCount || 0,
      icon: <FileText size={22} />,
      color: 'pink',
      href: '/admin/publications',
    },
    {
      label: 'Organisasi',
      value: orgCount || 0,
      icon: <Users size={22} />,
      color: 'indigo',
      href: '/admin/organizations',
    },
    {
      label: 'Galeri',
      value: galleryCount || 0,
      icon: <ImageIcon size={22} />,
      color: 'rose',
      href: '/admin/gallery',
    },
    {
      label: 'Pesan',
      value: messageCount || 0,
      icon: <MessageSquare size={22} />,
      color: 'red',
      href: '/admin/messages',
    },
  ];

  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    green: 'bg-green-500/10 text-green-500 border-green-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    orange: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    pink: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    rose: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    red: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex font-jakarta">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black font-outfit uppercase tracking-tight">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">
              Selamat datang kembali, <span className="text-blue-500 font-bold">Ridho</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="px-5 py-2.5 bg-white/5 border border-[var(--border-subtle)] rounded-xl text-xs font-bold text-gray-400 hover:text-blue-500 hover:border-blue-500/30 transition-all flex items-center gap-2"
            >
              <Eye size={14} /> Lihat Website
            </Link>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-black text-black shadow-lg shadow-blue-500/20">
              R
            </div>
          </div>
        </header>

        {/* Quick Status Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-blue-500 text-black rounded-2xl">
              <Folders size={24} />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{projectsOnHome}</p>
              <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">
                Proyek di Home
              </p>
            </div>
          </div>

          <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-center gap-4">
            <div className="p-3 bg-blue-500 text-foreground rounded-2xl">
              <BookOpen size={24} />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{blogsOnHome}</p>
              <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">
                Blog di Home
              </p>
            </div>
          </div>

          <div
            className={`p-6 border rounded-3xl flex items-center gap-4 transition-all ${unreadCount > 0 ? 'bg-red-500/20 border-red-500/40 animate-pulse' : 'bg-white/5 border-[var(--border-subtle)]'}`}
          >
            <div
              className={`p-3 rounded-2xl ${unreadCount > 0 ? 'bg-red-500 text-foreground' : 'bg-gray-500/20 text-gray-500'}`}
            >
              <MessageSquare size={24} />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{unreadCount}</p>
              <p
                className={`text-[10px] font-bold uppercase tracking-widest ${unreadCount > 0 ? 'text-red-500' : 'text-gray-500'}`}
              >
                Pesan Baru
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className={`p-5 bg-white/5 border border-[var(--border-subtle)] rounded-2xl hover:border-blue-500/20 transition-all group`}
            >
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${colorMap[stat.color]} transition-all group-hover:scale-110`}
              >
                {stat.icon}
              </div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-black text-foreground">{stat.value}</p>
            </Link>
          ))}
        </div>

        {/* Recent Messages + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Messages */}
          <div className="p-6 bg-white/5 border border-[var(--border-subtle)] rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-foreground flex items-center gap-2">
                <MessageSquare size={18} className="text-blue-500" /> Pesan Terbaru
              </h2>
              <Link
                href="/admin/messages"
                className="text-[10px] text-blue-500 font-bold uppercase tracking-widest hover:text-blue-400 flex items-center gap-1"
              >
                Lihat Semua <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-4">
              {recentMessages && recentMessages.length > 0 ? (
                recentMessages.map((msg, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5"
                  >
                    <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 text-xs font-black flex-shrink-0">
                      {msg.name?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{msg.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">
                        {msg.subject || msg.email}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-sm italic text-center py-4">
                  Belum ada pesan masuk.
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 bg-white/5 border border-[var(--border-subtle)] rounded-3xl">
            <h2 className="font-bold text-foreground flex items-center gap-2 mb-6">
              <TrendingUp size={18} className="text-blue-500" /> Aksi Cepat
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: 'Tambah Proyek',
                  href: '/admin/projects',
                  color: 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 text-blue-400',
                },
                {
                  label: 'Tulis Artikel',
                  href: '/admin/blogs',
                  color: 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 text-blue-400',
                },
                {
                  label: 'Tambah Skill',
                  href: '/admin/skills',
                  color:
                    'bg-purple-500/10 border-purple-500/20 hover:bg-purple-500/20 text-purple-400',
                },
                {
                  label: 'Upload Galeri',
                  href: '/admin/gallery',
                  color: 'bg-pink-500/10 border-pink-500/20 hover:bg-pink-500/20 text-pink-400',
                },
                {
                  label: 'Edit Profil',
                  href: '/admin/profile',
                  color:
                    'bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20 text-orange-400',
                },
                {
                  label: 'Lihat Pesan',
                  href: '/admin/messages',
                  color: 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400',
                },
              ].map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className={`p-4 rounded-xl border ${action.color} transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-between`}
                >
                  {action.label}
                  <ArrowRight size={12} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
