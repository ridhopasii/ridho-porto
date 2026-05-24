const { createClient } = require("@supabase/supabase-js");

const supabase = createClient("https://uuybelgxovlgozgizith.supabase.co", "sb_publishable_bfFgjFipTzbEgXXu-dvUDA_a0xI9chu");

async function run() {
  const { data, error } = await supabase.from('Project').select('id').limit(1);
  if (error) {
    console.error("Error fetching Project:", error.message);
  } else {
    console.log("Project table exists.");
  }

  // To check all tables, we can query a known table or run raw SQL if supported
  // Let's just check if tables like Guestbook, Uses, Links, Changelog exist
  const tablesToCheck = ['Guestbook', 'Uses', 'Link', 'Changelog', 'Contact', 'Message'];
  for (const table of tablesToCheck) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (error) {
      console.log(`Table ${table} might not exist or empty: ${error.message}`);
    } else {
      console.log(`Table ${table} exists!`);
    }
  }
}
run();
