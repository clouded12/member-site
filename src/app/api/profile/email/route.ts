import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Redis from "ioredis";
import { PrismaClient } from "@/generated/prisma";

// RedisとPrismaのインスタンスを初期化
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export async function PUT(request: Request) {
  try {
    // 認証済みユーザーの確認
    const sessionId = (await cookies()).get('session_id')?.value;
    if(!sessionId) {
      return NextResponse.json({ error: 'Not authenticated' },
        {status: 401});
    }

    const token = await redis.get(`session:${sessionId}`);
    if (!token) {
      return NextResponse.json({ error: 'Invalid or expired session '}, { status: 401 });
    }

    let payload: { userId: number };
    try {
      payload = jwt.verify(token, JWT_SECRET) as { userId: number };
    } catch (err) {
      return NextResponse.json({ error: 'Invalid token' }, 
      { status: 401 });
    }

    const userId = payload.userId;

    // リクエストボディから新しいメールアドレスを取得
    const { email } = await request.json();

    // サーバー側でメールアドレス形式を再バリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: '有効なメールアドレスを入力してください。' }, { status: 400 });
    }

    // メールアドレスの一意性を確認
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json({ error: 'このメールアドレスは既に使用されています。' }, { status: 409 });
    }

    // データベースを更新
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { email },
      // 更新後のユーザー情報を取得
      select: { id: true, username: true, email: true },
    });

    return NextResponse.json({ user: updatedUser },
      { status: 200 });
  } catch (err: any) {
    console.error('User profile update error:', err);
    return NextResponse.json({ error: 'Failed to update user profile', detail: err.message }, { status: 500 });
  }
}

