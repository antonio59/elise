// Usage: node scripts/import-books.mjs <userId> [file]
// Example: node scripts/import-books.mjs k578mmwdrkg80jzzj0j36n2at57y0h37 seed-books.json

import { execSync } from "child_process";

const userId = process.argv[2];
const file = process.argv[3] || "seed-books.json";

if (!userId) {
  console.error("Usage: node scripts/import-books.mjs <userId> [file]");
  console.error("Example: node scripts/import-books.mjs k578mmwdrkg80jzzj0j36n2at57y0h37");
  process.exit(1);
}

// Read and merge all seed files
const fs = await import("fs");
const books = JSON.parse(fs.readFileSync(file, "utf-8"));

console.log(`📚 Importing ${books.length} books for user ${userId}...`);

// Build the Convex CLI command with escaped JSON
const payload = JSON.stringify({ userId, books });
const cmd = `npx convex run books:seedBooks '${payload.replace(/'/g, "'\\''")}'`;

try {
  const result = execSync(cmd, { stdio: "inherit", cwd: process.cwd() });
  console.log("✅ Done!");
} catch (err) {
  console.error("❌ Failed:", err.message);
  process.exit(1);
}
