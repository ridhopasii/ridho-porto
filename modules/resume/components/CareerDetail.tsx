import Image from "@/common/components/elements/Image";
import { format, differenceInYears, differenceInMonths } from "date-fns";
import {
  BsBuildings as CompanyIcon,
  BsListCheck as ResponsibilityIcon,
  BsLightbulb as LearnIcon,
} from "react-icons/bs";
import { HiOutlineRocketLaunch as ImpactIcon } from "react-icons/hi2";
import { CareerProps } from "@/common/types/careers";
import Link from "next/link";
import MDXComponent from "@/common/components/elements/MDXComponent";
import { parseImages } from "@/common/utils/parseImages";

export default function CareerDetail({ data }: { data: CareerProps }) {
  const locale = "id"; // Defaulting or can use next-intl, but since it's a server component we might pass locale or use getLocale. Let's assume passed or hardcoded 'id' if needed.
  // Actually, let's just make it simple without hook if it's a server component, or use next-intl if needed.
  // To use useLocale in server component, import { getLocale } from 'next-intl/server';
  // But wait, the hook `useLocale` works in client components. For Server components, `getLocale` is async in Next 15.
  
  const parseSafeDate = (dateStr: string | null | undefined): Date | null => {
    if (!dateStr) return null;
    if (/^\d{4}-\d{2}$/.test(dateStr)) {
      const d = new Date(`${dateStr}-01`);
      return isNaN(d.getTime()) ? null : d;
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const parsedStartDate = parseSafeDate(data.start_date);
  const parsedEndDate = parseSafeDate(data.end_date);

  const startDate = parsedStartDate || new Date();
  const endDate = parsedEndDate || new Date();

  const galleryImages = parseImages(data.images);

  const durationYears = parsedStartDate ? differenceInYears(endDate, startDate) : 0;
  const durationMonths = parsedStartDate ? (differenceInMonths(endDate, startDate) % 12) : 0;

  const yearText = "tahun";
  const monthText = "bulan";

  let durationText = "";
  if (parsedStartDate) {
    if (durationYears > 0) durationText += `${durationYears} ${yearText} `;
    if (durationMonths > 0 || durationYears === 0) durationText += `${durationMonths} ${monthText}`;
  }

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {data.logo ? (
          <Image
            width={100}
            height={100}
            src={data.logo}
            alt={data.company}
            className="shrink-0 rounded-xl border-[1.5px] border-neutral-300 bg-neutral-100 dark:border-neutral-700 object-cover"
          />
        ) : (
          <div className="w-[100px] h-[100px] shrink-0 flex items-center justify-center rounded-xl border-[1.5px] border-neutral-300 bg-neutral-100 dark:border-neutral-700 text-neutral-500">
            <CompanyIcon size={50} />
          </div>
        )}

        <div className="space-y-3 w-full">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{data.position}</h1>
            <Link href={data.link || "#"} target="_blank" className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline">
              {data.company}
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">Periode:</span>
              {parsedStartDate ? (
                <span>{format(startDate, "MMM yyyy")} - {data.end_date ? format(endDate, "MMM yyyy") : "Present"} ({durationText})</span>
              ) : (
                <span>{data.period || "-"}</span>
              )}
            </div>
            <span className="hidden md:block text-neutral-300 dark:text-neutral-700">•</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">Tipe Pekerjaan:</span>
              <span>{data.type}</span>
            </div>
            <span className="hidden md:block text-neutral-300 dark:text-neutral-700">•</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">Lokasi:</span>
              <span>{data.location} ({data.location_type})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 pt-4">
        {data.description && (
          <div className="bg-neutral-50 dark:bg-neutral-800/30 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 leading-relaxed text-neutral-700 dark:text-neutral-300">
            <MDXComponent>{data.description}</MDXComponent>
          </div>
        )}

        {data.responsibilities && data.responsibilities.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-lg text-primary">
              <ResponsibilityIcon size={20} />
              <span>Tugas & Tanggung Jawab</span>
            </div>
            <ul className="space-y-3 leading-relaxed text-neutral-700 dark:text-neutral-300 text-sm md:text-base">
              {data.responsibilities.map((item, index) => (
                <li key={index} className="flex items-start gap-3 bg-neutral-50 dark:bg-neutral-800/30 p-3 rounded-lg">
                  <span className="font-bold text-blue-600 dark:text-blue-400 mt-1">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.lessons_learned && data.lessons_learned.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-lg text-amber-600 dark:text-amber-500">
                <LearnIcon size={20} />
                <span>Pelajaran yang Didapat</span>
              </div>
              <ul className="space-y-3 leading-relaxed text-neutral-700 dark:text-neutral-300 text-sm md:text-base">
                {data.lessons_learned.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg">
                    <span className="font-bold text-amber-600 dark:text-amber-500 mt-1">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.impact && data.impact.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-lg text-emerald-600 dark:text-emerald-500">
                <ImpactIcon size={20} />
                <span>Dampak & Pencapaian</span>
              </div>
              <ul className="space-y-3 leading-relaxed text-neutral-700 dark:text-neutral-300 text-sm md:text-base">
                {data.impact.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-lg">
                    <span className="font-bold text-emerald-600 dark:text-emerald-500 mt-1">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {galleryImages.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">Galeri</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {galleryImages.map((src, index) => (
                <Image
                  key={`gallery-${index}`}
                  src={src}
                  alt={`${data.company} image ${index + 1}`}
                  width={400}
                  height={300}
                  className="w-full h-48 rounded-xl border border-neutral-200 object-cover dark:border-neutral-800"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
