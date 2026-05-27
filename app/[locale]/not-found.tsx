import Link from "next/link";
import { useTranslations } from "next-intl";
import { TbMoodSad, TbHome, TbArrowLeft } from "react-icons/tb";

const NotFound = () => {
  const t = useTranslations("NotFoundPage");

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6">
      <div className="flex max-w-md flex-col items-center gap-8 text-center">
        {/* Animated 404 Number */}
        <div className="relative">
          <span className="select-none font-mono text-[120px] font-black leading-none tracking-tighter text-neutral-100 dark:text-neutral-800">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-neutral-900 shadow-2xl dark:bg-white">
              <TbMoodSad
                size={40}
                className="text-white dark:text-neutral-900"
              />
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {t("title")}
          </h1>
          <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            Halaman yang Anda cari tidak ditemukan. Mungkin sudah dipindahkan, dihapus, atau URL yang dimasukkan salah.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-80 active:scale-95 dark:bg-white dark:text-neutral-900"
          >
            <TbHome size={16} />
            {t("button")}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 transition-all duration-200 hover:bg-neutral-100 active:scale-95 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <TbArrowLeft size={16} />
            Halaman Sebelumnya
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
