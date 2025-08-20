'use client';

import Input from "@/components/input";
import Button from "@/components/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { resetValidationSchema } from "@/utils/resetvalidationSchema";

// 型
interface ResetForm {
    email: string;
    password: string;
    confirmation: string;
}

export default function Reset() {
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
      <h1 className="justify-center text-black font-bold">
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
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="パスワード(確認):"
          id="confirmation"
          type="password"
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "送信中..." : "登録"}
        </Button>
      </form>
    </div>
  )
}