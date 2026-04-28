'use client'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Cek preferensi awal
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'light') {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    } else {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else {
      setIsDark(true)
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-full bg-white/5 border border-[var(--border-subtle)] hover:border-accent/50 hover:bg-accent/10 text-gray-400 hover:text-accent transition-all duration-300"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun size={18} className="animate-in fade-in zoom-in duration-300" />
      ) : (
        <Moon size={18} className="animate-in fade-in zoom-in duration-300 text-accent" />
      )}
    </button>
  )
}
