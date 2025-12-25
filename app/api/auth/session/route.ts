import { NextRequest, NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
if (!convexUrl) throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured")

const client = new ConvexHttpClient(convexUrl)

export async function GET(req: NextRequest) {
  const token = req.cookies.get("elise_session")?.value
  if (!token) {
    return NextResponse.json({ token: null, user: null })
  }

  try {
    const user = await client.query(api.auth.getSession, { token })
    if (!user) {
      const res = NextResponse.json({ token: null, user: null })
      res.cookies.set("elise_session", "", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      })
      return res
    }

    return NextResponse.json({ token, user })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unable to fetch session" }, { status: 500 })
  }
}
