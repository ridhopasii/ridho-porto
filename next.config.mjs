import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

// Validate critical environment variables at build/startup time
try {
  if (!process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET.trim() === '') {
    throw new Error(
      '❌ Missing required environment variable: NEXTAUTH_SECRET\n' +
      '   Description: NextAuth.js secret for JWT signing and encryption\n' +
      '   Please set this variable in your .env.local file or deployment configuration.'
    );
  }
} catch (error) {
  console.error('\n🚨 STARTUP VALIDATION FAILED 🚨\n');
  console.error(error.message);
  console.error('\nApplication cannot start without required environment variables.\n');
  process.exit(1);
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
