'use client';

import Input from "@/components/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function UsernameChange() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // ページのリロードを無効化
    setMessage('');
    setIsLoading(true);
  
    // クライアント側のバリデーション
    if(!currentPassword || !newPassword || !confirmPassword) {
      setMessage('すべてのフィールドを入力してください。');
      setIsLoading(false);
      return;
    }

    if(newPassword !== confirmPassword) {
      setMessage('新しいパスワードと確認用パスワードが一致しません。');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage('新しいパスワードは6文字以上で入力してください。');
      setIsLoading(false);
      return;
    }

    try {
      // サーバーサイドAPIにPUTリクエストを送信
      const res = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        // パスワード変更成功後、再ログインのためログインページに遷移
        window.location.href = '/login';
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
        パスワードの変更
      </h1>

      <h2 className="text-red-500 text-center mb-4 font-bold">
        ※変更完了後ログイン画面に戻ります
      </h2>
      {message && (
          <div className={`p-3 mb-4 rounded-lg text-sm text-center ${message.includes('成功') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
       )}

      <form onSubmit={handlePasswordChange}>
        
        {/* パスワードの表示状態を切り替えるチェックボックス */}
        <div className="flex place-self-center space-x-2 text-sm mb-4">
          <input
            id="showPassword"
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          <label htmlFor="showPassword" className="text-black cursor-pointer">
            パスワードを表示する
          </label>
        </div>
        
        <Input 
          label="現在のパスワード"
          type={showPassword ? "text" : "password"}
          id="current-password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="現在のパスワードを入力"
          disabled={isLoading} 
        />
        <Input 
          label="新しいパスワード"
          type={showPassword ? "text" : "password"}
          id="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="6文字以上"
          disabled={isLoading} 
        />

        <Input 
          label="新しいパスワード(確認)"
          type={showPassword ? "text" : "password"}
          id="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading} 
        />
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