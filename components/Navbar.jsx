'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { ArrowUpRight, Zap, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Tentang', href: '/#tentang' },
  { name: 'Proyek', href: '/projects' },
  { name: 'Timeline', href: '/experience' },
  { name: 'Blog', href: '/blogs' },
  { name: 'Produktif', href: '/produktif' },
  { name: 'Kontak', href: '/#kontak' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-2 md:py-4' : 'py-4 md:py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className={`flex items-center justify-between px-4 md:px-6 py-2.5 md:py-3 rounded-full border transition-all ${scrolled || isOpen ? 'bg-black/80 backdrop-blur-2xl border-white/10 shadow-2xl' : 'bg-transparent border-transparent'}`}>
          {/* Logo */}
          <Link href="/" className="text-lg md:text-xl font-black font-outfit tracking-tighter group z-[110]">
            RIDHO
            <span className="text-teal-500 group-hover:text-purple-500 transition-colors">PASII.</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-6 z-[110]">
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <Link href="/#kontak" className="hidden md:flex bg-white text-black px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-teal-500 hover:text-white transition-all items-center gap-2 group">
              Talk
              <ArrowUpRight size={14} className="group-hover:rotate-45 transition-transform" />
            </Link>
            
            {/* Mobile Toggle */}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2.5 bg-white/5 rounded-full text-white md:hidden border border-white/10 active:scale-90 transition-transform">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 bg-black z-[90] flex flex-col pt-32 px-10 gap-8 md:hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-teal-500/10 to-transparent opacity-30" />
            {navLinks.map((link, i) => (
              <motion.div key={link.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <Link onClick={() => setIsOpen(false)} href={link.href} className="text-4xl font-black italic uppercase tracking-tighter hover:text-teal-500 transition-colors flex items-center justify-between group">
                  {link.name}
                  <ChevronRight size={24} className="text-gray-800 group-hover:text-teal-500" />
                </Link>
              </motion.div>
            ))}
            <div className="mt-auto pb-20 flex justify-between items-center border-t border-white/5 pt-10">
              <ThemeToggle />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">© 2026 Ridho Pasii</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

import { ChevronRight } from 'lucide-react';
