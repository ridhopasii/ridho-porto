"use client";

import { useEffect, useState } from "react";
import { m as motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import {
  MdVerified as VerifiedIcon,
  MdLocationOn as LocationIcon,
} from "react-icons/md";
import {
  BsGithub as GithubIcon,
  BsInstagram as InstagramIcon,
  BsLinkedin as LinkedinIcon,
} from "react-icons/bs";
import { HiOutlineExternalLink } from "react-icons/hi";

import useSWR from "swr";
import { fetcher } from "@/services/fetcher";
import { PageContentMap, readPageContent } from "@/common/libs/page-content";
import { createBrowserClient } from "@supabase/ssr";

import RotatingText from "@/common/components/elements/RotatingText";

interface HeroSectionProps {
  content?: PageContentMap;
}

const HeroSection = ({ content }: HeroSectionProps) => {
  const t = useTranslations("HomePage");
  const { data: profile, mutate } = useSWR("/api/profile", fetcher);
  const { data: socialsData } = useSWR("/api/admin/social", fetcher);
  
  const [liveContent, setLiveContent] = useState(content || {});
  
  const supabase = createBrowserClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || ""),
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""),
  );

  const iconMap: Record<string, React.ReactNode> = {
    github: <GithubIcon size={18} />,
    instagram: <InstagramIcon size={18} />,
    linkedin: <LinkedinIcon size={18} />,
  };

  const socialLinks = (socialsData?.data || []).map((s: any) => ({
    href: s.url,
    icon: iconMap[s.icon?.toLowerCase()] ?? null,
    label: s.platform,
  })).filter((s: any) => s.icon !== null && ["github", "instagram", "linkedin"].includes(s.label?.toLowerCase()));

  useEffect(() => {
    setLiveContent(content || {});
  }, [content]);

  useEffect(() => {
    const channel = supabase
      .channel('hero-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Profile' }, () => mutate())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profile' }, () => mutate())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'PageContent' }, (payload) => {
        const { key, value, page } = (payload.new as any) || {};
        if (page === 'home' && key) {
          setLiveContent((prev) => ({ ...prev, [key]: value }));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [mutate, supabase]);

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
              <VerifiedIcon size={18} className="text-blue-400" />
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
            href="/contact"
            className="ml-auto flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white transition-all duration-200 hover:opacity-80 dark:bg-white dark:text-neutral-900"
          >
            Hire me
            <HiOutlineExternalLink size={14} />
          </Link>
        </div>

        <hr className="mt-5 border-neutral-200 dark:border-neutral-800" />
      </div>

      {/* Main Hero Content */}
      <motion.div
        className="space-y-5"
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
              content,
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
            href="/resume"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-neutral-100 active:scale-95 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            Resume
          </Link>
          <div className="ml-2 hidden items-center gap-3 sm:flex">
            {socialLinks.map((link) => (
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
    </section>
  );
};

export default HeroSection;
