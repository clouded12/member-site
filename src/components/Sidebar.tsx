"use client";

import { logout } from "@/hooks/useLogout";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-45 h-screen bg-gray-800 text-white p-6 flex flex-col space-y-6 fixed">
      <h2 className="text-xl font-bold">メニュー</h2>

      <nav className="flex flex-col space-y-3">
        <Link href="/dashboard" className="hover:text-blue-400">
          ホーム
        </Link>
        <Link href="/dashboard/profile" className="hover:text-blue-400">
          プロフィール
        </Link>
        <Link href="/dashboard/todo" className="hover:text-blue-400">
          Todoリスト
        </Link>
        {/* <Link href="/dashboard/settings" className="hover:text-blue-400">
                    設定
                </Link> */}
        <button
          onClick={logout}
          className="text-left hover:text-red-400 hover:cursor-pointer"
        >
          ログアウト
        </button>
      </nav>
    </aside>
  );
}
