const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix double replacements or broken regex outputs
      let changed = false;
      if (content.includes('import { m as motion, m as }')) {
        content = content.replace(/import { m as motion, m as }/g, 'import { m as motion }');
        changed = true;
      }
      if (content.includes('import { m as motion, m as motion }')) {
         content = content.replace(/import { m as motion, m as motion }/g, 'import { m as motion }');
         changed = true;
      }
      if (content.match(/import { m as motion , (.*?) } from "framer-motion";/)) {
        // Just normalize spaces
        content = content.replace(/import { m as motion , /g, 'import { m as motion, ');
        changed = true;
      }
      
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed: ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'common'));
processDir(path.join(__dirname, 'modules'));
processDir(path.join(__dirname, 'app'));
console.log('Fix Done!');
