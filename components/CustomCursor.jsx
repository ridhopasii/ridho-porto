'use client';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const updateCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleHover = (e) => {
      if (
        ['A', 'BUTTON', 'INPUT', 'TEXTAREA'].includes(e.target.tagName) ||
        e.target.closest('button') ||
        e.target.closest('a')
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('mouseover', handleHover);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mouseover', handleHover);
    };
  }, []);

  return (
    <>
      <div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-white/20 pointer-events-none z-[9999] transition-transform duration-300 ease-out flex items-center justify-center"
        style={{
          transform: `translate(${position.x - 16}px, ${position.y - 16}px) scale(${hovered ? 1.8 : 1})`,
          backgroundColor: hovered ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent',
          borderColor: hovered ? 'var(--accent)' : 'rgba(255, 255, 255, 0.2)',
        }}
      >
        <div className="w-1 h-1 bg-white rounded-full" />
      </div>
      <div
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] transition-all duration-100 ease-out"
        style={{
          transform: `translate(${position.x - 4}px, ${position.y - 4}px)`,
          backgroundColor: 'var(--accent)',
          boxShadow: '0 0 10px var(--accent)',
        }}
      />
    </>
  );
}
