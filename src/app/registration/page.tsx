'use client';

import Button from "@/components/Button"
import Input from "@/components/input"
import { validationSchema } from "@/utils/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react";
import { useForm } from "react-hook-form"
import z from "zod"

interface RegistrationForm {
    name: string;
    email: string;
    password: string;
    confirmation: string;
}

export default function Registration() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegistrationForm>({
        mode: "onChange",
        resolver: zodResolver(validationSchema),
    });

    const onSubmit = (data: RegistrationForm) => {
        console.log(data);
    };

    return (
        <div>
            <h1 className="justify-self-center text-blue-500 font-bold text-2xl m-5">新規会員登録</h1>

            <form onSubmit={handleSubmit(onSubmit)} className=" w-full max-w-md mx-auto space-y-4">
                <Input
                    id="email"
                    type="email"
                    label="メールアドレス:"
                    error={errors.email?.message}
                    {...register("email")}
                />

                <Input
                    id="name"
                    type="text"
                    label="ユーザー名:"
                    error={errors.name?.message}
                    {...register("name")}
                />

                <Input
                    id="password"
                    type="password"
                    label="パスワード:"
                    error={errors.password?.message}
                    {...register("password")}
                />

                <Input
                    id="confirmation"
                    type="password"
                    label="パスワード(確認):"
                    error={errors.confirmation?.message}
                    {...register("confirmation")}
                />

                <Button type="submit">登録</Button>
            </form>

        </div>
    )
}
