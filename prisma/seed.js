const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  // Create Admin User
  const hashedPassword = await bcrypt.hash('B1smillah', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  });

  // Profile Data
  const profileData = {
    fullName: 'Ridho Robbi Pasi',
    title: 'Web Developer & UI/UX Designer',
    bio: 'Perpaduan logika kode dan estetika desain. Perjalanan saya di dunia digital dimulai sejak saya mengenal komputer. Sebagai seorang pembelajar, saya terbiasa memecahkan masalah. Bagi saya, coding adalah seni menyusun logika yang hidup.',
    location: 'Medan',
    email: 'hafidzhpb2005@gmail.com',
    phone: '+62 831 8926 4857',
    whatsappUrl: 'https://wa.me/6283189264857',
    cvLink: 'https://drive.google.com/file/d/1FumKZc5FxMLlKyCyUcfufwnVHCTFrZJ-/view?usp=sharing',
    avatarUrl: '/images/asset_2.jpg',
    heroImage: '/images/asset_1.jpg',
    aboutImage: '/images/asset_1.jpg',
  };

  const existingProfile = await prisma.profile.findFirst();
  if (existingProfile) {
    await prisma.profile.update({
      where: { id: existingProfile.id },
      data: profileData,
    });
  } else {
    await prisma.profile.create({
      data: profileData,
    });
  }

  // Clear existing data to prevent duplicates on re-seed
  await prisma.experience.deleteMany({});
  await prisma.education.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.award.deleteMany({});
  await prisma.social.deleteMany({});
  await prisma.project.deleteMany({});

  // Experience
  const experiences = [
    {
      company: 'Sujai Lake Toba Travel (Medan)',
      position: 'Admin & Digital Marketing',
      period: 'Januari 2023 - Sekarang',
      description: 'Admin sosial media dan website perusahaan, mengelola konten digital dan strategi marketing online.',
      order: 1,
    },
    {
      company: 'BUMP Pesantren (Dairi)',
      position: 'Ketua Bagian Dokumentasi',
      period: 'Januari 2024 - Januari 2025',
      description: 'Mengelola dokumentasi kegiatan pesantren dan media sosial organisasi.',
      order: 2,
    },
    {
      company: 'Ar Raudlatul Hasanah (Medan)',
      position: 'Ketua Operator',
      period: 'Januari 2022 - Desember 2024',
      description: 'Mengelola operasional sekolah dan dokumentasi kegiatan.',
      order: 3,
    },
  ];

  for (const exp of experiences) {
    await prisma.experience.create({ data: exp });
  }

  // Education
  const education = [
    {
      institution: 'Universitas Sumatera Utara',
      degree: 'Diploma',
      major: 'Teknik Informatika',
      period: 'Agustus 2025 - Sekarang',
      status: 'Sedang menempuh pendidikan',
      order: 1,
    },
    {
      institution: 'Ar Raudlatul Hasanah Medan',
      degree: 'SMA/SMK/STM',
      major: 'IPA (Sains dan Teknologi)',
      period: 'Juni 2022 - April 2025',
      order: 2,
    },
  ];

  for (const edu of education) {
    await prisma.education.create({ data: edu });
  }

  // Skills
  const skills = [
    { name: 'Canva', category: 'Tool', percentage: 95, icon: 'figma' },
    { name: 'Adobe Photoshop', category: 'Tool', percentage: 90, icon: 'image' },
    { name: 'Microsoft Office', category: 'Tool', percentage: 90, icon: 'file-text' },
    { name: 'Corel Draw', category: 'Tool', percentage: 85, icon: 'pen-tool' },
    { name: 'Instagram Marketing', category: 'Marketing', percentage: 90, icon: 'instagram' },
    { name: 'HTML', category: 'Language', percentage: 95, icon: 'code' },
    { name: 'CSS', category: 'Language', percentage: 90, icon: 'palette' },
    { name: 'JavaScript', category: 'Language', percentage: 85, icon: 'braces' },
    { name: 'Node.js', category: 'Framework', percentage: 80, icon: 'server' },
    { name: 'VS Code', category: 'Application', percentage: 95, icon: 'terminal-square' },
    { name: 'MacBook Pro', category: 'Device', percentage: 100, icon: 'laptop' },
  ];

  for (const skill of skills) {
    await prisma.skill.create({ data: skill });
  }

  // Awards
  await prisma.award.create({
    data: {
      title: '100 Besar Olimpiade Kimia UI',
      organizer: 'Universitas Indonesia',
      date: 'Juni 2023',
      description: 'Mencapai peringkat 100 besar dalam Olimpiade Kimia tingkat nasional.',
      category: 'teknologi',
    },
  });

  // Socials
  const socials = [
    { platform: 'GitHub', url: 'https://github.com/hfdzhummaidiii', icon: 'github' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/ridhopasii', icon: 'linkedin' },
    { platform: 'Instagram', url: 'https://instagram.com/ridhopasii', icon: 'instagram' },
    { platform: 'Facebook', url: 'https://facebook.com/ridho.r.p.2025', icon: 'facebook' },
    { platform: 'TikTok', url: 'https://tiktok.com/@ridhopasii', icon: 'music-2' },
  ];

  for (const social of socials) {
    await prisma.social.create({ data: social });
  }

  // Projects
  const projects = [
    {
      title: 'Web Self-Service Cafe',
      description: 'Aplikasi berbasis web, dengan fitur pesan sendiri.',
      tags: 'html,css,js',
      demoUrl: 'https://cafealeena.netlify.app/',
      imageUrl: '',
      featured: true,
      category: 'project',
    },
    {
      title: 'Aplikasi Manajemen Proyek',
      description: 'Platform kolaborasi tim dengan fitur drag-and-drop.',
      tags: 'html,css,js',
      demoUrl: 'https://dwxz0k1l-3000.asse.devtunnels.ms/',
      featured: true,
      category: 'project',
    },
    {
      title: 'UI Design Landing Page',
      description: 'Konsep landing page modern untuk startup teknologi.',
      tags: 'figma,ui,ux',
      demoUrl: '#',
      category: 'design',
      imageUrl: '',
    },
    {
      title: 'Video Company Profile',
      description: 'Video profil perusahaan dengan efek sinematik.',
      tags: 'premiere,aftereffects',
      demoUrl: '#',
      category: 'editing',
      imageUrl: '',
    }
  ];

  for (const proj of projects) {
    await prisma.project.create({ data: proj });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
