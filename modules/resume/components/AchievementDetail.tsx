import Image from "@/common/components/elements/Image";
import { HiOutlineArrowSmRight as ViewIcon } from "react-icons/hi";
import { format, parseISO } from "date-fns";
import { AchievementItem } from "@/common/types/achievements";
import Link from "next/link";
import MDXComponent from "@/common/components/elements/MDXComponent";

export default function AchievementDetail({ data }: { data: AchievementItem }) {
  let issueDate = "";
  if (data.issue_date) {
    try {
      const parsed = parseISO(data.issue_date);
      if (!isNaN(parsed.getTime())) {
        issueDate = format(parsed, "MMMM yyyy");
      }
    } catch (error) {}
  }

  return (
    <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
          <Image
            src={data.image}
            alt={data.name}
            width={1000}
            height={700}
            className="w-full object-contain max-h-[50vh]"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {data.name}
            </h1>
            <p className="mt-2 text-lg text-neutral-600 dark:text-neutral-400">
              {data.issuing_organization}
            </p>
          </div>

          <div className="space-y-4 bg-neutral-50 dark:bg-neutral-800/30 p-5 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase text-neutral-500 font-semibold mb-1">Credential ID</p>
                <p className="text-sm dark:text-neutral-300 font-medium">{data.credential_id || "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-neutral-500 font-semibold mb-1">Issue Date</p>
                <p className="text-sm dark:text-neutral-300 font-medium">{issueDate}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-neutral-500 font-semibold mb-1">Type</p>
                <p className="text-sm capitalize dark:text-neutral-300 font-medium bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 rounded w-fit">{data.type || "-"}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-neutral-500 font-semibold mb-1">Category</p>
                <p className="text-sm capitalize dark:text-neutral-300 font-medium bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 rounded w-fit">{data.category || "-"}</p>
              </div>
            </div>
          </div>

          {data.url_credential && (
            <Link
              href={data.url_credential}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-fit gap-2 rounded-full bg-blue-600 px-6 py-3 text-white transition duration-300 hover:bg-blue-700 shadow-md hover:shadow-lg"
            >
              <span className="text-sm font-semibold">View Credential</span>
              <ViewIcon size={20} />
            </Link>
          )}
        </div>
      </div>

      {data.description && (
        <div className="bg-neutral-50 dark:bg-neutral-800/30 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 leading-relaxed text-neutral-700 dark:text-neutral-300 mt-4">
          <MDXComponent>{data.description}</MDXComponent>
        </div>
      )}

      {Array.isArray(data.images) && data.images.length > 0 && (
        <div className="space-y-4 pt-4 mt-4">
          <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">Galeri</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data.images.map((src, index) => (
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
