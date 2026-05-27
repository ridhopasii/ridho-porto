import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dirsToScan = [
  path.join(__dirname, 'app'),
  path.join(__dirname, 'common'),
  path.join(__dirname, 'modules'),
  path.join(__dirname, 'services'),
  path.join(__dirname, 'i18n'),
  path.join(__dirname, 'tests')
];

function traverse(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let changed = false;
      if (content.includes('process.env.NEXT_PUBLIC_SUPABASE_URL!')) {
        content = content.replace(/process\.env\.NEXT_PUBLIC_SUPABASE_URL!/g, '(process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co")');
        changed = true;
      }
      
      if (content.includes('process.env.SUPABASE_SERVICE_ROLE_KEY!')) {
         content = content.replace(/process\.env\.SUPABASE_SERVICE_ROLE_KEY!/g, '(process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder")');
         changed = true;
      }

      if (content.includes('process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!')) {
         content = content.replace(/process\.env\.NEXT_PUBLIC_SUPABASE_ANON_KEY!/g, '(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder")');
         changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

for (const dir of dirsToScan) {
  traverse(dir);
}
console.log('Done!');
