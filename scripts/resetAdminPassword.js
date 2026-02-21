require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = 'B1smillah';
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: { password: hash },
    create: { username: 'admin', password: hash },
  });
  console.log('Admin password reset for user:', user.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
