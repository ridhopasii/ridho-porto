'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import {
  LayoutDashboard,
  Folders,
  UserCircle,
  MessageSquare,
  Cpu,
  Briefcase,
  GraduationCap,
  Trophy,
  FileText,
  LogOut,
  BookOpen,
  Users,
  Image as ImageIcon,
  ExternalLink,
  Menu,
  X,
  Settings,
  Database,
  ClipboardList,
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/admin' },
  { name: 'Profil', icon: <UserCircle size={20} />, href: '/admin/profile' },
  { name: 'Proyek', icon: <Folders size={20} />, href: '/admin/projects' },
  { name: 'Blog', icon: <BookOpen size={20} />, href: '/admin/blogs' },
  { name: 'Manajemen Tugas', icon: <ClipboardList size={20} />, href: '/admin/productivity' },
  { name: 'Database', icon: <Database size={20} />, href: '/admin/database' },
  { name: 'Keterampilan', icon: <Cpu size={20} />, href: '/admin/skills' },
  { name: 'Pengalaman', icon: <Briefcase size={20} />, href: '/admin/experience' },
  { name: 'Pendidikan', icon: <GraduationCap size={20} />, href: '/admin/education' },
  { name: 'Penghargaan', icon: <Trophy size={20} />, href: '/admin/awards' },
  { name: 'Publikasi', icon: <FileText size={20} />, href: '/admin/publications' },
  { name: 'Organisasi', icon: <Users size={20} />, href: '/admin/organizations' },
  { name: 'Galeri', icon: <ImageIcon size={20} />, href: '/admin/gallery' },
  { name: 'Pesan', icon: <MessageSquare size={20} />, href: '/admin/messages' },
  { name: 'Pengaturan', icon: <Settings size={20} />, href: '/admin/settings' },
];

function SidebarContent({ pathname, onClose }) {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState(0);

  useState(() => {
    const fetchUnread = async () => {
      const supabase = createClient();
      const { count } = await supabase
        .from('Message')
        .select('*', { count: 'exact', head: true })
        .eq('isRead', false);
      setUnreadCount(count || 0);
    };
    fetchUnread();

    // Subscribe to new messages
    const supabase = createClient();
    const channel = supabase
      .channel('unread-messages')
      .on('postgres_changes', { event: '*', table: 'Message', schema: 'public' }, fetchUnread)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <div className="text-xl font-bold font-outfit tracking-tighter mb-1">
            RIDHO<span className="text-accent">ADMIN.</span>
          </div>
          <Link
            href="/"
            target="_blank"
            onClick={onClose}
            className="flex items-center gap-1.5 text-[10px] text-gray-600 hover:text-accent transition-colors font-bold uppercase tracking-widest"
          >
            <ExternalLink size={10} /> Lihat Website
          </Link>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-foreground hover:bg-white/10 rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav Links */}
      <nav className="space-y-1 flex-1 overflow-y-auto pr-1">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-accent text-black font-bold shadow-lg shadow-accent/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </div>
              {item.name === 'Pesan' && unreadCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 text-foreground text-[10px] font-black rounded-full shadow-lg shadow-red-500/30 animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-6 border-t border-[var(--border-subtle)]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl w-full transition-all text-sm font-medium"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger Toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-background/80 backdrop-blur-xl border border-[var(--border-subtle)] rounded-2xl text-foreground shadow-xl hover:border-accent/30 transition-all"
        aria-label="Buka menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/70 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-in Drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-[#090909] border-r border-[var(--border-subtle)] p-6 z-50 transition-transform duration-300 ease-in-out overflow-y-auto ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent pathname={pathname} onClose={() => setMobileOpen(false)} />
      </aside>

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-[var(--border-subtle)] bg-background/50 backdrop-blur-xl p-6 flex-col sticky top-0 h-screen flex-shrink-0">
        <SidebarContent pathname={pathname} onClose={null} />
      </aside>
    </>
  );
}
