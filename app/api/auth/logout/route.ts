import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

function getClient() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured");
  }
  return new ConvexHttpClient(convexUrl);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("elise_session")?.value;
  if (token) {
    try {
      const client = getClient();
      await client.mutation(api.auth.logout, { token });
    } catch (err) {
      console.error("Failed to revoke session", err);
    }
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("elise_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}
