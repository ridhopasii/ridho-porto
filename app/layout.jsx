import './globals.css';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';

const outfit = Outfit({ 
  subsets: ['latin'], 
  variable: '--font-outfit',
  weight: ['300', '400', '500', '600', '700', '800', '900']
});

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'], 
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700']
});

export const metadata = {
  title: {
    default: 'Ridhopasii | Full Stack Developer',
    template: '%s | Ridhopasii'
  },
  description: 'Portofolio Ridho Robbi Pasi - Full Stack Web Developer & UI/UX Designer yang berfokus pada pembangunan aplikasi web modern, cepat, dan elegan.',
  keywords: ['Web Developer', 'Full Stack Developer', 'Ridho Robbi Pasi', 'Next.js', 'React', 'Portfolio'],
  authors: [{ name: 'Ridho Robbi Pasi' }],
  creator: 'Ridho Robbi Pasi',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://ridhorobbipasi.my.id',
    siteName: 'Ridhopasii Portfolio',
    title: 'Ridhopasii | Full Stack Developer',
    description: 'Penyedia solusi pengembangan web modern dan desain UI/UX berkualitas tinggi.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ridhopasii Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ridhopasii | Full Stack Developer',
    description: 'Portofolio Full Stack Web Developer & UI/UX Designer.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${outfit.variable} ${jakarta.variable}`}>
      <body className="bg-[#0a0a0a] text-white">
        {children}
      </body>
    </html>
  );
}
