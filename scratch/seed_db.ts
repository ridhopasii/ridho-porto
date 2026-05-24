import { createClient } from "@supabase/supabase-js";
import { EDUCATION } from "../common/constants/education";
import { CAREERS } from "../common/constants/carreers";
import { STACKS } from "../common/constants/stacks";
import { SOCIAL_MEDIA } from "../common/constants/socialMedia";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding Education...");
  for (const edu of EDUCATION) {
    const { error } = await supabase.from("Education").upsert({
      institution: edu.school,
      major: edu.major,
      logoUrl: edu.logo,
      location: edu.location,
      degree: edu.degree,
      gpa: edu.GPA,
      start_year: edu.start_year,
      end_year: edu.end_year,
      link: edu.link,
      slug: edu.school.toLowerCase().replace(/\s+/g, '-'),
      showOnHome: true,
      period: `${edu.start_year} - ${edu.end_year}`,
    }, { onConflict: "slug" });
    if (error) console.error("Error inserting Education:", error.message);
  }

  console.log("Seeding Experience...");
  for (const exp of CAREERS) {
    const { error } = await supabase.from("Experience").upsert({
      position: exp.position,
      company: exp.company,
      logoUrl: exp.logo,
      location: exp.location,
      location_type: exp.location_type,
      type: exp.type,
      start_date: exp.start_date,
      end_date: exp.end_date,
      industry: exp.industry,
      link: exp.link,
      responsibilities: exp.responsibilities,
      lessons_learned: exp.lessons_learned,
      impact: exp.impact,
      showOnHome: exp.isShow,
      slug: exp.company.toLowerCase().replace(/\s+/g, '-'),
      period: `${exp.start_date} - ${exp.end_date || 'Present'}`,
    }, { onConflict: "slug" });
    if (error) console.error("Error inserting Experience:", error.message);
  }

  console.log("Seeding Skills...");
  for (const [key, skill] of Object.entries(STACKS)) {
    // Determine the icon name from the React element type
    // In React, the type name is typically the function name
    let iconName = "";
    if (skill.icon && typeof skill.icon === 'object' && skill.icon.type) {
      iconName = skill.icon.type.name || key;
    }

    const { error } = await supabase.from("Skill").upsert({
      name: key,
      icon: iconName,
      background: skill.background,
      color: skill.color,
      is_active: skill.isActive,
      slug: key.toLowerCase().replace(/\s+/g, '-'),
      showOnHome: skill.isActive,
    }, { onConflict: "slug" });
    if (error) console.error("Error inserting Skill:", error.message);
  }

  console.log("Seeding Social Media...");
  for (const social of SOCIAL_MEDIA) {
    let iconName = "";
    if (social.icon && typeof social.icon === 'object' && social.icon.type) {
      iconName = social.icon.type.name || social.name;
    }

    const { error } = await supabase.from("Social").upsert({
      title: social.title,
      description: social.description,
      name: social.name,
      url: social.href,
      icon: iconName,
      text_color: social.textColor,
      background_color: social.backgroundColor,
      border_color: social.borderColor,
      background_gradient_color: social.backgroundGradientColor,
      col_span: social.colSpan,
      is_show: social.isShow,
      platform: social.name,
    });
    if (error) console.error("Error inserting Social:", error.message);
  }

  console.log("Seeding completed!");
}

seed();
