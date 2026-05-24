#!/usr/bin/env node
/**
 * Verifies MongoDB is reachable. Does not require Docker.
 */
import { spawn } from "child_process";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

dotenv.config({ path: path.join(root, "backend/.env") });

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/afari-trails";

async function tryConnect() {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    await mongoose.disconnect();
    return true;
  } catch {
    return false;
  }
}

function run(cmd, args) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: "ignore", shell: false });
    child.on("error", () => resolve(false));
    child.on("close", (code) => resolve(code === 0));
  });
}

async function tryStartMongo() {
  console.log("[mongo] Not running — trying to start…");

  if (await run("brew", ["services", "start", "mongodb-community"])) {
    await sleep(3000);
    if (await tryConnect()) return true;
  }
  if (await run("brew", ["services", "start", "mongodb"])) {
    await sleep(3000);
    if (await tryConnect()) return true;
  }

  const mongod = spawn("mongod", ["--dbpath", path.join(root, "data/mongo")], {
    detached: true,
    stdio: "ignore",
  });
  mongod.unref();
  await sleep(2500);
  return tryConnect();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  if (await tryConnect()) {
    console.log("[mongo] Connected:", uri);
    process.exit(0);
  }

  const started = await tryStartMongo();
  if (started) {
    console.log("[mongo] Started and connected:", uri);
    process.exit(0);
  }

  console.error(`
[mongo] Could not connect to MongoDB at:
  ${uri}

Install MongoDB (https://www.mongodb.com/try/download/community) or use Atlas:
  1. Create a free cluster at mongodb.com/atlas
  2. Put your connection string in backend/.env as MONGODB_URI=

Then run again:  npm run setup
`);
  process.exit(1);
}

main();
