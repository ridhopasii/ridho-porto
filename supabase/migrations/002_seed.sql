begin;

truncate table
  experience,
  education,
  skill,
  award,
  social,
  project,
  service,
  article,
  testimonial,
  message,
  profile
restart identity;

insert into admin_user (username, password)
values ('admin', crypt('B1smillah', gen_salt('bf')))
on conflict (username) do update set password = excluded.password;

insert into profile (
  full_name,
  title,
  bio,
  location,
  email,
  phone,
  whatsapp_url,
  cv_link,
  avatar_url,
  hero_image,
  about_image
) values (
  'Ridho Robbi Pasi',
  'Web Developer & UI/UX Designer',
  'Perpaduan logika kode dan estetika desain. Perjalanan saya di dunia digital dimulai sejak saya mengenal komputer. Sebagai seorang pembelajar, saya terbiasa memecahkan masalah. Bagi saya, coding adalah seni menyusun logika yang hidup.',
  'Medan',
  'hafidzhpb2005@gmail.com',
  '+62 831 8926 4857',
  'https://wa.me/6283189264857',
  'https://drive.google.com/file/d/1FumKZc5FxMLlKyCyUcfufwnVHCTFrZJ-/view?usp=sharing',
  '/images/asset_2.jpg',
  '/images/asset_1.jpg',
  '/images/asset_1.jpg'
);

insert into experience (company, position, period, description, sort_order) values
('Sujai Lake Toba Travel (Medan)', 'Admin & Digital Marketing', 'Januari 2023 - Sekarang', 'Admin sosial media dan website perusahaan, mengelola konten digital dan strategi marketing online.', 1),
('BUMP Pesantren (Dairi)', 'Ketua Bagian Dokumentasi', 'Januari 2024 - Januari 2025', 'Mengelola dokumentasi kegiatan pesantren dan media sosial organisasi.', 2),
('Ar Raudlatul Hasanah (Medan)', 'Ketua Operator', 'Januari 2022 - Desember 2024', 'Mengelola operasional sekolah dan dokumentasi kegiatan.', 3);

insert into education (institution, degree, major, period, status, sort_order) values
('Universitas Sumatera Utara', 'Diploma', 'Teknik Informatika', 'Agustus 2025 - Sekarang', 'Sedang menempuh pendidikan', 1),
('Ar Raudlatul Hasanah Medan', 'SMA/SMK/STM', 'IPA (Sains dan Teknologi)', 'Juni 2022 - April 2025', null, 2);

insert into skill (name, category, percentage, icon) values
('Canva', 'Tool', 95, 'figma'),
('Adobe Photoshop', 'Tool', 90, 'image'),
('Microsoft Office', 'Tool', 90, 'file-text'),
('Corel Draw', 'Tool', 85, 'pen-tool'),
('Instagram Marketing', 'Marketing', 90, 'instagram'),
('HTML', 'Language', 95, 'code'),
('CSS', 'Language', 90, 'palette'),
('JavaScript', 'Language', 85, 'braces'),
('Node.js', 'Framework', 80, 'server'),
('VS Code', 'Application', 95, 'terminal-square'),
('MacBook Pro', 'Device', 100, 'laptop');

insert into award (title, organizer, date, description, category) values
('100 Besar Olimpiade Kimia UI', 'Universitas Indonesia', 'Juni 2023', 'Mencapai peringkat 100 besar dalam Olimpiade Kimia tingkat nasional.', 'teknologi');

insert into social (platform, url, icon) values
('GitHub', 'https://github.com/hfdzhummaidiii', 'github'),
('LinkedIn', 'https://linkedin.com/in/ridhopasii', 'linkedin'),
('Instagram', 'https://instagram.com/ridhopasii', 'instagram'),
('Facebook', 'https://facebook.com/ridho.r.p.2025', 'facebook'),
('TikTok', 'https://tiktok.com/@ridhopasii', 'music-2');

insert into project (title, slug, description, tags, demo_url, image_url, featured, category) values
('Web Self-Service Cafe', 'web-self-service-cafe', 'Aplikasi berbasis web, dengan fitur pesan sendiri.', 'html,css,js', 'https://cafealeena.netlify.app/', '', true, 'project'),
('Aplikasi Manajemen Proyek', 'aplikasi-manajemen-proyek', 'Platform kolaborasi tim dengan fitur drag-and-drop.', 'html,css,js', 'https://dwxz0k1l-3000.asse.devtunnels.ms/', '', true, 'project'),
('UI Design Landing Page', 'ui-design-landing-page', 'Konsep landing page modern untuk startup teknologi.', 'figma,ui,ux', '#', '', false, 'design'),
('Video Company Profile', 'video-company-profile', 'Video profil perusahaan dengan efek sinematik.', 'premiere,aftereffects', '#', '', false, 'editing');

commit;

