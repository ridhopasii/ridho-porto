import { cache } from "react";

import { supabaseServer } from "@/common/libs/supabase-server";

export type PageContentMap = Record<string, string>;

export const getPageContent = cache(
  async (page: string, locale: string): Promise<PageContentMap> => {
    const { data, error } = await supabaseServer
      .from("PageContent")
      .select("key, value")
      .eq("page", page)
      .eq("locale", locale);

    if (error || !data) {
      return {};
    }

    return data.reduce<PageContentMap>((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});
  },
);

export const readPageContent = (
  content: PageContentMap | undefined,
  key: string,
  fallback: string,
) => content?.[key]?.trim() || fallback;
