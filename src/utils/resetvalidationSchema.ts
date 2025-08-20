// パスワードリセットのバリデーション
import z from "zod";

export const resetValidationSchema = z.object({
    email: z
        .string()
        .nonempty("メールアドレスを入力してください。")
        .email("正しいメールアドレスを入力してください。"),
    password: z
        .string()
        .nonempty("再設定したいパスワードを入力してください。"),
    confirmation: z
        .string()
})
// パスワードとパスワード(確認)が一致しなければエラー
.refine((data) => data.password === data.confirmation, {
    path: ["confirmation"],
    message: "パスワードが一致しません。",
});
