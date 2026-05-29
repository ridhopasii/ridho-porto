import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["react-icons"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Supabase storage — lock down to your specific project
        protocol: "https",
        hostname: "uuybelgxovlgozgizith.supabase.co",
      },
      {
        // Allow other supabase subdomains for flexibility
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        // Various logo/image sources used in career & org cards
        protocol: "https",
        hostname: "logo.clearbit.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
