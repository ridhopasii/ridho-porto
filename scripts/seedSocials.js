require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function upsertSocial(platform, icon, url) {
  const existing = await prisma.social.findFirst({ where: { platform } });
  if (existing) {
    await prisma.social.update({ where: { id: existing.id }, data: { icon, url } });
  } else {
    await prisma.social.create({ data: { platform, icon, url } });
  }
}

async function main() {
  await upsertSocial('LinkedIn', 'linkedin', 'https://www.linkedin.com/in/username');
  await upsertSocial('Instagram', 'instagram', 'https://www.instagram.com/username');
  await upsertSocial('GitHub', 'github', 'https://github.com/username');
  console.log('Socials seeded/updated');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
