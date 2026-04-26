import './globals.css';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  metadataBase: new URL('https://ridhorobbipasi.my.id'),
  title: {
    default: 'Ridho Robbi Pasi | Web Developer & UI/UX Designer',
    template: '%s | Ridho Robbi Pasi',
  },
  description:
    'Portofolio Profesional Ridho Robbi Pasi - Full Stack Developer spesialis Next.js & UI/UX. Lihat proyek terbaru, blog teknologi, dan pengalaman kerja saya.',
  keywords: [
    'Ridho Robbi Pasi',
    'Web Developer',
    'UI/UX Designer',
    'Next.js Developer Indonesia',
    'React Developer',
    'Full Stack Developer Indonesia',
  ],
  authors: [{ name: 'Ridho Robbi Pasi' }],
  creator: 'Ridho Robbi Pasi',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://ridhorobbipasi.my.id',
    siteName: 'Ridho Robbi Pasi Portfolio',
    title: 'Ridho Robbi Pasi | Solusi Web Modern & Desain Premium',
    description:
      'Bangun aplikasi web impian Anda bersama Ridho Robbi Pasi. Cepat, Responsif, dan Elegan.',
    images: [
      {
        url: 'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/profile/1777209637898-wtsmkwvdjng.jpg',
        width: 1200,
        height: 630,
        alt: 'Ridho Robbi Pasi Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ridho Robbi Pasi | Full Stack Web Developer',
    description: 'Transformasi ide Anda menjadi produk digital yang luar biasa.',
    images: [
      'https://uuybelgxovlgozgizith.supabase.co/storage/v1/object/public/portofolio/profile/1777209637898-wtsmkwvdjng.jpg',
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${outfit.variable} ${jakarta.variable}`}>
      <body className="bg-[#0a0a0a] text-white">{children}</body>
    </html>
  );
}
