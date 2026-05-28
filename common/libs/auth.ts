import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Provide a fallback secret for build time or development if not specified
const nextAuthSecret = process.env.NEXTAUTH_SECRET || "fallback_secret_for_portfolio";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    CredentialsProvider({
      name: "Demo Login",
      credentials: {
        name: { label: "Nama (Name)", type: "text", placeholder: "Ridho Robbi Pasi" },
        email: { label: "Email", type: "email", placeholder: "ridhorobbipasi@gmail.com" },
      },
      async authorize(credentials) {
        if (credentials?.name && credentials?.email) {
          return {
            id: credentials.email,
            name: credentials.name,
            email: credentials.email,
            image: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(credentials.name)}`,
          };
        }
        return null;
      }
    }),
  ],
  secret: nextAuthSecret,
};
