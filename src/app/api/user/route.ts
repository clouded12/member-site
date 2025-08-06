// app/api/user/route.ts
import { PrismaClient } from '@/generated/prisma';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, email, password } = body;

  if (!username || !email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: 'User creation failed', detail: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to fetch users', detail: err.message }, { status: 500 });
  }
}
