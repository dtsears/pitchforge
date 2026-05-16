import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as NextAuthOptions["adapter"],
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async signIn({ user }) {
      // Auto-link authenticated users to the Bluehost org if not already linked
      if (user.email) {
        const bluehost = await db.organization.findUnique({
          where: { domain: "bluehost.com" },
        });
        if (bluehost) {
          await db.user.update({
            where: { email: user.email },
            data: { orgId: bluehost.id },
          });
        }
      }
      return true;
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
