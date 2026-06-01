import { getTranslations } from "next-intl/server";
import { supabaseServer } from "@/common/libs/supabase-server";
import { getSiteSettings } from "@/common/libs/site-settings";
import DynamicIcon from "@/common/components/DynamicIcon";

// Premium vector SVG logos from SVGL.app
const svgLogoMap: Record<string, React.ReactNode> = {
  github: (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  ),
  instagram: (
    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  ),
  tiktok: (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.99-1.72-.08-.07-.17-.17-.24-.24V14c.02 2.2-.83 4.41-2.43 5.92-1.6 1.5-3.87 2.23-6.07 1.98-2.2-.25-4.22-1.53-5.38-3.4-1.16-1.88-1.37-4.31-.56-6.38.81-2.07 2.62-3.66 4.79-4.23v4.18c-1.04.3-1.92 1.08-2.34 2.1-.42 1.02-.32 2.22.28 3.14.6.92 1.65 1.51 2.76 1.57 1.11.06 2.23-.39 2.87-1.3.64-.91.75-2.15.73-3.23V.02h-.02z"/>
    </svg>
  ),
  linkedin: (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9H7.12v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7h-3.56V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/>
    </svg>
  ),
  facebook: (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  gmail: (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"></path>
    </svg>
  ),
  email: (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"></path>
    </svg>
  ),
  whatsapp: (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"></path>
    </svg>
  ),
};

const ContactList = async () => {
  const t = await getTranslations("ContactPage");

  const [{ data: socialMedia }, settings] = await Promise.all([
    supabaseServer
      .from("Social")
      .select("*")
      .eq("is_show", true)
      .order("id", { ascending: true }),
    getSiteSettings(),
  ]);

  // Kontak langsung dari /admin/settings (WhatsApp & Email)
  const whatsapp = settings.contact_whatsapp?.replace(/[^0-9]/g, "");
  const email = settings.contact_email?.trim();
  const directContacts = [
    whatsapp && {
      label: "WhatsApp",
      href: `https://wa.me/${whatsapp}`,
      icon: svgLogoMap.whatsapp,
      umami: "click_contact_whatsapp",
      external: true,
    },
    email && {
      label: "Email",
      href: `mailto:${email}`,
      icon: svgLogoMap.email,
      umami: "click_contact_email",
      external: false,
    },
  ].filter(Boolean) as {
    label: string;
    href: string;
    icon: React.ReactNode;
    umami: string;
    external: boolean;
  }[];

  const filteredSocialMedia = socialMedia || [];

  // 1. Remove duplicate social entries by platform/title
  const seen = new Set();
  const uniqueSocialMedia = filteredSocialMedia.filter((media) => {
    const key = (media.platform || media.title || "").toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return (
    <div className="flex flex-col space-y-5" data-aos="fade-up">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {t("social_media.title")}
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Hubungi saya secara langsung atau jelajahi media sosial saya berikut ini.
        </p>
      </div>

      {/* Wrapping layout: automatically wraps into a second row when the first is full */}
      <div className="flex flex-wrap gap-3 pt-2">
        {directContacts.map((contact) => (
          <a
            key={contact.label}
            href={contact.href}
            {...(contact.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            title={contact.label}
            data-umami-event={contact.umami}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-teal-200 dark:border-teal-900/40 bg-teal-50/60 dark:bg-teal-900/10 backdrop-blur-sm hover:border-teal-300 dark:hover:border-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900/20 transition-all duration-300 shadow-sm hover:shadow-md select-none hover:-translate-y-0.5 cursor-pointer group"
          >
            <span className="w-5 h-5 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-all duration-300">
              {contact.icon}
            </span>
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-300 transition-colors duration-200 whitespace-nowrap">
              {contact.label}
            </span>
          </a>
        ))}
        {uniqueSocialMedia.map((media) => {
          const platformKey = (media.platform || media.title || "").toLowerCase().trim();
          const logoSvg = svgLogoMap[platformKey];

          return (
            <a
              key={media.id}
              href={media.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              title={media.title || media.platform}
              data-umami-event={`click_contact_${media.platform?.toLowerCase()}`}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 shadow-sm hover:shadow-md select-none hover:-translate-y-0.5 cursor-pointer group"
            >
              <span className="w-5 h-5 flex items-center justify-center text-neutral-600 dark:text-neutral-400 group-hover:text-teal-500 dark:group-hover:text-teal-400 group-hover:scale-110 transition-all duration-300">
                {logoSvg ? logoSvg : <DynamicIcon name={media.icon} size={18} />}
              </span>
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors duration-200 whitespace-nowrap capitalize">
                {media.platform || media.title}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default ContactList;
