import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// This client does NOT use cookies(), so it won't opt pages into dynamic SSR.
// Use this for fetching public data in Server Components and Services during build time.
export const createPublicClient = () => {
  return createSupabaseClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"),
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder")
  );
};
