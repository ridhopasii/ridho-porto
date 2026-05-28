import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data: policies, error } = await supabase.rpc('get_policies', {});
  if (error) {
    // If rpc fails, we can query pg_policies directly
    const { data, error: pgError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'PageContent');
    console.log(data || pgError);
  } else {
    console.log(policies);
  }
}
main();
