"use client";

import Input from "@/components/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function EmailChange() {
  const [newEmail, setNewEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // ページのリロードを無効化
    setMessage("");
    setIsLoading(true);

    // バリデーション
    if (!newEmail.trim()) {
      setMessage("新しいメールアドレスを入力してください。");
      setIsLoading(false);
      return;
    }
    // メールアドレスのバリデーション
    const emaiRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emaiRegex.test(newEmail)) {
      setMessage("有効なメールアドレスを入力してください。");
      setIsLoading(false);
      return;
    }

    try {
      // サーバーサイドAPIにPUTリクエストを送信
      const res = await fetch("/api/profile/email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (res.ok) {
        setMessage("メールアドレスが正常に更新されました。");
        setNewEmail("");
        // プロフィールトップページにリダイレクト
        router.push("/dashboard/profile");
      } else {
        const { error } = await res.json();
        setMessage(`更新に失敗しました: ${error}`);
      }
    } catch (err) {
      setMessage("サーバーエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-6 text-black">
        メールアドレスの変更
      </h1>

      {message && (
        <div
          className={`p-3 mb-4 rounded-lg text-sm text-center ${message.includes("成功") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleEmailChange}>
        <div>
          <Input
            label="新しいメールアドレス"
            type="email"
            id="new-email"
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="新しいメールアドレスを入力"
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-center items-center space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="relative h-12 rounded bg-blue-500 px-3 py-3 hover:cursor-auto hover:bg-blue-700 active:scale-95 font-bold"
          >
            保存
          </button>
          <button
            type="button"
            onClick={() => router.push("/dashboard/profile")}
            disabled={isLoading}
            className="relative h-12 rounded bg-red-500 px-3 py-3 hover:cursor-auto hover:bg-red-700 active:scale-95 font-bold"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
