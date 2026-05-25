import { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { validateEnvVar } from "./env-validation";

// Validate critical environment variables at module load time
const nextAuthSecret = validateEnvVar(
  'NEXTAUTH_SECRET',
  'NextAuth.js secret for JWT signing and encryption'
);

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
  ],
  secret: nextAuthSecret,
};
