'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
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
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} />, href: '/admin' },
  { name: 'Profil', icon: <UserCircle size={20} />, href: '/admin/profile' },
  { name: 'Proyek', icon: <Folders size={20} />, href: '/admin/projects' },
  { name: 'Blog', icon: <BookOpen size={20} />, href: '/admin/blogs' },
  { name: 'Keterampilan', icon: <Cpu size={20} />, href: '/admin/skills' },
  { name: 'Pengalaman', icon: <Briefcase size={20} />, href: '/admin/experience' },
  { name: 'Pendidikan', icon: <GraduationCap size={20} />, href: '/admin/education' },
  { name: 'Penghargaan', icon: <Trophy size={20} />, href: '/admin/awards' },
  { name: 'Publikasi', icon: <FileText size={20} />, href: '/admin/publications' },
  { name: 'Organisasi', icon: <Users size={20} />, href: '/admin/organizations' },
  { name: 'Galeri', icon: <ImageIcon size={20} />, href: '/admin/gallery' },
  { name: 'Pesan', icon: <MessageSquare size={20} />, href: '/admin/messages' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="w-64 border-r border-white/5 bg-black/50 backdrop-blur-xl p-6 hidden lg:flex flex-col sticky top-0 h-screen">
      <div className="mb-10">
        <div className="text-xl font-bold font-outfit tracking-tighter mb-1">
          RIDHO<span className="text-teal-500">ADMIN.</span>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-[10px] text-gray-600 hover:text-teal-500 transition-colors font-bold uppercase tracking-widest"
        >
          <ExternalLink size={10} /> Lihat Website
        </Link>
      </div>

      <nav className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {menuItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-teal-500 text-black font-bold shadow-lg shadow-teal-500/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl w-full transition-all text-sm font-medium"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
