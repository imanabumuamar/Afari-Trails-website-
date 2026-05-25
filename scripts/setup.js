#!/usr/bin/env node
/**
 * One-command project setup (no Docker required).
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function run(cmd, args, cwd = root) {
  console.log(`\n> ${cmd} ${args.join(" ")}\n`);
  const r = spawnSync(cmd, args, { cwd, stdio: "inherit", shell: false });
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}

function copyIfMissing(src, dest) {
  if (!fs.existsSync(dest) && fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`[setup] Created ${path.relative(root, dest)}`);
  }
}

function syncBackendAdminEnv() {
  const frontEnv = path.join(root, "frontend/.env.local");
  const backEnv = path.join(root, "backend/.env");
  if (!fs.existsSync(frontEnv) || !fs.existsSync(backEnv)) return;

  const front = fs.readFileSync(frontEnv, "utf8");
  const get = (key) => front.match(new RegExp(`^${key}=(.+)$`, "m"))?.[1]?.trim();

  let back = fs.readFileSync(backEnv, "utf8");
  const set = (key, val) => {
    if (!val) return;
    if (back.includes(`${key}=`)) {
      back = back.replace(new RegExp(`^${key}=.*$`, "m"), `${key}=${val}`);
    } else {
      back += `\n${key}=${val}`;
    }
  };

  set("ADMIN_EMAIL", get("ADMIN_EMAIL"));
  set("ADMIN_PASSWORD", get("ADMIN_PASSWORD"));
  set("ADMIN_NAME", get("ADMIN_NAME") || "Super Admin");
  set("ADMIN_ROLE", "super_admin");

  fs.writeFileSync(backEnv, back);
}

function cleanFrontendEnv() {
  const p = path.join(root, "frontend/.env.local");
  if (!fs.existsSync(p)) return;
  let text = fs.readFileSync(p, "utf8");
  text = text
    .replace(/^DATABASE_URL=.*\n?/m, "")
    .replace(/# Database \(SQLite.*\n?/g, "")
    .replace(/# Path is relative.*\n?/g, "");

  if (!text.includes("API_INTERNAL_URL=")) {
    text += "\nAPI_INTERNAL_URL=http://localhost:4000/api\n";
  }
  if (!text.includes("ADMIN_ROLE=")) {
    text += "ADMIN_ROLE=super_admin\n";
  }
  fs.writeFileSync(p, text.trim() + "\n");
}

console.log("=== Afari Trails setup ===\n");

copyIfMissing(path.join(root, "backend/.env.example"), path.join(root, "backend/.env"));
copyIfMissing(path.join(root, "frontend/.env.example"), path.join(root, "frontend/.env.local"));

cleanFrontendEnv();
syncBackendAdminEnv();

fs.mkdirSync(path.join(root, "data/mongo"), { recursive: true });

run("npm", ["install"]);
run("npm", ["install"], path.join(root, "backend"));
run("npm", ["install"], path.join(root, "frontend"));

run("node", ["scripts/ensure-mongo.js"]);
run("node", ["scripts/fix-broken-images.js"]);
run("npm", ["run", "seed"], path.join(root, "backend"));
run("npm", ["run", "sync"], path.join(root, "backend"));

console.log(`
=== Setup complete ===

Start the site (API + frontend):

  cd ${root}
  npm run dev

Then open:
  http://localhost:3000/admin/login

  Email:    admin@afaritrails.com
  Password: changeme123  (from frontend/.env.local)

Verify anytime:  npm run doctor
`);
