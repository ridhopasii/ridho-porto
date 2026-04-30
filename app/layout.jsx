import './globals.css';
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/react';
import ErrorBoundary from '@/components/ErrorBoundary';
import Chatbot from '@/components/Chatbot';
import CustomCursor from '@/components/CustomCursor';
import AccentProvider from '@/components/AccentProvider';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { createClient } from '@/utils/supabase/server';

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

export default async function RootLayout({ children }) {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from('SiteSettings')
    .select('*')
    .eq('key', 'accent_color')
    .single();
  const accentColor = settings?.value || '#14b8a6';

  return (
    <html lang="id" className={`${outfit.variable} ${jakarta.variable} dark`} suppressHydrationWarning>
      <head>
        {/* Preconnect to critical third-party origins to reduce LCP resource load delay */}
        <link rel="preconnect" href="https://uuybelgxovlgozgizith.supabase.co" />
        <link rel="dns-prefetch" href="https://uuybelgxovlgozgizith.supabase.co" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-body text-foreground">
        <LanguageProvider>
          <AccentProvider color={accentColor}>
            <ErrorBoundary>
              <ThemeProvider>
              <Analytics />
              {children}
              <Chatbot />
            </ThemeProvider>
          </ErrorBoundary>
          </AccentProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
