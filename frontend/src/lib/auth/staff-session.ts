import { auth } from "@/auth";
import { backendFetch } from "@/lib/api/backend";
import { parseRole, type Permission, type Role } from "@/lib/auth/roles";

type MeResponse = {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    permissions?: Permission[];
  };
};

/** Server-only: session with role and permissions refreshed from MongoDB via the API. */
export async function getStaffSession() {
  const session = await auth();
  if (!session?.user?.email || !session.accessToken) return session;

  const { data, ok } = await backendFetch<MeResponse>("/auth/me", {
    token: session.accessToken,
  });

  if (!ok || !data?.user) return session;

  const role = parseRole(data.user.role);
  return {
    ...session,
    user: {
      ...session.user,
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      role,
      permissions: data.user.permissions,
    },
  };
}

export async function getStaffRole(): Promise<Role | null> {
  const session = await getStaffSession();
  return session?.user?.role ?? null;
}

export async function getStaffPermissions(): Promise<Permission[] | null> {
  const session = await getStaffSession();
  return session?.user?.permissions ?? null;
}

export async function getStaffAccessToken(): Promise<string | null> {
  const session = await auth();
  return session?.accessToken ?? null;
}
