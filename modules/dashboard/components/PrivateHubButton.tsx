"use client";

import { useState, useEffect } from "react";
import { BiLockAlt } from "react-icons/bi";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

import PrivateAccessForm from "./PrivateAccessForm";

export default function PrivateHubButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-private-hub", handleOpen);
    return () => window.removeEventListener("open-private-hub", handleOpen);
  }, []);

  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const isHidden =
    pathname.includes("/admin") || pathname.includes("/private-hub");

  if (isHidden) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-[60] hidden md:inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/90 px-4 py-3 text-sm font-semibold text-neutral-800 shadow-lg backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-950/90 dark:text-neutral-100"
      >
        <BiLockAlt size={18} />
        Private Hub
      </button>

      {open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
                Private Access
              </p>
              <h2 className="mt-2 text-2xl font-bold text-neutral-950 dark:text-white">
                Masuk ke dashboard pribadi
              </h2>
              <p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">
                Hub ini hanya bisa dibuka dengan password yang kamu atur dari
                panel admin.
              </p>
            </div>

            <PrivateAccessForm
              buttonLabel="Buka Hub"
              onSuccess={() => {
                setOpen(false);
                router.push(`/${locale}/private-hub`);
                router.refresh();
              }}
            />

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-900"
            >
              Tutup
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
