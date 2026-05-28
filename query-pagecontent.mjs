import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  const { data } = await supabase.from("PageContent").select("*").eq("page", "home");
  console.log("Home keys:", data);
  
  const { data: aboutData } = await supabase.from("PageContent").select("*").eq("page", "about");
  console.log("About keys length:", aboutData?.length);
}
main();
