'use client'

import Button from "@/components/Button";
import Input from "@/components/input";
import { useState } from "react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');

    return (
        <div className="py-4">
            <h1 className="justify-self-center font-bold text-4xl text-blue-500 mb-4">ログイン</h1>
            <Input
                id="id"
                type="text"
                label="ID:"
            />
            <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                label="パスワード:"
            />
            <div className="flex place-self-center space-x-2 text-sm mb-4">
                <input
                    id="showPassword"
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                />
                <label htmlFor="showPassword" className="text-black cursor-pointer">パスワードを表示する</label>
            </div>
            <Button type="submit" onClick={LoginClick}>
                ログイン</Button>
            <button type="submit" className="flex justify-self-center underline text-cyan-500 cursor-pointer">パスワードを忘れた方はこちら</button>
            <br />
            <Button type="submit">会員登録はこちら</Button>
        </div>
    )
}

function LoginClick() {
    console.log("Login Clicked!");
}
