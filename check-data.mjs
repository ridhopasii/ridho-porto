import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  // Use raw SQL via a known RPC, or just insert/update and see error.
  // Actually, let's just fetch everything with Service Role and see what's in the DB.
  const { data } = await supabase.from("PageContent").select("*");
  console.log("Total rows in PageContent:", data?.length);
  
  // Let's see if there's a typo in the page name.
  const { data: homeData } = await supabase.from("PageContent").select("*").eq("page", "home");
  console.log("Rows with page='home':", homeData?.length);
  console.log(homeData);
}
main();
