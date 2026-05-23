"use client";

import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global application crash:", error);
  }, [error]);

  return (
    <html>
      <head>
        <title>Sistem Error - Ridho Robbi Pasi</title>
      </head>
      <body className="flex min-h-screen flex-col items-center justify-center bg-white p-6 text-center dark:bg-neutral-950">
        <div className="rounded-full bg-red-100 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-12 w-12"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          Fatal System Error
        </h2>
        <p className="mt-2 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
          Terjadi kegagalan kritis pada tata letak utama aplikasi. Silakan coba memuat kembali halaman.
        </p>
        <div className="mt-6">
          <button
            onClick={() => reset()}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Muat Ulang Aplikasi
          </button>
        </div>
      </body>
    </html>
  );
}
