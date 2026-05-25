const fs = require('fs');

const files = [
  "common/types/menu.ts",
  "common/types/service.ts",
  "common/types/socialMedia.ts"
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('JSX.Element')) {
    content = content.replace(/JSX\.Element/g, 'React.ReactNode');
    if(!content.includes("import React")) {
        content = "import React from 'react';\n" + content;
    }
    fs.writeFileSync(file, content);
    console.log("Updated " + file);
  }
}
