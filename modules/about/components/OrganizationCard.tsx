import Link from "next/link";
import Image from "@/common/components/elements/Image";
import { BsBuildings as OrganizationIcon } from "react-icons/bs";

import SpotlightCard from "@/common/components/elements/SpotlightCard";
import { OrganizationProps } from "@/common/types/organization";

const OrganizationCard = ({
  name,
  role,
  period,
  description,
  website,
  logoUrl,
  proofUrl,
  images,
}: OrganizationProps) => {
  const galleryImages = Array.isArray(images) ? images.filter(Boolean) : [];

  return (
    <SpotlightCard className="flex items-start gap-5 p-6">
      {logoUrl ? (
        <Image
          width={64}
          height={64}
          src={logoUrl}
          alt={name}
          className="shrink-0 rounded-xl border-[1.5px] border-neutral-300 bg-neutral-100 object-contain p-1 dark:border-neutral-700 dark:bg-neutral-950"
        />
      ) : (
        <OrganizationIcon size={64} className="shrink-0 text-neutral-500" />
      )}

      <div className="w-full min-w-0 space-y-2">
        <div className="space-y-1">
          {website ? (
            <Link href={website} target="_blank" rel="noopener noreferrer">
              <h5 className="break-words transition hover:text-neutral-800 hover:underline dark:hover:text-neutral-50">
                {name}
              </h5>
            </Link>
          ) : (
            <h5 className="break-words">{name}</h5>
          )}
          <p className="text-sm font-medium text-primary">{role}</p>
        </div>

        <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
          <p>{period}</p>
          {description ? <p className="leading-7">{description}</p> : null}
          {proofUrl ? (
            <Link
              href={proofUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center rounded-full border border-neutral-300 px-3 py-1 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              View Proof
            </Link>
          ) : null}
          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 pt-2 sm:grid-cols-3">
              {galleryImages.map((src, index) => (
                <Image
                  key={`${name}-image-${index}`}
                  src={src}
                  alt={`${name} image ${index + 1}`}
                  width={220}
                  height={160}
                  className="h-24 w-full rounded-xl border border-neutral-200 object-cover dark:border-neutral-800"
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </SpotlightCard>
  );
};

export default OrganizationCard;
