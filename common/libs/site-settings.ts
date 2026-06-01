import { cache } from "react";

import { supabaseServer } from "@/common/libs/supabase-server";

export type SiteSettingsMap = Record<string, string>;

// Ambil seluruh SiteSettings (key/value) sekali per-request (dedup via React cache).
export const getSiteSettings = cache(async (): Promise<SiteSettingsMap> => {
  const { data, error } = await supabaseServer
    .from("SiteSettings")
    .select("key, value");

  if (error || !data) {
    return {};
  }

  return data.reduce<SiteSettingsMap>((acc, item) => {
    if (item.key) acc[item.key] = item.value;
    return acc;
  }, {});
});

export const readSetting = (
  settings: SiteSettingsMap | undefined,
  key: string,
  fallback: string,
) => settings?.[key]?.trim() || fallback;
