'use client';

import { TrashIcon } from "@heroicons/react/16/solid";
import React, { useState } from "react"

type TodoItem = {
    id: number;
    text: string;
    completed: boolean;
};

// 親コンポーネントからPropsとしてデータと関数を受け取るように変更
type TodoListProps = {
    todoItems: TodoItem[];
    onAdd: (text: string) => void;
    onToggle: (id: number, completed: boolean) => void;
    onDelete: (id: number) => void;
};

const TodoList: React.FC<TodoListProps> = ({ todoItems, onAdd, onToggle, onDelete }) => {
    const [inputValue, setInputValue] = useState('');
    // const [todoItems, setTodoItems] = useState<TodoItem[]>([]);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();

        // 文字列が空、スペースのみの場合無視する
        if (!inputValue.trim()) return;
        // 親コンポーネントのonAdd関数を呼び出す
        onAdd(inputValue.trim());
        // // 入力された文字をリストに追加
        // setTodoItems((prevItems) => [
        //     ...prevItems,
        //     { text: inputValue.trim(), completed: false }
        // ]);
        setInputValue(''); // 入力欄を空にする
    };

    // const toggleCompleted = (index: number) => {
    //     setTodoItems(prevItems =>
    //         prevItems.map((item, i) =>
    //             i === index ? { ...item, completed: !item.completed } : item)
    //     );
    // };

    // const handleDelete = (index: number) => {
    //     setTodoItems(prevItems => prevItems.filter((_, i) => i !== index));
    // };

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
                    <div key={item.id} className={`p-2 border rounded flex items-center justify-between gap-2 ${item.completed ? ' bg-gray-200 text-gray-500' : 'bg-white text-black'}`}>
                        <div className={`flex items-center gap-2
                            ${item.completed ? 'line-through' : ''}`}>
                            <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => onToggle(item.id, item.completed)} // 親コンポーネントのonToggle関数を呼び出す
                            />
                            <span>{item.text}</span>
                        </div>

                        {/* 削除ボタン */}
                        <button
                            onClick={() => onDelete(item.id)}
                            className="font-bold"
                            aria-label="削除"
                            title="削除">
                            <TrashIcon className="h-5 w-5 text-red-500"/>
                        </button>
                    </div>
                ))}
            </div>
            {todoItems.length === 0 && (
                <p className="text-center text-gray-500 mt-4">Todoはありません。</p>
            )}
        </div>
    );
};

export default TodoList;
