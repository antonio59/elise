#!/usr/bin/env node
// Import books to Elise's account
// Usage: node scripts/seed.mjs <userId>
// Example: node scripts/seed.mjs k578mmwdrkg80jzzj0j36n2at57y0h37

import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { tmpdir } from "os";
import { join } from "path";

const userId = process.argv[2];
if (!userId) {
  console.error("Usage: node scripts/seed.mjs <userId>");
  console.error("Get userId from: npx convex run users:getProfile");
  process.exit(1);
}

const books = JSON.parse(readFileSync("all-books.json", "utf-8"));
console.log(`Seeding ${books.length} books for user ${userId}...`);

const payload = JSON.stringify({ userId, books });

// Write to temp file to avoid shell quoting issues with Unicode
const tmpFile = join(tmpdir(), "convex-seed.json");
writeFileSync(tmpFile, payload, "utf-8");

try {
  execSync(`cat "${tmpFile}" | npx convex run books:seedBooks`, {
    stdio: "inherit",
    cwd: process.cwd(),
  });
  console.log("✅ Done!");
} catch (e) {
  console.error("❌ Failed");
  process.exit(1);
}
