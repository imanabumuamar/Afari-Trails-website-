import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const { User } = await import("../src/models/User.model.js");
const { HomepageContent } = await import("../src/models/HomepageContent.model.js");
const {
  getHomepageContent,
  seedVentureContent,
  seedExpeditionContent,
  seedJournalContent,
  seedArchiveContent,
  seedAboutContent,
  seedStoreContent,
  seedSupportContent,
  seedConnectContent,
} = await import("../src/services/content.service.js");

const email = process.env.ADMIN_EMAIL ?? "admin@afaritrails.com";
const password = process.env.ADMIN_PASSWORD ?? "changeme123";
const name = process.env.ADMIN_NAME ?? "Super Admin";
const role = process.env.ADMIN_ROLE ?? "super_admin";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Set MONGODB_URI in backend/.env");
    process.exit(1);
  }

  await mongoose.connect(uri);

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.findOneAndUpdate(
    { email },
    { email, name, passwordHash, role },
    { upsert: true, new: true },
  );

  await User.updateMany({ email, role: "admin" }, { role: "super_admin" });

  await getHomepageContent();
  await seedVentureContent();
  await seedExpeditionContent();
  await seedJournalContent();
  await seedArchiveContent();
  await seedAboutContent();
  await seedStoreContent();
  await seedSupportContent();
  await seedConnectContent();

  const superCount = await User.countDocuments({ role: "super_admin" });
  console.log(`Super admin: ${user.email} (${user.role})`);
  console.log(`Super admins in DB: ${superCount}`);
  console.log(
    "Homepage, venture, expedition, journal, archive, and about content synced to MongoDB",
  );
}

main()
  .catch(console.error)
  .finally(() => mongoose.disconnect());
