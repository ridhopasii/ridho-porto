"use client";

import { createClient } from "@/common/utils/client";

import { useEffect, useMemo, useState, useRef } from "react";
import { m as motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {
  MdLocationOn as LocationIcon,
} from "react-icons/md";
import {
  BsGithub as GithubIcon,
  BsInstagram as InstagramIcon,
  BsLinkedin as LinkedinIcon,
} from "react-icons/bs";
import { HiOutlineExternalLink, HiChevronLeft, HiChevronRight } from "react-icons/hi";

import useSWR from "swr";
import { fetcher } from "@/services/fetcher";
import { PageContentMap, readPageContent } from "@/common/libs/page-content";

import RotatingText from "@/common/components/elements/RotatingText";

interface HeroSectionProps {
  content?: PageContentMap;
}

const HeroSection = ({ content }: HeroSectionProps) => {
  const t = useTranslations("HomePage");
  const { data: profile, mutate } = useSWR("/api/profile", fetcher);
  const { data: socialsData } = useSWR("/api/admin/social", fetcher);
  const { data: galleryData } = useSWR("/api/admin/gallery", fetcher);
  
  const [liveContent, setLiveContent] = useState(content || {});

  const supabase = createClient();

  // Drag and Swipe Gallery states
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleScroll = () => {
    if (!galleryRef.current) return;
    const { scrollLeft, clientWidth } = galleryRef.current;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / clientWidth);
      setActiveSlide(index);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!galleryRef.current) return;
    setIsDragging(true);
    setStartX(e.clientX - galleryRef.current.offsetLeft);
    setScrollLeftState(galleryRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !galleryRef.current) return;
    e.preventDefault();
    const x = e.clientX - galleryRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Sensitivity scroll multiplier
    galleryRef.current.scrollLeft = scrollLeftState - walk;
  };

  const scrollToSlide = (index: number) => {
    if (!galleryRef.current) return;
    const { clientWidth } = galleryRef.current;
    galleryRef.current.scrollTo({
      left: index * clientWidth,
      behavior: "smooth",
    });
    setActiveSlide(index);
  };

  const handlePrev = () => {
    const prevIndex = activeSlide > 0 ? activeSlide - 1 : galleryItems.length - 1;
    scrollToSlide(prevIndex);
  };

  const handleNext = () => {
    const nextIndex = activeSlide < galleryItems.length - 1 ? activeSlide + 1 : 0;
    scrollToSlide(nextIndex);
  };

  // Memoize derived values — avoid recomputing on every render
  const galleryItems = useMemo(
    () => (Array.isArray(galleryData) ? galleryData.slice(0, 5) : []),
    [galleryData]
  );

  const iconMap = useMemo<Record<string, React.ReactNode>>(() => ({
    github: <GithubIcon size={18} />,
    instagram: <InstagramIcon size={18} />,
    linkedin: <LinkedinIcon size={18} />,
  }), []);

  const socialLinks = useMemo(
    () =>
      (socialsData?.data || [])
        .map((s: any) => ({
          href: s.url,
          icon: iconMap[s.icon?.toLowerCase()] ?? null,
          label: s.platform,
        }))
        .filter(
          (s: any) =>
            s.icon !== null &&
            ["github", "instagram", "linkedin"].includes(s.label?.toLowerCase())
        ),
    [socialsData, iconMap]
  );

  useEffect(() => {
    setLiveContent(content || {});
  }, [content]);

  useEffect(() => {
    const channel = supabase
      .channel('hero-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Profile' }, () => mutate())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'PageContent' }, (payload) => {
        const { key, value, page } = (payload.new as any) || {};
        if (page === 'home' && key) {
          setLiveContent((prev) => ({ ...prev, [key]: value }));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  // supabase is a stable singleton — not a dep
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutate]);

  const avatarUrl = profile?.avatarUrl || "/profile.webp";
  const fullName = profile?.fullName || "";
  const username = profile?.username || "";
  const location = profile?.location || "";
  
  const prefixText = readPageContent(liveContent, "hero.prefix_text", "A");
  const suffixText = readPageContent(liveContent, "hero.suffix_text", "");
  const rotatingTextsRaw = readPageContent(liveContent, "hero.rotating_texts", "Software Engineer,System Architect,UI/UX Enthusiast,Problem Solver");
  const rotatingTexts = rotatingTextsRaw.split(",").map(s => s.trim());

  return (
    <section className="space-y-8">
      {/* Mobile Profile Header (visible only on small screens - desktop uses sidebar) */}
      <div className="mt-6 flex flex-col md:hidden">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold tracking-tight">
                {fullName}
              </h3>
            </div>
            <span className="text-sm text-neutral-500 dark:text-neutral-500">
              {username}
            </span>
          </div>
          <div className="flex-shrink-0">
            <div className="relative h-[72px] w-[72px]">
              <Image
                src={avatarUrl}
                alt={fullName}
                fill
                className="rounded-full border-2 border-neutral-200 object-cover dark:border-neutral-700"
              />
            </div>
          </div>
        </div>

        {/* Mobile Location + Status */}
        <div className="mt-3 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
          <LocationIcon size={15} />
          <span>{location}</span>
          <span className="mx-1 text-neutral-300 dark:text-neutral-700">·</span>
          <span className="flex items-center gap-1.5">
            <motion.span
              className="inline-block h-2 w-2 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-medium text-emerald-500 dark:text-emerald-400">
              Open to Work
            </span>
          </span>
        </div>

        {/* Mobile Social Links */}
        <div className="mt-4 flex items-center gap-3">
          {socialLinks.map((link: any) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="rounded-full bg-neutral-100 p-2 text-neutral-600 transition-all duration-200 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
            >
              {link.icon}
            </Link>
          ))}
          <Link
            href="#contact"
            className="ml-auto flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white transition-all duration-200 hover:opacity-80 dark:bg-white dark:text-neutral-900"
          >
            Hire me
            <HiOutlineExternalLink size={14} />
          </Link>
        </div>

        <hr className="mt-5 border-neutral-200 dark:border-neutral-800" />
      </div>

      {/* Main Hero Content and Decorative Block */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <motion.div
          className="space-y-5 lg:col-span-7"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
        {/* Status Badge */}
        <motion.div
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-sm dark:border-neutral-800 dark:bg-neutral-900/50"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.span
            className="h-2 w-2 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="font-light text-neutral-600 dark:text-neutral-400">
            Available for collaboration
          </span>
        </motion.div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold leading-tight text-neutral-900 dark:text-neutral-50">
            {readPageContent(liveContent, "intro", t("intro"))}
          </h1>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xl text-neutral-600 dark:text-neutral-400">
            <span className="inline-flex items-center gap-x-2">
              <span className="font-light">{prefixText}</span>
              <span className="overflow-hidden font-semibold text-neutral-800 dark:text-neutral-200">
                <RotatingText
                  texts={rotatingTexts}
                  mainClassName="inline-flex"
                  splitBy="characters"
                  staggerDuration={0.02}
                  staggerFrom="first"
                  rotationInterval={2800}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  elementLevelClassName="text-violet-500 dark:text-violet-400"
                />
              </span>
              <span className="font-light">{suffixText}</span>
            </span>
          </div>
        </div>

        {/* Bio paragraphs */}
        <div className="max-w-xl space-y-3 leading-7 text-neutral-600 dark:text-neutral-400">
          <p>
            {readPageContent(
              liveContent,
              "resume.paragraph_1",
              t("resume.paragraph_1"),
            )}
          </p>
          <p>
            {readPageContent(
              liveContent,
              "resume.paragraph_2",
              t("resume.paragraph_2"),
            )}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:opacity-85 active:scale-95 dark:bg-white dark:text-neutral-900"
          >
            View Projects
            <HiOutlineExternalLink size={15} />
          </Link>
          <Link
            href="/about"
            className="group relative flex items-center gap-2 overflow-hidden rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-800 transition-all hover:border-neutral-400 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-800"
          >
            About Me
          </Link>
          <div className="ml-2 hidden items-center gap-3 sm:flex">
            {socialLinks.map((link: any) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="rounded-lg p-2 text-neutral-500 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-800 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              >
                {link.icon}
              </Link>
            ))}
          </div>
        </div>
        </motion.div>

        {/* Swipeable Gallery Preview for Right Side */}
        <motion.div 
          className="hidden lg:flex lg:col-span-5 items-center justify-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
        >
          <div className="relative w-full max-w-sm">
            {/* Ambient glow */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-violet-500 to-emerald-400 opacity-20 blur-xl"></div>
            
            <div className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 p-2 backdrop-blur-sm shadow-xl group/gallery">
              {galleryItems.length > 0 ? (
                <>
                  <div 
                    ref={galleryRef}
                    onScroll={handleScroll}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    className="flex gap-3 overflow-x-auto snap-x snap-mandatory rounded-xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none"
                  >
                    {galleryItems.map((item: any) => {
                      const rawSrc = item.images?.[0] || item.imageUrl;
                      const isValidSrc = typeof rawSrc === "string" && (rawSrc.startsWith("http") || rawSrc.startsWith("/"));
                      
                      return (
                      <div 
                        key={item.id} 
                        className="relative min-w-full aspect-[4/5] snap-center overflow-hidden rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 group cursor-grab active:cursor-grabbing"
                      >
                        {isValidSrc ? (
                          <Image 
                            src={rawSrc} 
                            alt={item.description || "Gallery"} 
                            fill 
                            className="object-cover transition-transform duration-500 group-hover:scale-105" 
                            draggable={false}
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-neutral-400">No Image</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform">
                          {item.category && (
                            <span className="mb-2 inline-block rounded-full bg-violet-500/80 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
                              {item.category}
                            </span>
                          )}
                          <p className="text-white text-sm font-medium line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                  
                  {/* Navigation Arrows */}
                  {galleryItems.length > 1 && (
                    <>
                      <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 dark:bg-neutral-900/40 dark:hover:bg-neutral-900/60 border border-white/10 dark:border-neutral-800/10 backdrop-blur-md text-white transition-opacity duration-300 opacity-0 group-hover/gallery:opacity-100 active:scale-95 shadow-lg cursor-pointer"
                        aria-label="Previous image"
                      >
                        <HiChevronLeft size={18} />
                      </button>
                      <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 hover:bg-black/60 dark:bg-neutral-900/40 dark:hover:bg-neutral-900/60 border border-white/10 dark:border-neutral-800/10 backdrop-blur-md text-white transition-opacity duration-300 opacity-0 group-hover/gallery:opacity-100 active:scale-95 shadow-lg cursor-pointer"
                        aria-label="Next image"
                      >
                        <HiChevronRight size={18} />
                      </button>
                    </>
                  )}
                  
                  <div className="mt-3 flex items-center justify-between px-2">
                    <div className="flex gap-1.5 items-center">
                      {galleryItems.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => scrollToSlide(index)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            activeSlide === index
                              ? "w-4 bg-violet-600 dark:bg-violet-400"
                              : "w-1.5 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600"
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                    <Link 
                      href="/social-media"
                      className="text-xs text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 font-semibold transition-colors flex items-center gap-1"
                    >
                      Buka Galeri <HiOutlineExternalLink size={12} />
                    </Link>
                  </div>
                </>
              ) : (
                <div className="w-full aspect-[4/5] rounded-xl bg-neutral-100 dark:bg-neutral-800 animate-pulse flex items-center justify-center">
                  <span className="text-neutral-400 text-sm">Memuat galeri...</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
