require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing to avoid duplicates in dev
  await prisma.award.deleteMany({});

  const data = [
    {
      title: 'Sertifikat Pelatihan Vokasi Microsoft Office Tingkat Lanjut',
      organizer: 'BBPVP Medan',
      date: '2025-10-01',
      description: 'Program Practical Office Tingkat Lanjut (Excel & Word), 30 JP, 01–03 Okt 2025.',
      certificateUrl: 'https://drive.google.com/open?id=1ZR1rOBFUkAtOmjEA4KuJ2m5t5XXQxiQz',
      category: 'teknologi',
    },
    {
      title: 'Sertifikat Komputer Raudhah Computer Centre (RCC)',
      organizer: 'Raudhah Computer Centre',
      date: '2022-01-01',
      description: 'Pendidikan Komputer Tingkat Administrasi Dasar 1, Predikat MEMUASKAN.',
      certificateUrl: 'https://drive.google.com/open?id=1ZlSO9nva5TTNCfYqEpnQsCwDDn3lZqs0',
      category: 'teknologi',
    },
    {
      title: 'Prinsip Prinsip Video Content Creator',
      organizer: 'Pusat Pengembangan Literasi Digital',
      date: '2025-10-09',
      description: 'Pelatihan Micro Skill Digital Talent Scholarship 2025, 1 JP.',
      certificateUrl: 'https://drive.google.com/open?id=1YwlK-iFH_wnmPA_llbtV_UUBBtGu4DnD',
      category: 'teknologi',
    },
    {
      title: 'Pengantar Mindset Digital 1',
      organizer: 'Pusat Pengembangan Literasi Digital',
      date: '2025-10-15',
      description:
        'Pelatihan Micro Skill Digital Talent Scholarship 2025, 2 JP (Elemen Kunci Mindset Digital).',
      certificateUrl: 'https://drive.google.com/open?id=1JRjsfp0W1Ctj64hCTx5XYMp-giqbFCQF',
      category: 'teknologi',
    },
    {
      title: 'E-Sertifikat Short Class Digital Marketing',
      organizer: 'BBPVP Medan',
      date: '2025-10-11',
      description: 'Peserta Short Class Digital Marketing dalam Pekan Vokasi.',
      certificateUrl: 'https://drive.google.com/open?id=1WbfXPsEjsBW8Tl71imZCC7u4IAjQDfp0',
      category: 'teknologi',
    },
    {
      title: 'Sertifikat Penghargaan Canva Goes to Campus',
      organizer: 'Canva PIJAR',
      date: '2025-09-23',
      description: 'Peserta “Kerja Rapi dan Gesit Bersama Canva Sheets” di Aula FISIP USU.',
      certificateUrl: 'https://drive.google.com/open?id=1ndTEVzefpnPJqIF_BwcIrSJtzD7AvUEu',
      category: 'teknologi',
    },
    {
      title: 'SERTIFIKAT GOOGLE',
      organizer: 'Google',
      date: '2025-10-11',
      description: 'Credential dengan masa berlaku 11/10/2025 – 10/10/2028.',
      certificateUrl: 'https://drive.google.com/open?id=1jJ6h2ni-wNc94k_B1aYdkQnZ55l81SjN',
      category: 'teknologi',
    },
    {
      title: 'Workshop Penulisan: Ternyata Menulis Itu Mudah',
      organizer: 'Ngaji Literasi',
      date: '2022-10-07',
      description: 'Peserta Workshop Penulisan di Pondok Pesantren Ar-Raudlatul Hasanah.',
      certificateUrl: 'https://drive.google.com/open?id=1ZVebilEwtEGiMBBLCSk8gd_Bs8JsIOE-',
      category: 'soft-skill',
    },
    {
      title: '100 Besar Peserta Chemistry Competition UI 2022',
      organizer: 'Chemistry Fair UI 2022',
      date: '2022-11-20',
      description: 'Masuk 100 Besar Peserta Chemistry Competition (28 Okt – 20 Nov 2022).',
      certificateUrl: 'https://drive.google.com/open?id=1Zo_P4rMNSqbA0TwMRkjs8wcDGqvk7CjA',
      category: 'soft-skill',
    },
    {
      title: 'Juara 2 Tahfiz Juz 30 dan Juz 1',
      organizer: 'Ar-Raudlatul Hasanah 40th Anniversary Competition',
      date: '2022-10-26',
      description: 'Juara 2 Tahfiz Juz 30 dan Juz 1 (7–26 Okt 2022).',
      certificateUrl: 'https://drive.google.com/open?id=1ZRIF1QLy9LJmy1kE-CID_mFiWpCzFtxq',
      category: 'soft-skill',
    },
    {
      title: "Sertifikat Tahfiz Al-Qur'an Juz 2 Hidayatullah",
      organizer: 'Hidayatullah',
      date: '2022-01-01',
      description: "Menyelesaikan hafalan Juz 2 Al-Qur'an secara lisan.",
      certificateUrl: 'https://drive.google.com/open?id=1ZWXSNZfud57lOJ3Wp0m1nD-acDbBRV6_',
      category: 'soft-skill',
    },
    {
      title: 'Sertifikat Penghargaan Sehari Jadi CEO',
      organizer: 'Creative Student Home (CreSHome)',
      date: '2025-08-31',
      description: 'Peserta “Lead The Day, Shape The Future”.',
      certificateUrl: 'https://drive.google.com/open?id=1zPHiVLt8QPO7Yez0p5or-VOxHi9nvnbm',
      category: 'soft-skill',
    },
    {
      title: 'Sertifikat Youth Today x Join AIESEC 2025',
      organizer: 'AIESEC in USU',
      date: '2025-09-13',
      description: 'Peserta “Shaping Purpose, Leading Change: A Youth Journey with AIESEC”.',
      certificateUrl: 'https://drive.google.com/open?id=1OklEIeIrb8fUuPmbbXs1ymTTW1A9H3rO',
      category: 'soft-skill',
    },
    {
      title: 'Sertifikat Best Member Saudi 3 Hostel',
      organizer: 'Ar-Raudlatul Hasanah',
      date: '2022-01-01',
      description: 'The Best Member from Saudi 3 Hostel in Running Discipline.',
      certificateUrl: 'https://drive.google.com/open?id=1ZmL_8ocw4Xqd15_E7K8FNHtnxE6H8eo1',
      category: 'soft-skill',
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
