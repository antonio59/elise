#!/usr/bin/env python3
"""Seed books into Elise's account via Convex CLI.

Usage:
  python3 scripts/seed.py <userId>
  python3 scripts/seed.py k578mmwdrkg80jzzj0j36n2at57y0h37
"""
import json, subprocess, sys

if len(sys.argv) < 2:
    print("Usage: python3 scripts/seed.py <userId>")
    print("Get userId with: npx convex run users:getProfile")
    sys.exit(1)

user_id = sys.argv[1]

with open("all-books.json", "r") as f:
    books = json.load(f)

payload = json.dumps({"userId": user_id, "books": books})
print(f"📚 Seeding {len(books)} books for user {user_id}...")

result = subprocess.run(
    ["npx", "convex", "run", "books:seedBooks"],
    input=payload,
    capture_output=True,
    text=True,
    cwd=".",
)

print(result.stdout)
if result.returncode != 0:
    print(result.stderr)
    sys.exit(1)

print("✅ Done!")
