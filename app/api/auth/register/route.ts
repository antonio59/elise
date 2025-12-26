import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { createHash } from "crypto";

function getClient() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured");
  }
  return new ConvexHttpClient(convexUrl);
}

function getClientHash(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || req.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(ip).digest("hex");
}

function setSessionCookie(
  res: NextResponse,
  token: string,
  maxAgeSeconds: number,
) {
  res.cookies.set("elise_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: maxAgeSeconds,
    path: "/",
  });
}

export async function POST(req: NextRequest) {
  const { email, password, role } = await req.json();

  if (!email || !password || !role) {
    return NextResponse.json(
      { error: "Email, password, and role are required" },
      { status: 400 },
    );
  }

  try {
    const client = getClient();
    const clientHash = getClientHash(req);
    const { token, user, expiresAt } = await client.mutation(
      api.auth.register,
      {
        email,
        password,
        role,
        clientHash,
      },
    );

    const response = NextResponse.json({ token, user });
    const ttlSeconds = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
    setSessionCookie(response, token, ttlSeconds || 60 * 60 * 24 * 30);
    return response;
  } catch (error: any) {
    const message = error.message || "Registration failed";
    const status = message.includes("registered") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
