// inputfieldのコンポーネント
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
};

// label,id,classNameを受け取る、その他入力があれば受けとる
export default function Input({ label, id, className, ...props }: InputProps) {
    return (
        <div className="flex items-center justify-center mb-4">
            {/* labelの入力があればlabelを配置 */}
            {label && (
                <label htmlFor="{id}" className={`w-32 text-sm font-medium text-black font-bold text-right`}
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black ${className ?? ''}`}
                {...props}
            />
        </div>
    );
}
