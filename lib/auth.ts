import prisma from "./prisma";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "e-mail",
      credentials: {
        email: {
          label: "E-mail",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user) {
          return null;
        }
        const isPasswordCorrect = await compare(
          credentials.password,
          user.password,
        );
        if (!isPasswordCorrect) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          pseudo: user.pseudo,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      const populatedToken = { ...token };
      if (user) {
        // @ts-ignore
        populatedToken.pseudo = user?.pseudo;
        // @ts-ignore
        populatedToken.role = user?.role;
      }
      return populatedToken;
    },
    session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          pseudo: token.pseudo,
          role: token.rule,
        },
      };
    },
    redirect({ baseUrl }) {
      return baseUrl + "/admin";
    },
  },
};
