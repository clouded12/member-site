import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const SESSION_TTL_SECONDS = 60 * 60;  // 1時間

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // bcryptを使ってハッシュと比較
    const isPasswordValid = await bcrypt.compare(password,
      user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // JWTを発行(payload に userId)
    const token = jwt.sign({ userId: user.id}, JWT_SECRET, { expiresIn: "1h"});

    // セッションIDを生成し、Redisに保存
    const sessionId = uuidv4();
    await redis.set(`session:${sessionId}`, token, "EX", SESSION_TTL_SECONDS);

    // クッキーにsessionIdを保存(HttpOnly)
    const response = NextResponse.json({
      message: "Login successful",
      username: user.username,
      email: user.email,
    });

    response.cookies.set("session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });

    return response;
    // return NextResponse.json({
    //   message: 'Login successful',
    //   username: user.username,
    //   email: user.email,
    // });
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json({ error: 'Login failed', detail: err.message }, { status: 500 });
  }
}