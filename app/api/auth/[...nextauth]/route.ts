import { EXPIRATION_TIME_IN_SECONDS, signJwtAccessToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: EXPIRATION_TIME_IN_SECONDS,
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
        const { email, password } = credentials || {};
        if (!password || !email) {
          return null;
        }
        const user = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });
        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: userPassword, ...userWithoutPass } = user;
        const accessToken = await signJwtAccessToken(userWithoutPass);
        const result = {
          ...userWithoutPass,
          accessToken,
        };
        return result;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      return { ...token, ...user };
    },
    session({ session, token }) {
      return {
        ...session,
        user: token,
      };
    },
    redirect({ baseUrl }) {
      return baseUrl + "/admin";
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
