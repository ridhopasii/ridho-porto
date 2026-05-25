import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

// Only validate NEXTAUTH_SECRET strictly if we are NOT in build phase
// Vercel build phase may not inject all runtime secrets depending on configuration
if (process.env.NODE_ENV !== "development" && !process.env.VERCEL_ENV) {
  try {
    // Only warn during build, don't crash
    if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.trim() === '') {
      console.warn(
        '⚠️ Missing required environment variable: NEXTAUTH_SECRET\n' +
        '   Please ensure this is set in your runtime environment.'
      );
    }
  } catch (error) {
    console.error(error.message);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
