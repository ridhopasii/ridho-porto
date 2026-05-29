import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

// Singleton — one connection reused across all components
let _instance: SupabaseClient | null = null;

export const createClient = (): SupabaseClient => {
  if (!_instance) {
    _instance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder",
    );
  }
  return _instance;
};
