// inputfieldのコンポーネント
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    error?: string;
};

// label,id,classNameを受け取る、その他入力があれば受けとる
export default function Input({ label, id, className, error, ...props }: InputProps) {
    return (
        <div className="mb-4 justify-self-center">
            {/* labelの入力があればlabelを配置 */}
            {label && (
                <label
                    htmlFor={id}
                    className={`block mb-1 text-base text-black font-bold`}
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black ${className ?? ''}`}
                {...props}
            />
            {error ? (
                <p className="mt-1 text-sm text-red-500 min-h-[10px]">{error}</p>
            ) : (
                <p className="mt-1 text-sm invisible min-h-[10px]">placeholder</p>
            )}
        </div>
    );
}
