import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  const { data } = await supabase.from("PageContent").select("*").eq("page", "home");
  console.log("Home keys with ANON:", data?.length || 0);
  
  const { data: aboutData } = await supabase.from("PageContent").select("*").eq("page", "about");
  console.log("About keys with ANON:", aboutData?.length || 0);
}
main();
