'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { ArrowUpRight } from 'lucide-react';

const navLinks = [
  { name: 'Beranda', href: '/' },
  { name: 'Tentang', href: '/#tentang' },
  { name: 'Pengalaman', href: '/experience' },
  { name: 'Pendidikan', href: '/education' },
  { name: 'Proyek', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'Galeri', href: '/gallery' },
  { name: 'Kontak', href: '/#kontak' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-4' : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div
          className={`flex items-center justify-between px-6 py-3 rounded-full border transition-all ${
            scrolled
              ? 'bg-black/60 backdrop-blur-xl border-white/10 shadow-lg'
              : 'bg-transparent border-transparent'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="text-xl font-bold font-outfit tracking-tighter group">
            RIDHO
            <span className="text-teal-500 group-hover:text-purple-500 transition-colors">
              PASII.
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-6">
            <ThemeToggle />
            <Link
              href="/#kontak"
              className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-teal-500 hover:text-white transition-all flex items-center gap-2 group"
            >
              Let's Talk
              <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
