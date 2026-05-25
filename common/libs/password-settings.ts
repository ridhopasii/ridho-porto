import crypto from "crypto";

import { supabaseServer } from "./supabase-server";

const SECRET = process.env.NEXTAUTH_SECRET || "fallback_secret_for_portfolio";

const SITE_SETTING_TABLES = ["SiteSettings", "site_settings"] as const;

export const hashPassword = (password: string) =>
  crypto.createHash("sha256").update(`${password}:${SECRET}`).digest("hex");

async function getSettingValue(key: string): Promise<string | null> {
  for (const table of SITE_SETTING_TABLES) {
    const { data, error } = await supabaseServer
      .from(table)
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (!error && data?.value !== undefined && data?.value !== null) {
      return String(data.value);
    }
  }

  return null;
}

export async function getPasswordHash(
  settingKey: string,
  fallbackEnvKey?: string,
): Promise<string | null> {
  const storedValue = await getSettingValue(settingKey);
  if (storedValue) return storedValue;

  const fallbackPassword = fallbackEnvKey
    ? process.env[fallbackEnvKey]
    : undefined;

  return fallbackPassword ? hashPassword(fallbackPassword) : null;
}

export async function verifyPassword(
  settingKey: string,
  password: string,
  fallbackEnvKey?: string,
): Promise<boolean> {
  const expected = await getPasswordHash(settingKey, fallbackEnvKey);
  if (!expected) return false;
  return hashPassword(password) === expected;
}

export async function upsertSetting(key: string, value: string) {
  for (const table of SITE_SETTING_TABLES) {
    const { data, error } = await supabaseServer
      .from(table)
      .select("key")
      .eq("key", key)
      .maybeSingle();

    if (error) continue;

    if (data?.key) {
      const { error: updateError } = await supabaseServer
        .from(table)
        .update({ value, updatedAt: new Date().toISOString() })
        .eq("key", key);

      if (updateError) throw updateError;
      return;
    }

    const { error: insertError } = await supabaseServer
      .from(table)
      .insert({ key, value, updatedAt: new Date().toISOString() });

    if (insertError) throw insertError;
    return;
  }

  throw new Error("SiteSettings table not found.");
}

