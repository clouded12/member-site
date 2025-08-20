'use client';

import Button from "@/components/Button";
import Input from "@/components/input";
import { validationSchema } from "@/utils/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

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

    // const onSubmit = (data: RegistrationForm) => {
    //     console.log(data);
    // };

    const onSubmit = async (data: RegistrationForm) => {
    
    const { name, email, password } = data;

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: name, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("登録に失敗:", errorData);
        alert(`登録に失敗しました: ${errorData.message || "エラー"}`);
        return;
      }

      const result = await res.json();
      console.log("登録成功:", result);
      alert("登録が完了しました！");
    } catch (error) {
      console.error("送信中にエラー:", error);
      alert("通信エラーが発生しました");
    }
  };

    return (
        <div className="w-full">
            <h1 className="justify-self-center text-blue-500 font-bold text-2xl m-5">
              新規会員登録
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className=" w-full max-w-md space-y-4 mx-auto ">
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
