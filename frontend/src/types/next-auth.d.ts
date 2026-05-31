import type { Permission, Role } from "@/lib/auth/roles";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: Role;
      permissions?: Permission[];
    };
    accessToken?: string;
  }

  interface User {
    role: Role;
    permissions?: Permission[];
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    permissions?: Permission[];
    accessToken?: string;
  }
}
