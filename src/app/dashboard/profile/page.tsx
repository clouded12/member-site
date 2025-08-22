"use client";

import { getCurrentUser } from "@/lib/auth"
import Link from "next/link";
import { redirect } from "next/navigation"
import { useState } from "react";
import Modal from "react-modal";

export default async function ProfilePage() {
    const [modalIsOpen, setIsOpen] = useState(false);
    const user = await getCurrentUser();
    
    if(!user) {
        // 認証されていない場合はログインページへリダイレクト
        redirect('/login');
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4 text-black">
                プロフィール
            </h1>
            <div className="flex-col text-black font-bold space-y-4">
                <p className="text-xl">
                    ユーザー名:{user.username}
                </p>
                <Link href="/dashboard/profile/usernamechange" passHref>
                    <button className="text-white bg-blue-500 hover:bg-blue-700 px-2 py-2 rounded">
                    ユーザー名を変更
                    </button>
                </Link>
                <p className="text-xl">
                    メールアドレス:{user.email}
                </p>
                <Link href="/dashboard/profile/emailchange" passHref>
                    <button className="text-white bg-blue-500 hover:bg-blue-700 px-2 py-2 rounded mb-4">
                    メールアドレスを変更
                    </button>
                </Link>
               
                <p className="text-xl">
                    パスワード:●●●●●●
                </p>
                <p>
                    <Link href="/dashboard/profile/passwordchange">
                        <button className="text-white bg-blue-500 hover:bg-blue-700 px-2 py-2 rounded">
                        パスワードを変更
                        </button>
                    </Link>                    
                </p>
                
                <button onClick={()=>setIsOpen(true)} className="p-4 text-white font-bold bg-red-600 rounded">
                    ユーザーを削除
                </button>

                <Modal isOpen={modalIsOpen}>
                    <button onClick={() => setIsOpen(false)}>
                        キャンセル
                    </button>
                </Modal>
            </div>

        </div>
    )
}