// ユーザー削除のモーダル
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";

export default function DeleteModal() {
  const router = useRouter();
  const [modalIsOpen, setIsOpen] = useState(false);

  // エラー回避
  useEffect(() => {
    Modal.setAppElement("#modal-root");
  }, []);

  // ユーザー削除
  const handleDelete = async () => {
    const res = await fetch("/api/delete", {
      method: "DELETE",
    });

    // エラー確認用
    const data = await res.json();
    console.log("削除レスポンス:", data);

    if (res.ok) {
      // ユーザー削除成功で、ログイン画面に戻る
      toast.success("ユーザーを削除しました", {
        duration:5000,
      });
      router.push("/login");
    } else {
      toast.error("ユーザーを削除できませんでした", {
        duration:4000,
      });
    }
  };

  return (
    <div id="modal-root">
      <button
        onClick={() => setIsOpen(true)}
        className="p-3 text-white font-bold bg-red-600 hover:bg-red-800 cursor-pointer rounded active:scale-95"
      >
        ユーザーを削除
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        className="w-full max-w-sm p-6 bg-white rounded shadow-lg mx-auto mt-20 border-2 border-red-500"
      >
        <div className="flex flex-col items-center">
          <h2 className="text-black font-bold">
            このユーザーではログインできなくなります。 本当に削除しますか？
          </h2>
          <div className="flex-row space-x-3">
            <button
              onClick={handleDelete}
              className="bg-red-600 rounded font-bold p-3 px-4 hover:bg-red-800 cursor-pointer active:scale-95"
            >
              削除
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded bg-green-500 font-bold p-3 hover:bg-green-600 cursor-pointer active:scale-95"
            >
              キャンセル
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
