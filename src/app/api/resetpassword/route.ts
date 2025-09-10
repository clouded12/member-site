import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// 既存のメールアドレスと新しいパスワードを登録する
export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json();

    // 入力がなければエラー
    if (!email || !newPassword) {
      return NextResponse.json(
        { message: "すべてのフィールドは必須です。" },
        { status: 400 },
      );
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // セキュリティのため、存在しないユーザー(メールアドレス)の場合でも、成功したようにメッセージを表示
      return NextResponse.json(
        { messge: "パスワードリセットのリクエストを受け付けました。" },
        { status: 200 },
      );
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // パスワード変更後のユーザー情報
    const updateUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "パスワードが正常にリセットされました。", user: updateUser },
      { status: 200 },
    );
  } catch (error) {
    console.error("パスワードリセット中にエラーが発生しました:", error);
    return NextResponse.json(
      { message: "サーバーエラーが発生しました。" },
      { status: 500 },
    );
  }
}
