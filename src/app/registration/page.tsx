"use client";

import Button from "@/components/Button";
import Input from "@/components/input";
import { validationSchema } from "@/utils/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

// 型
interface RegistrationForm {
  name: string;
  email: string;
  password: string;
  confirmation: string;
}

export default function Registration() {
  const router = useRouter();
  // パスワードの表示状態を切り替えるためのuseState
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationForm>({
    mode: "onChange",
    resolver: zodResolver(validationSchema),
  });

  // 登録ボタン押下時の動作
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
      router.push("/login"); // 登録成功でログイン画面に遷移
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" w-full max-w-md space-y-4 mx-auto "
      >
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
          type={showPassword ? "text" : "password"}
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
          <label htmlFor="showPassword" className="text-black cursor-pointer">
            パスワードを表示する
          </label>
        </div>

        <Input
          id="confirmation"
          type={showPassword ? "text" : "password"}
          label="パスワード(確認):"
          error={errors.confirmation?.message}
          {...register("confirmation")}
        />

        <Button type="submit">登録</Button>
      </form>
    </div>
  );
}
