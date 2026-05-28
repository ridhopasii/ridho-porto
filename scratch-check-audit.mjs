import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkData() {
  console.log("--- PROJECTS ---");
  const { data: projects } = await supabase.from("Project").select("id, title, slug, content, tech_stack, link_github, link_demo");
  if (projects) {
    projects.forEach(p => {
      console.log(`[${p.id}] ${p.title} (${p.slug})`);
      console.log(`  Tech Stack: ${p.tech_stack}`);
      console.log(`  Github: ${p.link_github} | Demo: ${p.link_demo}`);
      console.log(`  Content length: ${p.content?.length || 0}`);
    });
  }

  console.log("\n--- ARTICLES ---");
  const { data: articles } = await supabase.from("Article").select("id, slug, content").in("id", [7, 8]);
  if (articles) {
    articles.forEach(a => {
      console.log(`[${a.id}] ${a.slug}`);
      console.log(`  Content preview: ${a.content?.substring(0, 100).replace(/\n/g, ' ')}...`);
    });
  }
}

checkData();
