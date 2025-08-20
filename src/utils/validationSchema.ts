import { z } from "zod";

export const validationSchema = z.object({
    name: z
        .string()
        .nonempty("名前は必須です。")
        .min(4, "名前は4文字以上で入力してください。"),
    email: z
        .string()
        .nonempty("メールアドレスは必須です。")
        .email("正しいメールアドレスを入力してください。"),
    password: z
        .string()
        .nonempty("パスワードは必須です。")
        .min(6, "パスワードは6文字以上で入力してください。"),
    confirmation: z
        .string(),
        // .nonempty("パスワードは必須です。")
        // .min(6, "パスワードは6文字以上で入力してください。"),
})
// パスワードとパスワード(確認)が一致しなければエラー
.refine((data) => data.password === data.confirmation, {
    path: ["confirmation"],
    message: "パスワードが一致しません。",
});
