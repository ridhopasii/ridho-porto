import Image from "@/common/components/elements/Image";
import { BsBuildings as OrganizationIcon } from "react-icons/bs";
import { OrganizationProps } from "@/common/types/organization";
import Link from "next/link";
import MDXComponent from "@/common/components/elements/MDXComponent";
import { parseImages } from "@/common/utils/parseImages";

export default function OrganizationDetail({ data }: { data: OrganizationProps }) {
  const galleryImages = parseImages(data.images);

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {data.logoUrl ? (
          <Image
            width={100}
            height={100}
            src={data.logoUrl}
            alt={data.name}
            className="shrink-0 rounded-xl border-[1.5px] border-neutral-300 bg-neutral-100 p-2 dark:border-neutral-700 dark:bg-neutral-950 object-contain"
          />
        ) : (
          <div className="w-[100px] h-[100px] shrink-0 flex items-center justify-center rounded-xl border-[1.5px] border-neutral-300 bg-neutral-100 dark:border-neutral-700 text-neutral-500">
            <OrganizationIcon size={50} />
          </div>
        )}

        <div className="space-y-3 w-full">
          <div>
            {data.website ? (
              <Link href={data.website} target="_blank" rel="noopener noreferrer">
                <h1 className="text-2xl font-bold transition hover:text-neutral-800 hover:underline dark:hover:text-neutral-50 text-neutral-900 dark:text-neutral-100">
                  {data.name}
                </h1>
              </Link>
            ) : (
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{data.name}</h1>
            )}
            <p className="text-lg font-medium text-blue-600 dark:text-blue-400">{data.role}</p>
          </div>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">Periode:</span>
              <span>{data.period}</span>
            </div>
            {data.proofUrl && (
              <>
                <span className="hidden md:block text-neutral-300 dark:text-neutral-700">•</span>
                <Link
                  href={data.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-400 hover:underline"
                >
                  View Proof
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {data.description && (
        <div className="bg-neutral-50 dark:bg-neutral-800/30 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 leading-relaxed text-neutral-700 dark:text-neutral-300">
          <MDXComponent>{data.description}</MDXComponent>
        </div>
      )}

      {galleryImages.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">Galeri</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((src, index) => (
              <Image
                key={`gallery-${index}`}
                src={src}
                alt={`${data.name} image ${index + 1}`}
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
