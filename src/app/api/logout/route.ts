import Redis from "ioredis";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function POST() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("session_id")?.value;

  if (sessionId) {
    // Redis からセッション削除
    await redis.del(`session:${sessionId}`);
  }

  // Cookie を削除
  const response = NextResponse.json({ message: "Logged out" });
  response.cookies.set("session_id", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0), // 即時無効化
  });

  return response;
}
