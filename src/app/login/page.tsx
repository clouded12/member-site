'use client';

import Button from "@/components/Button";
import Input from "@/components/input";
import { loginValidationSchema } from "@/utils/loginvalidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: "onChange",
    resolver: zodResolver(loginValidationSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setIsLoading(false);
        // ログイン成功 → ダッシュボードへ遷移
        router.push("/dashboard");
      } else {
        setIsLoading(false);
        // エラーメッセージを表示
        setErrorMessage(result.error || "ログインに失敗しました");
      }
    } catch (error) {
      setErrorMessage("サーバーエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const registrationClick = () => {
    router.push("/registration");
  };
  const resetClick = () => {
    router.push("/reset");
  }

  return (
    <div className="py-4">
      <h1 className="font-bold text-4xl text-blue-500 mb-4 justify-self-center">ログイン</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md space-y-4 mx-auto">
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

        {/* エラーメッセージ表示 */}
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'ログイン中...':'ログイン'}
        </Button>
      </form>

      <button type="button" 
        className="flex justify-self-center underline text-cyan-500 cursor-pointer"
        onClick={resetClick}
      >
        パスワードを忘れた方はこちら
      </button>
      <br />
      <Button type="button" onClick={registrationClick}>
        会員登録はこちら
      </Button>
    </div>
  );
}
