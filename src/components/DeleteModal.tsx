// ユーザー削除のモーダル
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "react-modal";

export default function DeleteModal () {
  const router = useRouter();
  const [modalIsOpen, setIsOpen] = useState(false);

  // ユーザー削除
  const handleDelete = async () => {
    const res = await fetch('/api/delete', {
      method: 'DELETE',
    });

    // エラー確認用
    // const data = await res.json();
    // console.log('削除レスポンス:', data);
    
    if (res.ok) {
      // ユーザー削除成功で、ログイン画面に戻る
      router.push('/login');
    } else {
      alert('削除に失敗しました');
    }
  };

  return ( 
    <div>
      <button onClick={()=>setIsOpen(true)} className="p-3 text-white font-bold bg-red-600 rounded-2xl">
          ユーザーを削除
      </button>

      <Modal 
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        className=""
      >
        <div className="text-black">
          このユーザーではログインできなくなります。
          本当に削除しますか？
        </div>
        <button
          onClick={handleDelete}
          className="bg-red-600 rounded font-bold p-3"
        >
          削除
        </button>
        <button 
          onClick={() => setIsOpen(false)} 
          className="text-black rounded bg-green-400 font-bold p-3"
        >
          キャンセル
        </button>
      </Modal>
    </div>
    
  )
}