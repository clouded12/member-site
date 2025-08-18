import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Redis from "ioredis";
import { PrismaClient } from "@/generated/prisma";

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// GET: ユーザーのTodoリストを取得
export async function GET(request: Request) {
  try {
    const sessionId = cookies().get('session_id')?.value;
    if (!sessionId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const token = await redis.get(`session:${sessionId}`);
    if (!token) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }
    const payload: { userId: number } = jwt.verify(token, JWT_SECRET) as any;

    const todos = await prisma.todo.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(todos, { status: 200 });
  } catch (err: any) {
    console.error('Failed to fetch todos:', err);
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

// POST: 新しいTodoを追加
export async function POST(request: Request) {
  try {
    const sessionId = cookies().get('session_id')?.value;
    if (!sessionId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const token = await redis.get(`session:${sessionId}`);
    if (!token) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }
    const payload: { userId: number } = jwt.verify(token, JWT_SECRET) as any;
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'Todo text cannot be empty' }, { status: 400 });
    }

    const newTodo = await prisma.todo.create({
      data: {
        text,
        userId: payload.userId,
      },
    });

    return NextResponse.json(newTodo, { status: 201 });
  } catch (err: any) {
    console.error('Failed to create todo:', err);
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}

// PUT: Todoの完了状態を更新
export async function PUT(request: Request) {
  try {
    const sessionId = cookies().get('session_id')?.value;
    if (!sessionId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const token = await redis.get(`session:${sessionId}`);
    if (!token) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }
    const payload: { userId: number } = jwt.verify(token, JWT_SECRET) as any;
    const { id, completed } = await request.json();

    const updatedTodo = await prisma.todo.updateMany({
      where: { id: id, userId: payload.userId },
      data: { completed },
    });

    if (updatedTodo.count === 0) {
      return NextResponse.json({ error: 'Todo not found or not owned by user' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Todo updated successfully' }, { status: 200 });
  } catch (err: any) {
    console.error('Failed to update todo:', err);
    return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
  }
}

// DELETE: Todoを削除
export async function DELETE(request: Request) {
  try {
    const sessionId = cookies().get('session_id')?.value;
    if (!sessionId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const token = await redis.get(`session:${sessionId}`);
    if (!token) {
      return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
    }
    const payload: { userId: number } = jwt.verify(token, JWT_SECRET) as any;
    const { id } = await request.json();

    const deletedTodo = await prisma.todo.deleteMany({
      where: { id: id, userId: payload.userId },
    });

    if (deletedTodo.count === 0) {
      return NextResponse.json({ error: 'Todo not found or not owned by user' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Todo deleted successfully' }, { status: 200 });
  } catch (err: any) {
    console.error('Failed to delete todo:', err);
    return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
  }
}
