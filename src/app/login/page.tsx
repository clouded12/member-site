'use client';

import Button from "@/components/Button";
import Input from "@/components/input";
import { loginValidationSchema } from "@/utils/loginvalidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface LoginForm {
    email: string,
    password: string,
}
export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    // const [password, setPassword] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginForm>({
        mode: "onChange",
        resolver: zodResolver(loginValidationSchema),
    });

    const onSubmit = (data: LoginForm) => {
        console.log(data)
    };

    const router = useRouter();
    const handleClick = () => {
        router.push("./dashboard")
    };
    const registrationClick = () => {
        router.push("./registration")
    };

    return (
        <div className="py-4">
            <h1 className="justify-self-center font-bold text-4xl text-blue-500 mb-4">ログイン</h1>

            <form onSubmit={handleSubmit(onSubmit)} className=" w-full max-w-md space-y-4 mx-auto ">
                <Input
                    id="email"
                    type="email"
                    label="メールアドレス:"
                    error={errors.email?.message}
                    {...register("email")}
                />
                <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    // value={password}
                    // onChange={(e) => setPassword(e.target.value)}
                    label="パスワード:"
                    error={errors.password?.message}
                    {...register("password")}
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
                <Button type="submit" onClick={handleClick}>
                    ログイン</Button>
            </form>

            <button type="submit" className="flex justify-self-center underline text-cyan-500 cursor-pointer">パスワードを忘れた方はこちら</button>
            <br />
            <Button type="submit" onClick={registrationClick}>会員登録はこちら</Button>
        </div>
    )
}

function LoginClick() {
    console.log("Login Clicked!");
}
