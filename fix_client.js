const fs = require('fs');

function replaceCreateClient(file) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // const supabase = createClient(); -> const supabase = await createClient();
  if (content.includes('createClient()')) {
    content = content.replace(/const supabase = createClient\(\);/g, 'const supabase = await createClient();');
    changed = true;
  }
  
  if (content.includes('export const createClient = () => {')) {
    content = content.replace(/export const createClient = \(\) => \{/g, 'export const createClient = async () => {');
    changed = true;
  }

  if (content.includes('export const createClient = () => createServerClient(')) {
    // If it's a short returning arrow function, we would need to know the shape. But earlier we saw `export const createClient = () => {`
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log("Updated " + file);
  }
}

const files = [
  "app/api/admin/awards/route.ts",
  "app/api/admin/changelogs/route.ts",
  "app/api/admin/education/route.ts",
  "app/api/admin/experience/route.ts",
  "app/api/admin/guestbook/route.ts",
  "app/api/admin/links/route.ts",
  "app/api/admin/messages/route.ts",
  "app/api/admin/page-content/route.ts",
  "app/api/admin/projects/route.ts",
  "app/api/admin/skills/route.ts",
  "app/api/admin/social/route.ts",
  "app/api/admin/uses/route.ts",
  "app/api/chat/[slug]/route.ts",
  "app/api/chat/route.ts",
  "common/libs/supabase-server.ts",
  "i18n/request.ts",
  "modules/chat/components/ChatRoom.tsx",
  "common/utils/server.ts",
  "services/achievements.ts",
  "services/profile.ts",
  "services/projects.ts",
  "services/tiktok.ts"
];

for (const file of files) {
  if (fs.existsSync(file)) {
    replaceCreateClient(file);
  }
}
