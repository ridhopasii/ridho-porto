import Link from "next/link";
import { MdArrowOutward as ArrowIcon } from "react-icons/md";
import { useLocale, useTranslations } from "next-intl";

import { SocialMediaProps } from "@/common/types/socialMedia";
import SpotlightCard from "@/common/components/elements/SpotlightCard";

const ContactCard = ({
  title,
  description,
  name,
  href,
  icon,
  backgroundIcon,
  backgroundGradientColor,
  backgroundColor,
  borderColor,
  textColor,
  colSpan,
}: SocialMediaProps) => {
  const t = useTranslations("ContactPage");
  const locale = useLocale();

  return (
    <SpotlightCard
      className={`relative grid w-full grid-cols-[2.5fr_1fr] overflow-hidden rounded-2xl border border-neutral-200 bg-white/50 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/50 ${colSpan} ${backgroundGradientColor}`}
    >
      <div className="absolute -left-[3.5rem] -top-[3.5rem] rotate-45 text-neutral-50/5">
        {backgroundIcon}
      </div>
      <div
        className={`${textColor} z-10 flex flex-col justify-between gap-y-3`}
      >
        <div>
          <h4 className="text-xl font-bold tracking-tight">
            {t(`social_media.${name}.title`)}
          </h4>
          <p className="mt-1 text-sm opacity-80">{t(`social_media.${name}.description`)}</p>
        </div>
        <button
          className={`${backgroundColor} mt-2 rounded-xl bg-opacity-90 px-5 py-2.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-opacity-100 hover:shadow-md md:w-max`}
        >
          <Link
            href={href}
            target="_blank"
            className="flex items-center justify-center gap-x-2 text-white"
            data-umami-event={`click_contact_${name}`}
          >
            <p className="text-sm font-medium">
              {locale == "en" ? "Go to" : "Pergi ke"}{" "}
              <span className="capitalize">{name}</span>
            </p>
            <ArrowIcon size={17} />
          </Link>
        </button>
      </div>

      <div className={`flex items-end justify-end`}>
        <div
          className={`rounded-2xl border-4 border-opacity-80 bg-opacity-5 p-2 text-neutral-50 ${backgroundColor} ${borderColor}`}
        >
          {icon}
        </div>
      </div>
    </SpotlightCard>
  );
};

export default ContactCard;
