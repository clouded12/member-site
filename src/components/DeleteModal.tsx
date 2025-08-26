// ユーザー削除のモーダル
"use client";

import { useState } from "react";
import Modal from "react-modal";

export default function DeleteModal () {
  const [modalIsOpen, setIsOpen] = useState(false);
  return ( 
    <div>
      <button onClick={()=>setIsOpen(true)} className="p-3 text-white font-bold bg-red-600 rounded-2xl">
          ユーザーを削除
      </button>

      <Modal 
        isOpen={modalIsOpen}
        className="flex"
      >
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