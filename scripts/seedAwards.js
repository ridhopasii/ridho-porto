require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing to avoid duplicates in dev
  await prisma.award.deleteMany({});

  const data = [
    {
      title: 'Google UX Design Certificate',
      organizer: 'Google/Coursera',
      date: '2025-01',
      description: 'Sertifikasi desain UX end-to-end: research, wireframe, prototype, usability testing.',
      certificateUrl: 'https://via.placeholder.com/1200x800.png?text=Sertifikat+Google+UX',
      category: 'soft-skill',
      credentialId: 'UX-2025-0001',
    },
    {
      title: 'Frontend Mentor Challenge Winner',
      organizer: 'Frontend Mentor',
      date: '2024-11',
      description: 'Juara challenge landing page, fokus pada performance dan aksesibilitas.',
      certificateUrl: 'https://via.placeholder.com/1200x800.png?text=Frontend+Mentor+Winner',
      category: 'teknologi',
      credentialId: 'FM-2024-1107',
    },
    {
      title: 'JavaScript Algorithms Certificate',
      organizer: 'freeCodeCamp',
      date: '2024-07',
      description: 'Penyelesaian modul algoritma & struktur data JavaScript.',
      certificateUrl: 'https://via.placeholder.com/1200x800.png?text=JS+Algorithms+Certificate',
      category: 'teknologi',
      credentialId: 'FCC-JS-2024-0722',
    },
  ];

  await prisma.award.createMany({ data });
  console.log('Seeded awards:', data.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
