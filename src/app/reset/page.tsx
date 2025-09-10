"use client";

import Input from "@/components/input";
import Button from "@/components/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { resetValidationSchema } from "@/utils/resetvalidationSchema";

// 型
interface ResetForm {
  email: string;
  password: string;
  confirmation: string;
}

export default function Reset() {
  // パスワードの表示状態を切り替えるためのuseState
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    mode: "onChange",
    resolver: zodResolver(resetValidationSchema),
  });

  const onSubmit = async (data: ResetForm) => {
    // api/resetpasswordのPOSTを実行
    try {
      const res = await fetch("/api/resetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          newPassword: data.password,
        }),
      });

      const result = await res.json();
      console.log("登録成功:", result);
    } catch (error) {
      console.error("送信中にエラー:", error);
      alert("通信エラーが発生しました");
    }
  };

  return (
    <div>
      <h1 className="text-center text-blue-600 font-bold text-2xl my-5">
        パスワード再設定
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="メールアドレス:"
          id="email"
          type="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="新しいパスワード:"
          id="password"
          type={showPassword ? "text" : "password"}
          error={errors.password?.message}
          {...register("password")}
        />

        {/* パスワードの表示状態を切り替えるチェックボックス */}
        <div className="flex place-self-center space-x-2 text-sm my-4">
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
          label="パスワード(確認):"
          id="confirmation"
          type={showPassword ? "text" : "password"}
          error={errors.confirmation?.message}
          {...register("confirmation")}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "送信中..." : "登録"}
        </Button>
      </form>
    </div>
  );
}
