/**
 * Create or update a staff account from the command line.
 *
 * Usage:
 *   npm run admin:create -- --email you@example.com --password "long-password" --role super_admin
 *   npm run admin:create -- --email editor@example.com --password "long-password" --role editor --name "Jane"
 */
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { isRole, ROLES, type Role } from "../src/lib/auth/roles";

const prisma = new PrismaClient();

function readArg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  if (i === -1 || i + 1 >= process.argv.length) return undefined;
  return process.argv[i + 1];
}

async function main() {
  const email = readArg("--email")?.trim().toLowerCase();
  const password = readArg("--password");
  const name = readArg("--name")?.trim() || null;
  const roleArg = readArg("--role") ?? "editor";

  if (!email || !password) {
    console.error(
      "Usage: npm run admin:create -- --email <email> --password <password> [--role super_admin|admin|editor|viewer] [--name \"Name\"]",
    );
    console.error(`Roles: ${ROLES.join(", ")}`);
    process.exit(1);
  }

  if (!isRole(roleArg)) {
    console.error(`Invalid role "${roleArg}". Use: ${ROLES.join(", ")}`);
    process.exit(1);
  }

  if (password.length < 10) {
    console.error("Password must be at least 10 characters.");
    process.exit(1);
  }

  const role = roleArg as Role;
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name, role },
    create: { email, name, passwordHash, role },
    select: { email: true, name: true, role: true },
  });

  console.log(`Staff account ready: ${user.email} (${user.role})`);
  if (role === "super_admin") {
    console.log("This account can add admins and editors at /admin/users");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
