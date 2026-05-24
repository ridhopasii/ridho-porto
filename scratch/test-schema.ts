import { createClient } from "@supabase/supabase-js"
const supabase = createClient("https://uuybelgxovlgozgizith.supabase.co", process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_bfFgjFipTzbEgXXu-dvUDA_a0xI9chu")
async function run() {
  const { data, error } = await supabase.from('Project').select('id').limit(1); // Test
  console.log("Error:", error);
}
run()
