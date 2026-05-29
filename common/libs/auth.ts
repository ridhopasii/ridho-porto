import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const nextAuthSecret = process.env.NEXTAUTH_SECRET;
if (!nextAuthSecret && process.env.NODE_ENV === "production") {
  throw new Error("NEXTAUTH_SECRET environment variable must be set in production");
}

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
  secret: nextAuthSecret ?? "fallback_secret_for_development_only",
};
