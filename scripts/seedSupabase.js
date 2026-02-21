require('dotenv').config();
const bcrypt = require('bcryptjs');
const supabase = require('../src/services/supabaseRest');

async function main() {
  if (!supabase.isConfigured()) {
    throw new Error('SUPABASE_URL & SUPABASE_SERVICE_ROLE_KEY harus terisi untuk seed Supabase');
  }

  const hashedPassword = await bcrypt.hash('B1smillah', 10);

  const existingAdmin = await supabase.selectOne('admin_user', { select: '*', filters: { username: 'eq.admin' } });
  if (existingAdmin) {
    await supabase.updateOne('admin_user', {
      filters: { id: `eq.${existingAdmin.id}` },
      data: { password: hashedPassword },
    });
  } else {
    await supabase.insertOne('admin_user', { username: 'admin', password: hashedPassword });
  }

  const profileData = {
    full_name: 'Ridho Robbi Pasi',
    title: 'Web Developer & UI/UX Designer',
    bio: 'Perpaduan logika kode dan estetika desain. Perjalanan saya di dunia digital dimulai sejak saya mengenal komputer. Sebagai seorang pembelajar, saya terbiasa memecahkan masalah. Bagi saya, coding adalah seni menyusun logika yang hidup.',
    location: 'Medan',
    email: 'hafidzhpb2005@gmail.com',
    phone: '+62 831 8926 4857',
    whatsapp_url: 'https://wa.me/6283189264857',
    cv_link: 'https://drive.google.com/file/d/1FumKZc5FxMLlKyCyUcfufwnVHCTFrZJ-/view?usp=sharing',
    avatar_url: '/images/asset_2.jpg',
    hero_image: '/images/asset_1.jpg',
    about_image: '/images/asset_1.jpg',
  };

  const existingProfile = await supabase.selectOne('profile', { select: 'id' });
  if (existingProfile) {
    await supabase.updateOne('profile', { filters: { id: `eq.${existingProfile.id}` }, data: profileData });
  } else {
    await supabase.insertOne('profile', profileData);
  }

  await supabase.deleteMany('experience', { filters: { id: 'gt.0' } });
  await supabase.deleteMany('education', { filters: { id: 'gt.0' } });
  await supabase.deleteMany('skill', { filters: { id: 'gt.0' } });
  await supabase.deleteMany('award', { filters: { id: 'gt.0' } });
  await supabase.deleteMany('social', { filters: { id: 'gt.0' } });
  await supabase.deleteMany('project', { filters: { id: 'gt.0' } });
  await supabase.deleteMany('service', { filters: { id: 'not.is.null' } });
  await supabase.deleteMany('article', { filters: { id: 'gt.0' } });
  await supabase.deleteMany('testimonial', { filters: { id: 'gt.0' } });
  await supabase.deleteMany('message', { filters: { id: 'gt.0' } });

  const experiences = [
    {
      company: 'Sujai Lake Toba Travel (Medan)',
      position: 'Admin & Digital Marketing',
      period: 'Januari 2023 - Sekarang',
      description: 'Admin sosial media dan website perusahaan, mengelola konten digital dan strategi marketing online.',
      sort_order: 1,
    },
    {
      company: 'BUMP Pesantren (Dairi)',
      position: 'Ketua Bagian Dokumentasi',
      period: 'Januari 2024 - Januari 2025',
      description: 'Mengelola dokumentasi kegiatan pesantren dan media sosial organisasi.',
      sort_order: 2,
    },
    {
      company: 'Ar Raudlatul Hasanah (Medan)',
      position: 'Ketua Operator',
      period: 'Januari 2022 - Desember 2024',
      description: 'Mengelola operasional sekolah dan dokumentasi kegiatan.',
      sort_order: 3,
    },
  ];

  for (const exp of experiences) {
    await supabase.insertOne('experience', exp);
  }

  const education = [
    {
      institution: 'Universitas Sumatera Utara',
      degree: 'Diploma',
      major: 'Teknik Informatika',
      period: 'Agustus 2025 - Sekarang',
      status: 'Sedang menempuh pendidikan',
      sort_order: 1,
    },
    {
      institution: 'Ar Raudlatul Hasanah Medan',
      degree: 'SMA/SMK/STM',
      major: 'IPA (Sains dan Teknologi)',
      period: 'Juni 2022 - April 2025',
      sort_order: 2,
    },
  ];

  for (const edu of education) {
    await supabase.insertOne('education', edu);
  }

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
    await supabase.insertOne('skill', skill);
  }

  await supabase.insertOne('award', {
    title: '100 Besar Olimpiade Kimia UI',
    organizer: 'Universitas Indonesia',
    date: 'Juni 2023',
    description: 'Mencapai peringkat 100 besar dalam Olimpiade Kimia tingkat nasional.',
    category: 'teknologi',
  });

  const socials = [
    { platform: 'GitHub', url: 'https://github.com/hfdzhummaidiii', icon: 'github' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/ridhopasii', icon: 'linkedin' },
    { platform: 'Instagram', url: 'https://instagram.com/ridhopasii', icon: 'instagram' },
    { platform: 'Facebook', url: 'https://facebook.com/ridho.r.p.2025', icon: 'facebook' },
    { platform: 'TikTok', url: 'https://tiktok.com/@ridhopasii', icon: 'music-2' },
  ];

  for (const social of socials) {
    await supabase.insertOne('social', social);
  }

  const projects = [
    {
      title: 'Web Self-Service Cafe',
      slug: 'web-self-service-cafe',
      description: 'Aplikasi berbasis web, dengan fitur pesan sendiri.',
      tags: 'html,css,js',
      demo_url: 'https://cafealeena.netlify.app/',
      image_url: '',
      featured: true,
      category: 'project',
    },
    {
      title: 'Aplikasi Manajemen Proyek',
      slug: 'aplikasi-manajemen-proyek',
      description: 'Platform kolaborasi tim dengan fitur drag-and-drop.',
      tags: 'html,css,js',
      demo_url: 'https://dwxz0k1l-3000.asse.devtunnels.ms/',
      featured: true,
      category: 'project',
    },
    {
      title: 'UI Design Landing Page',
      slug: 'ui-design-landing-page',
      description: 'Konsep landing page modern untuk startup teknologi.',
      tags: 'figma,ui,ux',
      demo_url: '#',
      category: 'design',
      image_url: '',
    },
    {
      title: 'Video Company Profile',
      slug: 'video-company-profile',
      description: 'Video profil perusahaan dengan efek sinematik.',
      tags: 'premiere,aftereffects',
      demo_url: '#',
      category: 'editing',
      image_url: '',
    },
  ];

  for (const proj of projects) {
    await supabase.insertOne('project', proj);
  }

  console.log('Seed Supabase selesai.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
