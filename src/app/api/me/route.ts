// app/api/me/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Redis from "ioredis";
import { PrismaClient } from "@/generated/prisma";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function GET() {
  try {
    // 1. クッキーから session_id を取得
    const cookieStore = cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    if (!sessionId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 2. Redis から JWT を取得
    const token = await redis.get(`session:${sessionId}`);
    if (!token) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 },
      );
    }

    // 3. JWT を検証して userId を取得
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 4. userId からユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, username: true, email: true }, // 必要な情報だけ
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to get user", detail: err.message },
      { status: 500 },
    );
  }
}
