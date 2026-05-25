const fs = require('fs');

function replaceCookies(file) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Pattern: cookies().set(...)
  if (content.includes('cookies().set(')) {
    content = content.replace(/cookies\(\)\.set\(/g, '(await cookies()).set(');
    changed = true;
  }
  // Pattern: cookies().get(...)
  if (content.includes('cookies().get(')) {
    content = content.replace(/cookies\(\)\.get\(/g, '(await cookies()).get(');
    changed = true;
  }
  // Pattern: const cookieStore = cookies();
  if (content.includes('const cookieStore = cookies();')) {
    content = content.replace(/const cookieStore = cookies\(\);/g, 'const cookieStore = await cookies();');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log("Updated " + file);
  }
}

replaceCookies("app/api/admin/security/route.ts");
replaceCookies("app/api/private-dashboard/login/route.ts");
replaceCookies("app/api/upload/route.ts");
replaceCookies("common/libs/adminAuth.ts");
replaceCookies("common/libs/privateDashboardAuth.ts");
replaceCookies("common/utils/server.ts");
