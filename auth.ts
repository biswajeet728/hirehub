import NextAuth, { User as UserType } from "next-auth";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "./db/connection";
import User from "./db/models/_user.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectToDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          return null;
        }

        const isValid = await compare(
          String(credentials.password),
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          email: user.email,
          fullName: user.fullName,
          phone: user.phone,
          role: user.role,
        } as UserType;
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.fullName = user.fullName;
        token.phone = user.phone;
        token.role = user.role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.fullName = token.fullName as string;
        session.user.phone = token.phone as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
});
