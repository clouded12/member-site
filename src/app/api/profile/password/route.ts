import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Redis from "ioredis";
import { PrismaClient } from "@/generated/prisma";
import bcrypt from "bcrypt";
import { error } from "console";

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

    // リクエストボディから今のパスワードと新しいパスワードを取得
    const { currentPassword, newPassword } 
    = await request.json();

    // バリデーション
    if (!currentPassword || !newPassword || 
      newPassword.length < 6) {
      return NextResponse.json({ error: '現在のパスワードと、8文字以上の新しいパスワードを入力してください。' }, 
      { status: 400 });
    }

    // ユーザーをデータベースから取得
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' },
        { status: 404 });
    }

    // 現在のパスワードが正しいか確認
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if(!isPasswordValid) {
      return NextResponse.json({ error: '現在のパスワードが正しくありません。' }, { status: 401 });
    }

    // 新しいパスワードをハッシュ化
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // データベースを更新
    await prisma.user.update({
      where: { id: userId },
      data: { password: newPasswordHash},
    });

    // セキュリティのため、セッションを無効化
    await redis.del(`session:${sessionId}`);

    return NextResponse.json({ message: 'パスワードが正常に更新されました。再ログインしてください。' },
    { status: 200 });
  } catch (err: any) {
    console.error('Password update error:', err);
    return NextResponse.json({ error: 'パスワードの更新に失敗しました。', detail: err.message }, { status: 500 });
  }
}

