import type { NextAuthConfig } from "next-auth";
import type { Permission } from "@/lib/auth/roles";
import { parseRole } from "@/lib/auth/roles";

/**
 * Edge-safe auth config (no database). Used by middleware.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.role = parseRole(user.role);
        if (user.name) token.name = user.name;

        const withToken = user as {
          accessToken?: string;
          permissions?: Permission[];
        };
        if (withToken.accessToken) {
          token.accessToken = withToken.accessToken;
        }
        if (withToken.permissions?.length) {
          token.permissions = withToken.permissions;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = parseRole(token.role as string | undefined);
        if (token.name) session.user.name = token.name as string;
        if (token.permissions) {
          session.user.permissions = token.permissions as Permission[];
        }
      }
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;
