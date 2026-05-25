"use client";

import { useRouter } from "next/navigation";

import PrivateAccessForm from "./PrivateAccessForm";

export default function PrivateDashboardGate() {
  const router = useRouter();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-2xl items-center px-4 py-8">
      <div className="w-full rounded-[2rem] border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 md:p-8">
        <div className="mb-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-600 dark:text-blue-400">
            Private Hub
          </p>
          <h1 className="text-3xl font-black tracking-tight text-neutral-950 dark:text-white">
            Produktif + Keuangan
          </h1>
          <p className="max-w-xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">
            Masuk untuk membuka dashboard pribadimu yang berisi tracker
            produktivitas, rencana tahunan, tabungan umroh, serta catatan
            keuangan.
          </p>
        </div>

        <PrivateAccessForm
          buttonLabel="Buka Dashboard"
          onSuccess={() => router.refresh()}
        />

        <div className="mt-6 rounded-2xl bg-neutral-100 p-4 text-sm text-neutral-600 dark:bg-neutral-900 dark:text-neutral-400">
          Akses ini bisa kamu ubah dari panel admin kapan saja.
        </div>
      </div>
    </div>
  );
}
