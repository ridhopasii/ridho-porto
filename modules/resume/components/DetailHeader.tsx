"use client";

import { useRouter } from "next/navigation";
import { HiArrowLeft } from "react-icons/hi";

interface DetailHeaderProps {
  title: string;
}

export default function DetailHeader({ title }: DetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4 border-b border-neutral-200 pb-4 dark:border-neutral-800 mb-6">
      <button
        onClick={() => router.back()}
        className="flex items-center justify-center rounded-full bg-neutral-100 p-2 text-neutral-600 transition-colors hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
      >
        <HiArrowLeft size={18} />
      </button>
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">{title}</h2>
    </div>
  );
}
