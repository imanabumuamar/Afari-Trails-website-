#!/usr/bin/env node
/**
 * Replaces broken Unsplash URLs and missing /images/* paths in CMS JSON + data files.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const frontend = path.join(root, "frontend");

/** Verified HTTP 200 on images.unsplash.com */
const PHOTO_POOL = [
  "photo-1506905925346-21bda4d32df4",
  "photo-1441974231531-c6227db76b6e",
  "photo-1472214103451-9374bd1c798e",
];

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function unsplashUrl(photoId, width = 1200) {
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=80`;
}

function replaceImageUrl(value) {
  if (typeof value !== "string") return value;

  if (value.includes("images.unsplash.com")) {
    const w = value.match(/[?&]w=(\d+)/)?.[1] ?? "1200";
    const id = PHOTO_POOL[hash(value) % PHOTO_POOL.length];
    return unsplashUrl(id, w);
  }

  if (/^\/images\/.+\.(png|jpe?g|webp|gif)$/i.test(value)) {
    const id = PHOTO_POOL[hash(value) % PHOTO_POOL.length];
    return unsplashUrl(id, 1600);
  }

  return value;
}

function walk(value) {
  if (typeof value === "string") return replaceImageUrl(value);
  if (Array.isArray(value)) return value.map(walk);
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = walk(v);
    return out;
  }
  return value;
}

function processJsonFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(raw);
  const next = walk(data);
  const out = `${JSON.stringify(next, null, 2)}\n`;
  if (out !== raw) {
    fs.writeFileSync(filePath, out);
    return true;
  }
  return false;
}

function processTsFile(filePath) {
  let raw = fs.readFileSync(filePath, "utf8");
  let changed = false;
  const unsplashRe =
    /https:\/\/images\.unsplash\.com\/[^\s"'`]+/g;
  const localRe = /\/images\/[^\s"'`]+\.(?:png|jpe?g|webp|gif)/gi;

  raw = raw.replace(unsplashRe, (url) => {
    changed = true;
    return replaceImageUrl(url);
  });
  raw = raw.replace(localRe, (url) => {
    changed = true;
    return replaceImageUrl(url);
  });

  if (changed) {
    fs.writeFileSync(filePath, raw);
  }
  return changed;
}

function collectFiles(dir, ext, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) collectFiles(p, ext, acc);
    else if (name.endsWith(ext)) acc.push(p);
  }
  return acc;
}

let fixed = 0;
for (const file of collectFiles(path.join(frontend, "content"), ".json")) {
  if (processJsonFile(file)) {
    console.log("[fix-images] updated", path.relative(root, file));
    fixed++;
  }
}

for (const file of collectFiles(path.join(frontend, "src/lib/data"), ".ts")) {
  if (processTsFile(file)) {
    console.log("[fix-images] updated", path.relative(root, file));
    fixed++;
  }
}

console.log(
  fixed
    ? `[fix-images] Done — ${fixed} file(s) updated.`
    : "[fix-images] No image URLs needed changes.",
);
