'use client';
import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollUtils() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
      setShowBackToTop(scrollTop > 500);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-100 shadow-[0_0_10px_rgba(20,184,166,0.5)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 bg-teal-500 text-black rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/30 hover:scale-110 active:scale-95 transition-all duration-300 ${
          showBackToTop
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Kembali ke atas"
      >
        <ArrowUp size={20} strokeWidth={3} />
      </button>
    </>
  );
}
