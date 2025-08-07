import { PrismaClient } from "@/generated/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

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

    return NextResponse.json({
      message: 'Login successful',
      username: user.username,
      email: user.email,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Login failed', detail: err.message }, { status: 500 });
  }
}