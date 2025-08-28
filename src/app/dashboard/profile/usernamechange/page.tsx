'use client';

import Input from "@/components/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

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
    if(newUsername.length < 4) {
      setMessage('ユーザー名は4文字以上で入力してください。');
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
      <h1 className="text-3xl font-bold text-center mb-6 text-black">
        ユーザー名の変更
      </h1>
      
      {message && (
          <div className={`p-3 mb-4 rounded-lg text-sm text-center ${message.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
       )}

      <form onSubmit={handleUsernameChange}>
        <div>
          <Input 
            label="新しいユーザー名"
            type="text"
            id="new-username"
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="新しいユーザー名を入力"
            disabled={isLoading} 
          />
        </div>
        <div className="flex justify-center items-center space-x-4">
          <button
            type="submit"
            disabled={isLoading}
            className="relative h-12 rounded bg-blue-500 px-3 py-3 hover:cursor-auto hover:bg-blue-700 active:scale-95 font-bold" 
          >
            {isLoading ? '保存中...' : '保存'}
          </button>
          <button 
            type="button"
            onClick={() => router.push('/dashboard/profile')}
            disabled={isLoading}
            className="relative h-12 rounded bg-red-500 px-3 py-3 hover:cursor-auto hover:bg-red-700 active:scale-95 font-bold"
          >
            キャンセル
          </button>
        </div>
        
      </form>
    </div>
  )
}