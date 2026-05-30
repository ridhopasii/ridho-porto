import NextTopLoader from "nextjs-toploader";
import Script from "next/script";

import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "../globals.css";

import Layouts from "@/common/components/layouts";
import ThemeProviderContext from "@/common/stores/theme";
import NextAuthProvider from "@/common/providers/NextAuthProvider";
import { METADATA } from "@/common/constants/metadata";
import { plusJakartaSans } from "@/common/styles/fonts";
import SkeletonThemeProvider from "@/common/providers/SkeletonThemeProvider";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.DOMAIN || "https://www.ridhorobbipasi.my.id",
  ),
  title: {
    default: METADATA.creator,
    template: `%s ${METADATA.exTitle}`,
  },
  description: METADATA.description,
  keywords: METADATA.keyword,
  creator: METADATA.creator,
  authors: {
    name: METADATA.creator,
    url: METADATA.openGraph.url,
  },
  openGraph: {
    images: METADATA.openGraph.image,
    url: METADATA.openGraph.url,
    siteName: METADATA.openGraph.siteName,
    locale: METADATA.openGraph.locale,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: METADATA.creator,
    description: METADATA.description,
    images: [METADATA.openGraph.image],
  },
  icons: {
    icon: [
      { url: "/api/logo", sizes: "any" },
      { url: "/api/logo?w=16", sizes: "16x16", type: "image/png" },
      { url: "/api/logo?w=32", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/api/logo?w=180", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const RootLayout = async ({
  children,
  params,
}: RootLayoutProps) => {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <head>
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="91c868c5-2a89-4a1d-b292-56c40ea30137"
        />
      </head>
      <body className={`${plusJakartaSans.className} bg-light text-neutral-800 transition-colors duration-300 dark:bg-dark dark:text-neutral-200`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "name": METADATA.creator,
                  "url": "https://www.ridhorobbipasi.my.id",
                  "image": METADATA.profile,
                  "jobTitle": "Software Engineer",
                  "alumniOf": {
                    "@type": "EducationalOrganization",
                    "name": "Universitas Sumatera Utara (USU)"
                  },
                  "sameAs": [
                    "https://github.com/ridhorobbipasi",
                    "https://www.linkedin.com/in/ridhorobbipasi",
                    "https://www.instagram.com/ridhorobbipasi"
                  ]
                },
                {
                  "@type": "WebSite",
                  "name": METADATA.creator,
                  "url": "https://www.ridhorobbipasi.my.id",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://www.ridhorobbipasi.my.id/id/blog?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "SiteNavigationElement",
                  "@id": "https://www.ridhorobbipasi.my.id/#navigation",
                  "hasPart": [
                    {
                      "@type": "WebPage",
                      "name": "Projects",
                      "url": "https://www.ridhorobbipasi.my.id/id/projects"
                    },
                    {
                      "@type": "WebPage",
                      "name": "Karir & Pengalaman",
                      "url": "https://www.ridhorobbipasi.my.id/id/karir"
                    },
                    {
                      "@type": "WebPage",
                      "name": "Pendidikan",
                      "url": "https://www.ridhorobbipasi.my.id/id/pendidikan"
                    },
                    {
                      "@type": "WebPage",
                      "name": "Blog & Artikel",
                      "url": "https://www.ridhorobbipasi.my.id/id/blog"
                    },
                    {
                      "@type": "WebPage",
                      "name": "Pencapaian",
                      "url": "https://www.ridhorobbipasi.my.id/id/achievements"
                    },
                    {
                      "@type": "WebPage",
                      "name": "Guestbook",
                      "url": "https://www.ridhorobbipasi.my.id/id/guestbook"
                    }
                  ]
                }
              ]
            })
          }}
        />
        <Toaster position="top-center" />
        <NextTopLoader
          color="#fbe400"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #fbe400,0 0 5px #ffffb8"
        />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <NextAuthProvider>
            <ThemeProviderContext>
              <SkeletonThemeProvider>
                <Layouts>{children}</Layouts>
              </SkeletonThemeProvider>
            </ThemeProviderContext>
          </NextAuthProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
