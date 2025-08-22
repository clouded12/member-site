// app/api/user/route.ts
import { PrismaClient } from '@/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, email, password } = body;

  if (!username || !email || !password) {
    return NextResponse.json({ error: '入力されていないフィールドがあります。' }, { status: 400 });
  }

  try {
    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword, // ハッシュ化したパスワードを保存
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'ユーザーの登録に失敗しました。', detail: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        // パスワードは含めない
      },
    });
    return NextResponse.json(users, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'ユーザー情報の取得に失敗しました。', detail: err.message }, { status: 500 });
  }
}
