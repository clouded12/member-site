import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";
import Redis from "ioredis";
import { getCurrentUser } from '@/lib/auth';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function DELETE(req: NextRequest) {
  const cookieStore = req.cookies;
  const sessionId = cookieStore.get('session_id')?.value;
  // ユーザー取得
  const user = await getCurrentUser();

  if(!user) {
     // セッション削除して強制ログアウト（セッションだけ残っていた場合）
    if (sessionId) {
      await redis.del(`session:${sessionId}`);
    }
    console.log('未認証のユーザーです');
    const response = NextResponse.json({ error: 'ログイン認証切れ' }, { status: 401 });
    response.cookies.set('session_id', '', { maxAge: 0 });
    return response;
    // return NextResponse.json({ error: 'ログイン認証切れ' }, { status: 401 });
  }

  console.log('削除対象ユーザー:', user);

  try {
    // 先にtodoのデータを破棄
    await prisma.todo.deleteMany({
      where: { userId: user.id },
    })
    // ユーザー削除
    await prisma.user.delete({
      where: { id: user.id },
    });

    // Redisからセッション削除
    // const cookieStore = req.cookies;
    // const sessionId = cookieStore.get('session_id')?.value;
    // console.log('削除対象セッションID:', sessionId); 

    if(sessionId) {
      await redis.del(`session:${sessionId}`);
    }

    // クッキーを削除してログアウト扱い
    const response = NextResponse.json({ success: true });
    // クッキーの名前を空文字にして再設定、maxAge:0で即時削除
    response.cookies.set('session_id', '', { maxAge: 0 });

    return response;
  } catch (error: unknown) {
  if (error instanceof Error) {
    console.error('ユーザー削除エラー:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  } else {
    console.error('未知のエラー:', error);
  }

  return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
}
}