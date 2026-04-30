'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { ArrowUpRight, Zap, Menu, X, Globe as GlobeIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const mainLinks = [
  { name: 'Beranda', href: '/' },
  { name: 'Proyek', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'Gallery', href: '/gallery' },
];

const moreLinks = [
  { name: 'Pendidikan', href: '/education' },
  { name: 'Penghargaan', href: '/awards' },
  { name: 'Publikasi', href: '/publications' },
  { name: 'Organisasi', href: '/organizations' },
];

const allLinks = [...mainLinks, ...moreLinks, { name: 'Produktif', href: '/produktif' }, { name: 'Kontak', href: '/#kontak' }];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { t, lang, toggleLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-2 md:py-4' : 'py-4 md:py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className={`flex items-center justify-between px-4 md:px-6 py-2.5 md:py-3 rounded-full transition-all ${scrolled || isOpen ? 'glass shadow-2xl' : 'bg-transparent border-transparent'}`}>
          {/* Logo */}
          <Link href="/" className="text-lg md:text-xl font-black font-outfit tracking-tighter group z-[110]">
            RIDHO
            <span className="text-accent-gradient group-hover:text-indigo-500 transition-colors">PASII.</span>
          </Link>

          <div className="hidden lg:flex items-center gap-6">
            {mainLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">
                {t(`nav.${link.name.toLowerCase()}`)}
              </Link>
            ))}
            
            {/* More Dropdown */}
            <div className="relative group">
              <button className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all flex items-center gap-1 py-2">
                Pencapaian <ChevronDown size={12} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300">
                <div className="bg-background border border-[var(--border-subtle)] rounded-2xl p-2 w-48 shadow-2xl flex flex-col gap-1">
                  {moreLinks.map(link => (
                    <Link key={link.name} href={link.href} className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-muted/50 px-4 py-3 rounded-xl transition-all">
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/#kontak" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">
              Kontak
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-6 z-[110]">
            <div className="hidden md:flex gap-2">
              <button 
                onClick={toggleLanguage}
                className="p-2.5 bg-white/5 rounded-full text-muted-foreground hover:text-accent border border-[var(--border-subtle)] hover:bg-accent/10 transition-all font-bold text-xs uppercase"
              >
                {lang}
              </button>
              <ThemeToggle />
            </div>
            
            <Link 
              href="/produktif" 
              className="p-2.5 bg-white/5 rounded-full text-foreground border border-[var(--border-subtle)] hover:bg-accent hover:text-black hover:scale-110 active:scale-90 transition-all flex items-center justify-center group"
              title="Productivity Dashboard"
            >
              <Zap size={18} className="group-hover:fill-current" />
            </Link>

            <Link href="/#kontak" className="hidden md:flex bg-accent-gradient text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all items-center gap-2 group shadow-lg shadow-accent/20">
              Talk
              <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
            </Link>
            
            {/* Mobile Toggle */}
            <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu" className="p-2.5 bg-white/5 rounded-full text-foreground md:hidden border border-[var(--border-subtle)] active:scale-90 transition-transform">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 bg-background z-[90] flex flex-col pt-32 px-10 gap-8 md:hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent opacity-30" />
            <div className="flex-1 overflow-y-auto hide-scrollbar space-y-4">
              {allLinks.map((link, i) => (
                <motion.div key={link.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <Link onClick={() => setIsOpen(false)} href={link.href} className="text-3xl font-black italic uppercase tracking-tighter hover:text-accent transition-colors flex items-center justify-between group py-2">
                    {link.name}
                    <ChevronRight size={24} className="text-muted-foreground/30 group-hover:text-accent" />
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-auto pb-20 flex justify-between items-center border-t border-[var(--border-subtle)] pt-10">
              <ThemeToggle />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">© 2026 Ridho Pasii</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

import { ChevronRight, ChevronDown } from 'lucide-react';
