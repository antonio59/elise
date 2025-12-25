import { NextRequest, NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import { createHash } from "crypto"

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
if (!convexUrl) throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured")

const client = new ConvexHttpClient(convexUrl)

function getClientHash(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  const ip = forwarded || req.headers.get("x-real-ip") || req.ip || "unknown"
  return createHash("sha256").update(ip).digest("hex")
}

function setSessionCookie(res: NextResponse, token: string, maxAgeSeconds: number) {
  res.cookies.set("elise_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: maxAgeSeconds,
    path: "/",
  })
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
  }

  try {
    const clientHash = getClientHash(req)
    const { token, user, expiresAt } = await client.mutation(api.auth.login, {
      email,
      password,
      clientHash,
    })

    const response = NextResponse.json({ token, user })
    const ttlSeconds = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
    setSessionCookie(response, token, ttlSeconds || 60 * 60 * 24 * 30)
    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 401 })
  }
}
