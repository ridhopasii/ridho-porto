import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkArticles() {
  const { data: articles } = await supabase.from("Article").select("id, slug, content").in("id", [7, 8]);
  if (articles) {
    articles.forEach(a => {
      console.log(`[${a.id}] ${a.slug}`);
      const hasLorem = a.content.toLowerCase().includes("lorem ipsum");
      console.log(`  Length: ${a.content.length}, Has Lorem Ipsum: ${hasLorem}`);
    });
  }
}

checkArticles();
