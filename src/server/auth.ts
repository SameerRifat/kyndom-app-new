import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env";
import { LoginSchema } from "@/lib/schemas/auth/login";
import { db } from "@/server/db";
import bcrypt from "bcrypt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      // ...other properties
      onboarded: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    onboarded: boolean;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.onboarded = user.onboarded
      }
      return token;
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...token,
          id: token.id,
          onboarded: token.onboarded
        },
      };
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(db),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password " },
      },
      async authorize(credentials, req) {
        try {
          const validInput = await LoginSchema.parseAsync(credentials);

          const user = await db.user.findUnique({
            where: { email: validInput.email },
          });
          if (!user || !user.password) throw new Error("Invalid credentails");
          if (!user.emailVerified)
            throw new Error(
              "Please verify your email address before attempting to login",
            );

          const pwValid = await bcrypt.compare(
            validInput.password,
            user.password,
          );
          if (!pwValid) throw new Error("Invalid credentails");

          return user;
        } catch (err) {
          const message = String(
            !!err
              ? typeof err === "object" && "message" in err
                ? err.message
                : err
              : "Unknown error",
          );
          throw new Error(message);
        }
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
