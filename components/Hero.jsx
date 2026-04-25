'use client'
import { useState, useEffect } from 'react'
import { CodeXml, Briefcase, Mail, ArrowRight, ExternalLink } from 'lucide-react'

export default function Hero({ profile }) {
  const [text, setText] = useState('')
  const fullText = profile?.title || 'TechnoPreneur'
  
  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      setText(fullText.substring(0, i))
      i++
      if (i > fullText.length) clearInterval(timer)
    }, 100)
    return () => clearInterval(timer)
  }, [fullText])

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 relative overflow-hidden bg-[#0a0a0a]">
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        {/* Profile Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in-up">
          <span className="w-2 h-2 bg-teal-500 rounded-full pulse-ring"></span>
          <span className="text-sm text-gray-400 font-medium tracking-wider uppercase">Available for projects</span>
        </div>

        {/* Name */}
        <h1 className="text-6xl md:text-8xl font-black font-outfit mb-6 tracking-tight">
          <span className="text-white">I'm </span>
          <span className="gradient-text-animated">{profile?.fullName || 'Ridho Robbi Pasi'}</span>
        </h1>

        {/* Title / Typing Effect */}
        <div className="h-12 mb-8">
          <p className="text-2xl md:text-3xl text-gray-400 font-jakarta font-light italic">
            {text}<span className="text-teal-500 animate-pulse">|</span>
          </p>
        </div>

        {/* Bio */}
        <p className="max-w-2xl mx-auto text-lg text-gray-500 mb-12 leading-relaxed">
          {profile?.bio || 'Building the future of tech with innovative solutions and elegant design.'}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-black font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group shadow-lg shadow-teal-500/20">
            View My Projects
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
            Let's Talk
            <Mail size={20} />
          </button>
        </div>

        {/* Social Links */}
        <div className="mt-16 flex gap-6 justify-center">
          {[
            { icon: <CodeXml size={24} />, href: '#' },
            { icon: <Briefcase size={24} />, href: '#' },
            { icon: <ExternalLink size={24} />, href: '#' }
          ].map((social, idx) => (
            <a key={idx} href={social.href} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-teal-500 hover:border-teal-500 transition-all hover:-translate-y-1">
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
