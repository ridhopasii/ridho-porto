const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
        }
    });
    return results;
}

const files = walk('./app');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  if (content.includes('params: { locale: string }')) {
    content = content.replace(/params:\s*\{\s*locale:\s*string\s*\}/g, 'params: Promise<{ locale: string }>');
    changed = true;
  }
  
  const componentPattern = /const\s+(\w+)\s*=\s*async\s*\(\{\s*params:\s*\{\s*locale\s*\}\s*,\s*searchParams\s*\}\s*:\s*(\w+)\s*\)\s*=>\s*\{/g;
  if(componentPattern.test(content)) {
    content = content.replace(componentPattern, (match, p1, p2) => {
      changed = true;
      return `const ${p1} = async ({ params, searchParams }: ${p2}) => {\n  const { locale } = await params;`;
    });
  }

  const componentPattern2 = /const\s+(\w+)\s*=\s*async\s*\(\{\s*params:\s*\{\s*locale\s*\}\s*\}\s*:\s*(\w+)\s*\)\s*=>\s*\{/g;
  if(componentPattern2.test(content)) {
    content = content.replace(componentPattern2, (match, p1, p2) => {
      changed = true;
      return `const ${p1} = async ({ params }: ${p2}) => {\n  const { locale } = await params;`;
    });
  }

  if (content.includes('searchParams: { [key: string]: string | string[] | undefined }')) {
    content = content.replace(/searchParams:\s*\{\s*\[key:\s*string\]:\s*string\s*\|\s*string\[\]\s*\|\s*undefined\s*\}/g, 'searchParams: Promise<{ [key: string]: string | string[] | undefined }>');
    changed = true;
  }
  
  if (content.includes('params: {') && content.includes('slug: string')) {
    content = content.replace(/params:\s*\{\s*slug:\s*string;?\s*locale:\s*string;?\s*\}/g, 'params: Promise<{ slug: string; locale: string; }>');
    content = content.replace(/params:\s*\{\s*locale:\s*string;?\s*slug:\s*string;?\s*\}/g, 'params: Promise<{ locale: string; slug: string; }>');
    changed = true;
  }

  const componentPatternSlug = /const\s+(\w+)\s*=\s*async\s*\(\{\s*params:\s*\{\s*locale,\s*slug\s*\}\s*\}\s*:\s*(\w+)\s*\)\s*=>\s*\{/g;
  if(componentPatternSlug.test(content)) {
    content = content.replace(componentPatternSlug, (match, p1, p2) => {
      changed = true;
      return `const ${p1} = async ({ params }: ${p2}) => {\n  const { locale, slug } = await params;`;
    });
  }

  const generateMetadataPattern = /export\s+async\s+function\s+generateMetadata\(\{\s*params:\s*\{\s*locale,\s*slug\s*\}\s*\}\s*:\s*(\w+)\s*,\s*parent:\s*ResolvingMetadata,\?\s*\)\s*:\s*Promise<Metadata>\s*\{/g;
  if(generateMetadataPattern.test(content)) {
    content = content.replace(generateMetadataPattern, (match, p1) => {
      changed = true;
      return `export async function generateMetadata({ params }: ${p1}, parent: ResolvingMetadata): Promise<Metadata> {\n  const { locale, slug } = await params;`;
    });
  }

  const generateMetadataPattern2 = /export\s+async\s+function\s+generateMetadata\(\{\s*params:\s*\{\s*locale\s*\}\s*\}\s*:\s*(\w+)\s*\)\s*:\s*Promise<Metadata>\s*\{/g;
  if(generateMetadataPattern2.test(content)) {
    content = content.replace(generateMetadataPattern2, (match, p1) => {
      changed = true;
      return `export async function generateMetadata({ params }: ${p1}): Promise<Metadata> {\n  const { locale } = await params;`;
    });
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ` + file);
  }
}
