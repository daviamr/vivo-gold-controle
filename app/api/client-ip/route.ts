import { headers } from "next/headers"
import { NextResponse } from "next/server"

function pickClientIp(h: Headers): string {
  const forwarded = h.get("x-forwarded-for")
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim()
    if (first) return first
  }
  const real = h.get("x-real-ip")?.trim()
  if (real) return real
  const cf = h.get("cf-connecting-ip")?.trim()
  if (cf) return cf
  return ""
}

export async function GET() {
  const h = await headers()
  const ip = pickClientIp(h)
  return NextResponse.json({ ip })
}
