import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "@/auth.config";
import { parseRole, type Permission, type Role } from "@/lib/auth/roles";
import { getApiBaseUrl } from "@/lib/api/backend";

type StaffLoginResponse = {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: Role;
    permissions?: Permission[];
  };
  token: string;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials?.email as string | undefined)
          ?.trim()
          .toLowerCase();
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        let res: Response;
        try {
          res = await fetch(`${getApiBaseUrl()}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });
        } catch {
          console.error("[auth] API unreachable — is the backend running?");
          return null;
        }

        if (!res.ok) return null;

        const data = (await res.json()) as StaffLoginResponse;

        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: parseRole(data.user.role),
          permissions: data.user.permissions,
          accessToken: data.token,
        };
      },
    }),
  ],
});
