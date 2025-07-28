import Input from "@/components/input"
import Sidebar from "@/components/Sidebar"

export default function Dashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-4 text-black">ようこそ！</h1>
            <form action="">
                <h2 className="text-black text-2xl">ToDoリスト</h2>
                <Input></Input>
            </form>
        </div>
    )
}
