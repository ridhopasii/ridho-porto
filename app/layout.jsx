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
  title: 'Ridhopasii | Web Developer',
  description: 'Portfolio of Ridho Pasii - Full Stack Web Developer & UI/UX Designer',
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
