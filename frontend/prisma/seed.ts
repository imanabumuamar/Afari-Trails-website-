import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@afaritrails.com";
  const password = process.env.ADMIN_PASSWORD ?? "changeme123";
  const name = process.env.ADMIN_NAME ?? "Super Admin";
  const role = process.env.ADMIN_ROLE ?? "super_admin";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name, role },
    create: { email, name, passwordHash, role },
  });

  // Legacy installs used role "admin" for the only account — grant user management.
  await prisma.user.updateMany({
    where: { email, role: "admin" },
    data: { role: "super_admin" },
  });

  const superAdminCount = await prisma.user.count({ where: { role: "super_admin" } });

  console.log(`Super admin ready: ${email} (role: ${role})`);
  console.log(`Super admins in database: ${superAdminCount}`);
  console.log("Sign in at /admin/login — then open /admin/users to add admins and editors.");
  console.log("Change ADMIN_PASSWORD in .env.local and re-run: npm run db:seed");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
