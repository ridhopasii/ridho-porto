import { getTranslations } from "next-intl/server";

import { supabaseServer } from "@/common/libs/supabase-server";

import ContactCard from "./ContactCard";
import DynamicIcon from "@/common/components/DynamicIcon";

const ContactList = async () => {
  const t = await getTranslations("ContactPage");

  const { data: socialMedia } = await supabaseServer
    .from("Social")
    .select("*")
    .eq("is_show", true)
    .order("id", { ascending: true });

  const filteredSocialMedia = socialMedia || [];

  return (
    <div className="flex flex-col space-y-6">
      <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{t("social_media.title")}</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filteredSocialMedia.map((media) => (
          <ContactCard 
            key={media.id} 
            title={media.title} 
            description={media.description} 
            name={media.name || media.platform?.toLowerCase()} 
            href={media.url} 
            icon={<DynamicIcon name={media.icon} />}
            backgroundColor={media.background_color}
            textColor={media.text_color}
            borderColor={media.border_color}
            backgroundGradientColor={media.background_gradient_color}
            colSpan={media.col_span}
            isShow={media.is_show}
          />
        ))}
      </div>
    </div>
  );
};

export default ContactList;
