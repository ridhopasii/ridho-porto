"use client";

import { motion } from "framer-motion";
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

import RotatingText from "@/common/components/elements/RotatingText";

const socialLinks = [
  {
    href: "https://github.com/ridhopasii",
    icon: <GithubIcon size={18} />,
    label: "GitHub",
  },
  {
    href: "https://www.instagram.com/ridhorobbipasi/",
    icon: <InstagramIcon size={18} />,
    label: "Instagram",
  },
  {
    href: "https://www.linkedin.com/in/ridhorobbipasi/",
    icon: <LinkedinIcon size={18} />,
    label: "LinkedIn",
  },
];

const HeroSection = () => {
  const t = useTranslations("HomePage");

  return (
    <section className="space-y-8">
      {/* Mobile Profile Header (visible only on small screens - desktop uses sidebar) */}
      <div className="flex flex-col md:hidden mt-6">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold tracking-tight">
                Ridho Robbi Pasi
              </h3>
              <VerifiedIcon size={18} className="text-blue-400" />
            </div>
            <span className="text-sm text-neutral-500 dark:text-neutral-500">
              @ridhopasii
            </span>
          </div>
          <div className="flex-shrink-0">
            <div className="relative w-[72px] h-[72px]">
              <Image
                src="https://i.pinimg.com/736x/87/84/f1/8784f1837e28bbaefae93c7d63259160.jpg"
                alt="Ridho Robbi Pasi"
                fill
                className="rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-700"
              />
            </div>
          </div>
        </div>

        {/* Mobile Location + Status */}
        <div className="flex items-center gap-2 mt-3 text-sm text-neutral-600 dark:text-neutral-400">
          <LocationIcon size={15} />
          <span>Aceh, Indonesia 🇮🇩</span>
          <span className="mx-1 text-neutral-300 dark:text-neutral-700">·</span>
          <span className="flex items-center gap-1.5">
            <motion.span
              className="inline-block w-2 h-2 rounded-full bg-emerald-400"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-emerald-500 dark:text-emerald-400 text-xs font-medium">
              Open to Work
            </span>
          </span>
        </div>

        {/* Mobile Social Links */}
        <div className="flex items-center gap-3 mt-4">
          {socialLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-200"
            >
              {link.icon}
            </Link>
          ))}
          <Link
            href="/contact"
            className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:opacity-80 transition-all duration-200"
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
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 text-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-neutral-600 dark:text-neutral-400 font-light">
            Available for collaboration
          </span>
        </motion.div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 leading-tight">
            {t("intro")}
          </h1>
          <div className="flex items-center gap-2 text-xl text-neutral-600 dark:text-neutral-400">
            <span className="font-light">A</span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 overflow-hidden">
              <RotatingText
                texts={[
                  "Web Developer",
                  "UI/UX Designer",
                  "Network Engineer",
                  "Full-Stack Dev",
                ]}
                mainClassName="inline-flex"
                splitBy="characters"
                staggerDuration={0.02}
                staggerFrom="first"
                rotationInterval={2800}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                elementLevelClassName="text-violet-500 dark:text-violet-400"
              />
            </span>
            <span className="font-light">based in Aceh</span>
          </div>
        </div>

        {/* Bio paragraphs */}
        <div className="space-y-3 text-neutral-600 dark:text-neutral-400 leading-7 max-w-xl">
          <p>{t("resume.paragraph_1")}</p>
          <p>{t("resume.paragraph_2")}</p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:opacity-85 active:scale-95 transition-all duration-200"
          >
            View Projects
            <HiOutlineExternalLink size={15} />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all duration-200"
          >
            About me
          </Link>
          <div className="hidden sm:flex items-center gap-3 ml-2">
            {socialLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="p-2 rounded-lg text-neutral-500 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200"
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
