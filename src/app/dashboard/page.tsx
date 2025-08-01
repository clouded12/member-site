import Button from "@/components/Button"
import Input from "@/components/input"
import Sidebar from "@/components/Sidebar"
import TodoList from "@/components/TodoList"

export default function Dashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4 text-black">ようこそ！</h1>
            <h2 className="text-black text-2xl">ToDoリスト</h2>
            <TodoList />
        </div>
    )
}
