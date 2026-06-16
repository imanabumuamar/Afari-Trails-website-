import type { NextAuthConfig } from "next-auth";
import type { Permission } from "@/lib/auth/roles";
import { parseRole } from "@/lib/auth/roles";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 3;

const useSecureCookies = process.env.NODE_ENV === "production";

/**
 * Edge-safe auth config (no database). Used by middleware.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE_SECONDS,
    // Do not extend the session while browsing — hard cap from sign-in.
    updateAge: SESSION_MAX_AGE_SECONDS,
  },
  // Browser-session cookie (no Max-Age) so closing the browser clears login.
  cookies: {
    sessionToken: {
      name: `${useSecureCookies ? "__Secure-" : ""}authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const now = Math.floor(Date.now() / 1000);
        token.authExpiresAt = now + SESSION_MAX_AGE_SECONDS;
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

      if (
        typeof token.authExpiresAt === "number" &&
        Math.floor(Date.now() / 1000) > token.authExpiresAt
      ) {
        return null;
      }

      return token;
    },
    session({ session, token }) {
      if (!token) {
        return { ...session, expires: new Date(0).toISOString() };
      }
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
