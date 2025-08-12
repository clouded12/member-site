import { getCurrentUser } from "@/lib/auth"
import Link from "next/link";
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
                <Link href="/dashboard/profile/mailadresschange" passHref>
                    <button className="text-white bg-blue-500 hover:bg-blue-700 px-2 py-2 rounded">
                    メールアドレスを変更
                    </button>
                </Link>
               
                <p>
                    <button className="text-white bg-blue-500 hover:bg-blue-700 px-2 py-2 rounded">
                    パスワードを変更
                    </button>
                </p>
                
            </div>

        </div>
    )
}