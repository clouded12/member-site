// import Button from "@/components/Button"
// import Input from "@/components/input"
// import Sidebar from "@/components/Sidebar"
// import TodoList from "@/components/TodoList"
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const user = await getCurrentUser();
        
        if(!user) {
            // 認証されていない場合はログインページへリダイレクト
            redirect('/login');
        }
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4 text-black">ようこそ！{user.username}さん</h1>
            {/* <h2 className="text-black text-2xl">ToDoリスト</h2> */}
            {/* <TodoList /> */}
        </div>
    )
}
