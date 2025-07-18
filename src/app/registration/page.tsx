import Button from "@/components/Button"
import Input from "@/components/input"

export default function Registration() {
    return (
        <div>
            <h1 className="justify-self-center text-blue-500 font-bold text-2xl m-5">新規会員登録</h1>
            <Input
                id="email"
                type="email"
                label="メールアドレス:"
            />
            <Input
                id="id"
                type="text"
                label="ID:"
            />
            <Input
                id="password"
                type="password"
                label="パスワード:"
            />
            <Input
                id="confirmation"
                type="password"
                label="パスワード(確認):"
            />
            <Button>登録</Button>
        </div>
    )
}
