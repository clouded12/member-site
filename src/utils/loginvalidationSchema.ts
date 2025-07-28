// ログイン画面のバリデーション、機能追加予定
import z, { email } from "zod";

export const loginValidationSchema = z.object({
    email: z
        .string()
        .nonempty("メールアドレスは必須です。")
        .email("正しいメールアドレスを入力してください。"),
    password: z
        .string()
        .nonempty("パスワードは必須です。")
        .min(6, "パスワードは6文字以上で入力してください。"),
})
