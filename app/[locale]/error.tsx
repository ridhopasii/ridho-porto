"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TbAlertTriangle, TbRefresh, TbHome } from "react-icons/tb";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorComponent({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to monitoring service in production
    if (process.env.NODE_ENV !== "development") return;
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6">
      <motion.div
        className="flex max-w-md flex-col items-center gap-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Animated Icon */}
        <motion.div
          className="relative flex h-24 w-24 items-center justify-center"
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="absolute inset-0 rounded-3xl bg-red-100 dark:bg-red-900/30" />
          <TbAlertTriangle
            size={48}
            className="relative z-10 text-red-500 dark:text-red-400"
          />
        </motion.div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Oops! Terjadi Kesalahan
          </h1>
          <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            Halaman ini mengalami masalah yang tidak terduga. Tidak perlu khawatir — Anda bisa mencoba lagi atau kembali ke beranda.
          </p>
        </div>

        {/* Error digest for debugging */}
        {error?.digest && (
          <code className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1 font-mono text-xs text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-400">
            Error ID: {error.digest}
          </code>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-80 active:scale-95 dark:bg-white dark:text-neutral-900"
          >
            <TbRefresh size={16} />
            Coba Lagi
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 transition-all duration-200 hover:bg-neutral-100 active:scale-95 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <TbHome size={16} />
            Kembali ke Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
