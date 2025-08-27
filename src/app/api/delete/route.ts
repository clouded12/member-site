import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import Redis from "ioredis";
import { getCurrentUser } from '@/lib/auth';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function DELETE(req: NextRequest) {
  // ユーザー取得
  const user = await getCurrentUser();

  if(!user) {
    return NextResponse.json({ error: 'ログイン認証切れ' }, { status: 401 });
  }

  try {
    // ユーザー削除
    await prisma.user.delete({
      where: { id: user.id },
    });

    // Redisからセッション削除
    const cookieStore = req.cookies;
    const sessionId = cookieStore.get('session_id')?.value;
    if(sessionId) {
      await redis.del(`session:${sessionId}`);
    }

    // クッキーを削除してログアウト扱い
    const response = NextResponse.json({ success: true });
    // クッキーの名前を空文字にして再設定、maxAge:0で即時削除
    response.cookies.set('session_id', '', { maxAge: 0 });

    return response;
  } catch (error) {
    console.error('ユーザー削除エラー', error);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}