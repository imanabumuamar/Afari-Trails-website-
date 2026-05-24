import type { Role } from "@/lib/auth/roles";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role: Role;
    };
    accessToken?: string;
  }

  interface User {
    role: Role;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    accessToken?: string;
  }
}
