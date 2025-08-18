'use client';

import TodoList from "@/components/TodoList";
import { useEffect, useState } from "react";

type User = {
  id: number;
  username: string;
  email: string;
};

type Todo = {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
};

export default function TodoPage() {
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ログインユーザーの情報を取得し、Todoリストをフェッチ
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch('/api/me');
        if (userRes.ok) {
          const { user } = await userRes.json();
          setUser(user);
        }

        const todosRes = await fetch('/api/todos');
        if (todosRes.ok) {
          const todosData = await todosRes.json();
          setTodos(todosData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddTodo = async (text: string) => {
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const addedTodo = await res.json();
        setTodos([addedTodo, ...todos]);
      }
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    try {
      const res = await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, completed: !completed }),
      });
      if (res.ok) {
        setTodos(
          todos.map((todo) => (todo.id === id ? { ...todo, completed: !completed } : todo))
        );
      }
    } catch (err) {
      console.error("Error toggling todo:", err);
    }
  };

   const handleDeleteTodo = async (id: number) => {
    try {
      const res = await fetch('/api/todos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setTodos(todos.filter((todo) => todo.id !== id));
      }
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl text-red-500">ユーザー情報の取得に失敗しました。ログインしてください。</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-black">
        Todoリスト
      </h1>

      <div className="mt-8 bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Todoリスト</h2>
        <TodoList
          todoItems={todos}
          onAdd={handleAddTodo}
          onToggle={handleToggleTodo}
          onDelete={handleDeleteTodo}
        />
      </div>
    </div>
  );
}