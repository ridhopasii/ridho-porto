'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import PhotoSwiper from './PhotoSwiper';
import Magnetic from './Magnetic';
import {
  Globe,
  Share2,
  MessageCircle,
  ArrowRight,
  Mail,
  Users,
  Link as LinkIcon,
  Download,
} from 'lucide-react';

export default function Hero({ profile }) {
  const [text, setText] = useState('');
  const fullText = profile?.title || 'TechnoPreneur';

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 100);
    return () => clearInterval(timer);
  }, [fullText]);

  return (
    <section className="min-h-screen flex items-center justify-center pt-32 pb-20 relative overflow-hidden bg-background">
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-teal-500/10 rounded-full blur-[140px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[140px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Profile Photo */}
          <div className="relative mb-12 animate-fade-in-up">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-teal-500/30 p-2 bg-gradient-to-tr from-teal-500/20 to-transparent">
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-teal-500">
                {(() => {
                  // Parse images: bisa array JSONB atau string JSON dari DB
                  let imgs = profile?.images;
                  if (typeof imgs === 'string') {
                    try { imgs = JSON.parse(imgs); } catch { imgs = []; }
                  }
                  const validImgs = Array.isArray(imgs) ? imgs.filter(Boolean) : [];
                  // Fallback chain: images[] → avatarUrl → placeholder abu-abu
                  const finalImgs = validImgs.length > 0
                    ? validImgs
                    : profile?.avatarUrl
                    ? [profile.avatarUrl]
                    : [];
                  
                  if (finalImgs.length === 0) {
                    return (
                      <div className="w-full h-full bg-gradient-to-br from-teal-500/20 to-teal-900/40 flex items-center justify-center">
                        <Users className="w-16 h-16 text-teal-500/50" />
                      </div>
                    );
                  }
                  return (
                    <PhotoSwiper
                      images={finalImgs}
                      aspectRatio="aspect-square"
                      rounded="rounded-full"
                    />
                  );
                })()}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-teal-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-teal-500/40">
              {profile?.badge || 'Duta Pemuda Global'}
            </div>
          </div>

          {/* Profile Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-[var(--border-subtle)] mb-8 animate-fade-in-up">
            <span className="w-2 h-2 bg-teal-500 rounded-full pulse-ring"></span>
            <span className="text-[10px] text-teal-500 font-black tracking-[0.2em] uppercase">
              {profile?.status_text || 'Open for collaborations'}
            </span>
          </div>

          {/* Name */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black font-outfit mb-6 tracking-tighter leading-[1.1]">
            <span className="text-foreground">HI, I'M </span>
            <span className="text-teal-500">
              {(profile?.fullName || profile?.name)?.toUpperCase() || 'RIDHO ROBBI PASI'}
            </span>
          </h1>

          {/* Title / Typing Effect */}
          <div className="h-10 mb-8">
            <p className="text-xl md:text-2xl text-muted-foreground font-medium tracking-wide">
              {text}
              <span className="text-teal-500 animate-pulse">|</span>
            </p>
          </div>

          {/* Bio */}
          <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground/80 mb-12 leading-relaxed font-medium">
            {profile?.bio ||
              'Building the future of tech with innovative solutions and elegant design.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full px-4">
            <Magnetic>
              <Link
                href="/#proyek"
                className="w-full sm:w-auto px-10 py-5 bg-teal-500 hover:bg-teal-400 text-black font-black rounded-2xl transition-all hover:scale-105 flex items-center justify-center gap-2 group shadow-xl shadow-teal-500/20 text-xs uppercase tracking-widest"
              >
                View Portfolio
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Magnetic>

            {profile?.cvLink && (
              <Magnetic>
                <a
                  href={profile.cvLink}
                  target="_blank"
                  className="w-full sm:w-auto px-10 py-5 bg-white text-black font-black rounded-2xl transition-all hover:scale-105 flex items-center justify-center gap-2 group shadow-xl shadow-white/10 text-xs uppercase tracking-widest"
                >
                  Download CV
                  <Download size={18} className="group-hover:translate-y-1 transition-transform" />
                </a>
              </Magnetic>
            )}
          </div>

          {/* Social Links */}
          <div className="mt-16 md:mt-20 flex flex-wrap gap-3 md:gap-4 justify-center">
            {[
              {
                icon: <Users size={18} />,
                href: profile?.github_url,
                active: !!profile?.github_url,
              },
              {
                icon: <LinkIcon size={18} />,
                href: profile?.linkedin_url,
                active: !!profile?.linkedin_url,
              },
              {
                icon: <Globe size={18} />,
                href: profile?.instagram_url,
                active: !!profile?.instagram_url,
              },
              {
                icon: <Share2 size={18} />,
                href: profile?.twitter_url,
                active: !!profile?.twitter_url,
              },
              {
                icon: <MessageCircle size={18} />,
                href: `https://wa.me/${profile?.phone}`,
                active: !!profile?.phone,
              },
              {
                icon: <Mail size={18} />,
                href: `mailto:${profile?.email}`,
                active: !!profile?.email,
              },
            ]
              .filter((s) => s.active)
              .map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl md:rounded-2xl bg-white/5 border border-[var(--border-subtle)] text-muted-foreground hover:text-teal-500 hover:border-teal-500 transition-all hover:-translate-y-2 active:scale-90"
                >
                  {social.icon}
                </a>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
