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
      if (content.includes('import { motion }') || content.includes('import { motion,')) {
        content = content.replace(/import\s+{\s*motion\s*(,?.*?)\s*}\s+from\s+['"]framer-motion['"];?/g, 'import { m as motion $1 } from "framer-motion";');
        content = content.replace(/import\s+{\s*(.*?),?\s*motion\s*}\s+from\s+['"]framer-motion['"];?/g, 'import { m as motion, $1 } from "framer-motion";');
        
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDir(path.join(__dirname, 'common'));
processDir(path.join(__dirname, 'modules'));
processDir(path.join(__dirname, 'app'));
console.log('Done!');
