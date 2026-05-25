"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { m as motion, AnimatePresence } from "framer-motion";
import {
  FiArrowUpRight,
  FiShare2,
  FiCopy,
  FiCheck,
  FiGlobe,
  FiTrendingUp,
  FiCoffee,
  FiLink,
  FiMapPin,
  FiHeart
} from "react-icons/fi";
import {
  FaGithub as SiGithub,
  FaLinkedin as SiLinkedin,
  FaInstagram as SiInstagram,
  FaTiktok as SiTiktok,
  FaWhatsapp as SiWhatsapp
} from "react-icons/fa";
import {
  BiSun as LightIcon,
  BiMoon as DarkIcon,
  BiBoltCircle as YellowIcon,
  BiHeart as ValentineIcon,
  BiCompass as RamadanIcon
} from "react-icons/bi";

interface LinkItem {
  id: number;
  title: string;
  url: string;
  type: "social" | "portfolio" | "other";
  icon?: string;
}

interface ProfileData {
  fullName: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  avatarUrl: string | null;
  heroImage: string | null;
  cvLink: string | null;
  whatsappUrl: string | null;
}

interface LinksClientProps {
  profile: ProfileData;
  links: LinkItem[];
  locale: string;
}

export default function LinksClient({ profile, links, locale }: LinksClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setPageUrl(window.location.origin + pathname);
    }
  }, [pathname]);

  if (!mounted) return null;

  const themes = [
    { name: "light", icon: <LightIcon size={17} />, label: "Terang" },
    { name: "dark", icon: <DarkIcon size={17} />, label: "Gelap" },
    { name: "yellow", icon: <YellowIcon size={17} />, label: "Kuning" },
    { name: "ramadan", icon: <RamadanIcon size={17} />, label: "Ramadan" },
    { name: "valentine", icon: <ValentineIcon size={17} />, label: "Valentine" }
  ];

  const currentThemeIndex = themes.findIndex((t) => t.name === resolvedTheme) || 0;
  const isLightMode = resolvedTheme === "light";

  const handleLocaleChange = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLinkIcon = (title: string, type: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("portfolio") || titleLower.includes("portofolio")) {
      return <FiGlobe size={20} />;
    }
    if (titleLower.includes("monkeytype") || titleLower.includes("typing") || titleLower.includes("ketik")) {
      return <FiTrendingUp size={20} />;
    }
    if (titleLower.includes("saweria") || titleLower.includes("donate") || titleLower.includes("kopi") || titleLower.includes("coffee")) {
      return <FiCoffee size={20} />;
    }
    if (type === "portfolio") {
      return <FiGlobe size={20} />;
    }
    return <FiLink size={20} />;
  };

  const activeThemeXOffset = currentThemeIndex >= 0 ? currentThemeIndex * 32 : 0;

  return (
    <main className="mx-auto max-w-lg sm:py-4 min-h-screen">
      <div className="bg-white dark:bg-neutral-950 yellow:bg-amber-50/70 ramadan:bg-emerald-950/40 valentine:bg-rose-50/70 min-h-screen transition-colors duration-300 sm:rounded-[2.5rem] border border-neutral-100 dark:border-neutral-900 shadow-xl overflow-hidden">
        <div className="mx-auto max-w-lg px-6 py-8">
          
          {/* Header Area */}
          <header className="flex items-center justify-between">
            {/* Theme Toggle Slider */}
            <div className="flex items-center justify-center">
              <div className="relative flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50/80 p-1 dark:border-neutral-850 dark:bg-neutral-900/80 yellow:border-amber-200 yellow:bg-amber-100/50 ramadan:border-emerald-800 ramadan:bg-emerald-900/20 valentine:border-rose-200 valentine:bg-rose-100/50 w-[168px] h-10">
                <motion.div
                  className="absolute bottom-1 top-1 w-8 rounded-full bg-neutral-200 dark:bg-neutral-800 yellow:bg-amber-200 ramadan:bg-emerald-800 valentine:bg-rose-200"
                  animate={{ x: activeThemeXOffset }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
                {themes.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => setTheme(t.name)}
                    className="relative z-10 flex h-8 w-8 items-center justify-center transition duration-200 text-neutral-500 dark:text-neutral-400 hover:scale-110 active:scale-95"
                    aria-label={`Switch to ${t.label} mode`}
                  >
                    {t.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Switcher & Share */}
            <div className="flex items-center gap-2">
              <div className="relative flex items-center gap-1 rounded-full border border-neutral-200 bg-neutral-50/80 p-1 dark:border-neutral-850 dark:bg-neutral-900/80 yellow:border-amber-200 yellow:bg-amber-100/50 ramadan:border-emerald-800 ramadan:bg-emerald-900/20 valentine:border-rose-200 valentine:bg-rose-100/50">
                <button
                  onClick={() => handleLocaleChange("en")}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                    locale === "en"
                      ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 yellow:bg-amber-200 ramadan:bg-emerald-800 valentine:bg-rose-200"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => handleLocaleChange("id")}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
                    locale === "id"
                      ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 yellow:bg-amber-200 ramadan:bg-emerald-800 valentine:bg-rose-200"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  ID
                </button>
              </div>

              <button
                onClick={() => setShowShareModal(true)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50/80 text-neutral-600 transition-colors hover:bg-neutral-100 dark:border-neutral-850 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:bg-neutral-800 yellow:border-amber-200 yellow:bg-amber-100/50 yellow:hover:bg-amber-200/50 ramadan:border-emerald-800 ramadan:bg-emerald-900/20 ramadan:hover:bg-emerald-900/40 valentine:border-rose-200 valentine:bg-rose-100/50 valentine:hover:bg-rose-200/50"
                aria-label="Show share modal"
              >
                <FiShare2 size={18} />
              </button>
            </div>
          </header>

          {/* Profile Section */}
          <section className="mt-12 flex flex-col items-center text-center space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-neutral-900 yellow:border-amber-200 ramadan:border-emerald-800 valentine:border-rose-200"
            >
              <img
                alt={profile.fullName}
                width={112}
                height={112}
                className="rounded-full object-cover"
                src={profile.avatarUrl || "/images/signature.png"}
              />
            </motion.div>

            <div className="space-y-1.5">
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white yellow:text-amber-950 ramadan:text-emerald-100 valentine:text-rose-950">
                {profile.fullName}
              </h1>
              <p className="text-base font-medium text-blue-600 dark:text-blue-400 yellow:text-amber-600 ramadan:text-emerald-400 valentine:text-rose-600">
                {profile.title}
              </p>
              <div className="flex items-center justify-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 yellow:text-amber-700/80 ramadan:text-emerald-300/80 valentine:text-rose-700/80">
                <FiMapPin size={14} />
                <span>{profile.location}</span>
              </div>
            </div>

            {profile.bio && (
              <p className="max-w-xs text-sm text-neutral-600 dark:text-neutral-400 yellow:text-amber-900/70 ramadan:text-emerald-200/70 valentine:text-rose-900/70 leading-relaxed">
                {profile.bio}
              </p>
            )}
          </section>

          {/* Social Icons row */}
          <section className="mt-8 flex justify-center gap-3">
            {[
              {
                icon: <SiGithub size={20} />,
                href: "https://github.com/ridhopasii",
                label: "GitHub"
              },
              {
                icon: <SiLinkedin size={20} />,
                href: "https://www.linkedin.com/in/ridho-robbi-pasi-3686882aa/",
                label: "LinkedIn"
              },
              {
                icon: <SiInstagram size={20} />,
                href: "https://www.instagram.com/ridhorobbipasi/",
                label: "Instagram"
              },
              {
                icon: <SiTiktok size={20} />,
                href: "https://www.tiktok.com/@ridhorobbipasi",
                label: "TikTok"
              },
              ...(profile.whatsappUrl
                ? [
                    {
                      icon: <SiWhatsapp size={20} />,
                      href: profile.whatsappUrl,
                      label: "WhatsApp"
                    }
                  ]
                : [])
            ].map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-neutral-50/50 text-neutral-500 shadow-sm transition hover:border-neutral-350 hover:bg-neutral-100 hover:text-neutral-900 dark:border-neutral-850 dark:bg-neutral-900/50 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white yellow:border-amber-200 yellow:bg-amber-100/30 yellow:text-amber-700 ramadan:border-emerald-800 ramadan:bg-emerald-900/10 ramadan:text-emerald-300 valentine:border-rose-200 valentine:bg-rose-100/30 valentine:text-rose-600"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </section>

          {/* Custom links vertical stack */}
          <section className="mt-10 space-y-3">
            {links.map((link, index) => (
              <motion.a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 shadow-sm transition duration-300 hover:border-neutral-350 hover:bg-neutral-100/50 hover:shadow-md dark:border-neutral-850 dark:bg-neutral-900/50 dark:hover:border-neutral-800 dark:hover:bg-neutral-850/50 yellow:border-amber-200 yellow:bg-amber-100/30 yellow:hover:border-amber-300 ramadan:border-emerald-800 ramadan:bg-emerald-900/10 ramadan:hover:border-emerald-600 valentine:border-rose-200 valentine:bg-rose-100/30 valentine:hover:border-rose-300"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-white shadow-xs dark:border-neutral-800 dark:bg-neutral-950 yellow:border-amber-200 yellow:bg-amber-100 ramadan:border-emerald-800 ramadan:bg-emerald-950 valentine:border-rose-200 valentine:bg-rose-100">
                    <span className="text-neutral-600 dark:text-neutral-300 yellow:text-amber-700 ramadan:text-emerald-400 valentine:text-rose-600">
                      {getLinkIcon(link.title, link.type)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold leading-tight text-neutral-900 dark:text-white yellow:text-amber-950 ramadan:text-emerald-100 valentine:text-rose-950">
                      {link.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                      {link.type} link
                    </p>
                  </div>
                </div>
                <FiArrowUpRight className="shrink-0 text-neutral-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-neutral-500" size={18} />
              </motion.a>
            ))}
          </section>

          {/* Email card shortcut */}
          <motion.div
            className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/50 yellow:border-amber-200 yellow:bg-amber-100/30 ramadan:border-emerald-800 ramadan:bg-emerald-900/10 valentine:border-rose-200 valentine:bg-rose-100/30 text-center space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="font-semibold text-neutral-900 dark:text-white yellow:text-amber-950 ramadan:text-emerald-100 valentine:text-rose-950">
              {locale === "id" ? "Hubungi Saya" : "Get In Touch"}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
              {locale === "id"
                ? "Jangan ragu untuk menghubungi untuk kolaborasi atau sekadar ngobrol"
                : "Feel free to reach out for collaborations, project opportunities or just to say hello!"}
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 text-sm font-semibold yellow:bg-amber-600 yellow:hover:bg-amber-700 ramadan:bg-emerald-800 ramadan:hover:bg-emerald-700 valentine:bg-rose-500 valentine:hover:bg-rose-600"
            >
              {locale === "id" ? "Kirim Email" : "Send Email"}
            </a>
          </motion.div>

          <footer className="mt-12 text-center text-xs text-neutral-400">
            <p className="flex items-center justify-center gap-1">
              Made with <FiHeart className="text-red-500 fill-red-500" /> by {profile.fullName}
            </p>
          </footer>

        </div>
      </div>

      {/* Share / Copy Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-950"
            >
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {locale === "id" ? "Bagikan halaman ini" : "Share this page"}
              </h2>
              
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 dark:border-neutral-800 dark:bg-neutral-900">
                <input
                  type="text"
                  readOnly
                  value={pageUrl}
                  className="w-full bg-transparent text-xs text-neutral-600 dark:text-neutral-400 focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                >
                  {copied ? <FiCheck className="text-green-500" size={16} /> : <FiCopy size={16} />}
                </button>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-full rounded-xl border border-neutral-200 py-3 text-sm font-semibold text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-850 dark:text-neutral-400 dark:hover:bg-neutral-900"
                >
                  {locale === "id" ? "Tutup" : "Close"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
