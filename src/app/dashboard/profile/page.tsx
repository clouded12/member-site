import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
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
            <div className="text-black font-bold">
                <p>ユーザー名: <span>{user.username}</span> </p>
                <p>メールアドレス:{user.email}</p>
            </div>

        </div>
    )
}