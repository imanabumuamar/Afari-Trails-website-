import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@afaritrails.com";
  const password = process.env.ADMIN_PASSWORD ?? "changeme123";
  const name = process.env.ADMIN_NAME ?? "Admin";

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name, role: "admin" },
    create: { email, name, passwordHash, role: "admin" },
  });

  console.log(`Admin ready: ${email}`);
  console.log("Change ADMIN_PASSWORD in .env.local and re-run seed.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
