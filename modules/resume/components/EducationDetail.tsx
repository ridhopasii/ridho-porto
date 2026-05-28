import Image from "@/common/components/elements/Image";
import { BsBuildings as CompanyIcon } from "react-icons/bs";
import { EducationProps } from "@/common/types/education";
import Link from "next/link";
import MDXComponent from "@/common/components/elements/MDXComponent";
import { parseImages } from "@/common/utils/parseImages";

export default function EducationDetail({ data }: { data: EducationProps }) {
  const galleryImages = parseImages(data.images);

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {data.logo ? (
          <Image
            width={100}
            height={100}
            src={data.logo}
            alt={data.school}
            className="shrink-0 rounded-xl border-[1.5px] border-neutral-300 bg-neutral-100 dark:border-neutral-700 object-cover"
          />
        ) : (
          <div className="w-[100px] h-[100px] shrink-0 flex items-center justify-center rounded-xl border-[1.5px] border-neutral-300 bg-neutral-100 dark:border-neutral-700 text-neutral-500">
            <CompanyIcon size={50} />
          </div>
        )}

        <div className="space-y-3 w-full">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{data.school}</h1>
            <Link href={data.link || "#"} target="_blank" className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline">
              {data.degree} - {data.major}
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">Tahun:</span>
              <span>{data.start_year} - {data.end_year}</span>
            </div>
            <span className="hidden md:block text-neutral-300 dark:text-neutral-700">•</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">Lokasi:</span>
              <span>{data.location}</span>
            </div>
            {data.GPA && (
              <>
                <span className="hidden md:block text-neutral-300 dark:text-neutral-700">•</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">GPA:</span>
                  <span>{data.GPA}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {data.description && (
        <div className="bg-neutral-50 dark:bg-neutral-800/30 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 leading-relaxed text-neutral-700 dark:text-neutral-300 mt-4">
          <MDXComponent>{data.description}</MDXComponent>
        </div>
      )}

      {galleryImages.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">Galeri</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((src, index) => (
              <Image
                key={`gallery-${index}`}
                src={src}
                alt={`${data.school} image ${index + 1}`}
                width={400}
                height={300}
                className="w-full h-48 rounded-xl border border-neutral-200 object-cover dark:border-neutral-800"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
