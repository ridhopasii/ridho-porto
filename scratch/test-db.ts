import { createClient } from "@supabase/supabase-js"
const supabase = createClient("https://uuybelgxovlgozgizith.supabase.co", "sb_publishable_bfFgjFipTzbEgXXu-dvUDA_a0xI9chu")
async function run() {
  const { data } = await supabase.from("Project").select("*").limit(1)
  console.log(JSON.stringify(data, null, 2))
}
run()
