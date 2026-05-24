import { createClient } from "@supabase/supabase-js";

// Use this for fetching data securely on server components
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy_key"
);
