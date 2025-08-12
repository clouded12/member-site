'use client';

import Input from "@/components/input"
import { validationSchema } from "@/utils/validationSchema"
import { useRouter } from "next/router"
import React, { useState } from "react"

export default function UsernameChange() {
  const [newUsername, setNewUsername] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const handleUsernameChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // ページのリロードを無効化
    setMessage('');
    setIsLoading(true);
  
  // バリデーション
    if (!newUsername.trim()) {
      setMessage('新しいユーザー名を入力してください。');
      setIsLoading(false);
      return;
    }

   try {
      // サーバーサイドAPIにPUTリクエストを送信
      const res = await fetch('/api/profile/username', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername }),
      });

      if (res.ok) {
        setMessage('ユーザー名が正常に更新されました。');
        setNewUsername('');
        // プロフィールトップページにリダイレクト
        router.push('/dashboard/profile');
      } else {
        const { error } = await res.json();
        setMessage(`更新に失敗しました: ${error}`);
      }
    } catch (err) {
      setMessage('サーバーエラーが発生しました。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleUsernameChange}>
        <div>
          <label htmlFor="new-username">新しいユーザー名</label>
          <Input 
            type="text"
            id="new-username"
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="新しいユーザー名を入力"
            disabled={isLoading} 
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
        >
            保存
        </button>
        <button>キャンセル</button>
      </form>
    </div>
  )
}