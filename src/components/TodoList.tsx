'use client';

import { TrashIcon } from "@heroicons/react/16/solid";
import React, { useState } from "react"

type TodoItem = {
    text: string;
    completed: boolean;
};

const TodoList: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [todoItems, setTodoItems] = useState<TodoItem[]>([]);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();

        // 文字列が空、スペースのみの場合無視する
        if (!inputValue.trim()) return;

        // 入力された文字をリストに追加
        setTodoItems((prevItems) => [
            ...prevItems,
            { text: inputValue.trim(), completed: false }
        ]);
        setInputValue(''); // 入力欄を空にする
    };

    const toggleCompleted = (index: number) => {
        setTodoItems(prevItems =>
            prevItems.map((item, i) =>
                i === index ? { ...item, completed: !item.completed } : item)
        );
    };

    const handleDelete = (index: number) => {
        setTodoItems(prevItems => prevItems.filter((_, i) => i !== index));
    };

    return (
        <div className="max-w-md mx-auto p-4">
            {/* 入力フォーム */}
            <form onSubmit={handleAdd} className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="タスクを入力"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500 text-black bg-white"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    追加
                </button>
            </form>

            {/* 表示部分 */}
            <div className="space-y-2">
                {todoItems.map((item, index) => (
                    // チェックボックスにチェックが入っているかで表示を切り替え
                    <div key={index} className={`p-2 border rounded flex items-center justify-between gap-2 ${item.completed ? ' bg-gray-200 text-gray-500' : 'bg-white text-black'}`}>
                        <div className={`flex items-center gap-2
                            ${item.completed ? 'line-through' : ''}`}>
                            <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => toggleCompleted(index)}
                            />
                            <span>{item.text}</span>
                        </div>

                        {/* 削除ボタン */}
                        <button
                            onClick={() => handleDelete(index)}
                            className="font-bold"
                            aria-label="削除"
                            title="削除">
                            <TrashIcon className="h-5 w-5 text-red-500"/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoList;
