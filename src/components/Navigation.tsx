import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { useState } from 'react';
import {
  Home,
  FileText,
  Briefcase,
  BookOpen,
  MessageSquare,
  Mail,
  Sun,
  Moon,
  Shield,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/resume', label: 'Resume', icon: FileText },
  { path: '/projects', label: 'Projects', icon: Briefcase },
  { path: '/blogs', label: 'Blogs', icon: BookOpen },
  { path: '/contacts', label: 'Contacts', icon: Mail },
  { path: '/chats', label: 'Chats', icon: MessageSquare },
];

export default function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const { data } = useData();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const profile = data.profile;
  const nameInitial = profile.name ? profile.name.charAt(0).toUpperCase() : 'R';
  const siteDomain = profile.email && profile.email.includes('@')
    ? profile.email.split('@')[1]
    : 'ridhorobbipasi.my.id';

  const isAdminPage = location.pathname.startsWith('/admin');
  if (isAdminPage) return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[240px] flex-col border-r border-border bg-background z-50">
        <div className="p-6">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">{nameInitial}</span>
            </div>
            <div>
              <h1 className="font-semibold text-sm">{profile.name}</h1>
              <p className="text-xs text-muted-foreground">{siteDomain}</p>
            </div>
          </NavLink>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 space-y-2">
          <NavLink
            to="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Shield size={18} />
            <span>Admin Panel</span>
          </NavLink>
          <button
            onClick={toggleTheme}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-50 flex items-center justify-between px-4">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">{nameInitial}</span>
          </div>
          <span className="font-semibold text-sm">{siteDomain}</span>
        </NavLink>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-background z-40 p-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`
                  }
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Shield size={20} />
              <span>Admin Panel</span>
            </NavLink>
          </nav>
        </div>
      )}
    </>
  );
}
