const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let changed = false;
      if (content.includes('import { createClient } from "@/common/utils/server"')) {
        content = content.replace(/import { createClient } from "@\/common\/utils\/server";?/g, 'import { createPublicClient } from "@/common/utils/serverPublic";');
        changed = true;
      }
      
      if (content.includes('await createClient()')) {
         content = content.replace(/await createClient\(\)/g, 'createPublicClient()');
         changed = true;
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated service: ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'services'));
console.log('Done mapping services to public client.');
