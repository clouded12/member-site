'use client';

import Input from "@/components/input";
import Button from "@/components/Button";

interface ResetForm {
    email: string;
    password: string;
    confirmation: string;
}

export default function Reset() {
  return (
    <div>
      <Input 
        label="メールアドレス:"
        id="email"
        type="email"
      />
      <Input
        label="パスワード:" 
        id="password"
        type="password"
      />
      <Input
        label="パスワード(確認):"
        id="confirmation"
        type="password"
      />
    </div>
  )
}