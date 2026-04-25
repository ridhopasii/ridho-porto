'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const navLinks = [
  { name: 'Beranda', href: '/' },
  { name: 'Tentang', href: '#tentang' },
  { name: 'Proyek', href: '#proyek' },
  { name: 'Keterampilan', href: '#keterampilan' },
  { name: 'Kontak', href: '#kontak' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'py-4' : 'py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex items-center justify-between px-6 py-3 rounded-full border transition-all ${
          scrolled 
            ? 'bg-black/60 backdrop-blur-xl border-white/10 shadow-lg' 
            : 'bg-transparent border-transparent'
        }`}>
          {/* Logo */}
          <Link href="/" className="text-xl font-bold font-outfit tracking-tighter group">
            RIDHO<span className="text-teal-500 group-hover:text-purple-500 transition-colors">PASII.</span>
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
          <Link 
            href="/admin" 
            className="px-5 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-teal-500 hover:text-white transition-all active:scale-95"
          >
            PANEL ADMIN
          </Link>
        </div>
      </div>
    </nav>
  )
}
