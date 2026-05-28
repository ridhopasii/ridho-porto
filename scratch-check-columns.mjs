import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkColumns() {
  const { data, error } = await supabase
    .from("Guestbook")
    .select()
    .limit(1);

  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log("Single row keys:", Object.keys(data[0] || {}));
}

checkColumns();
