// ボタンのコンポーネント
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, ...props }: ButtonProps) {
    return (
        <button
            className="flex justify-self-center px-4 py-2 bg-green-500 text-white rounded cursor-pointer hover:bg-green-700 active:scale-95 transition mb-6"
            {...props}
        >
            {children}
        </button>
    );
}
