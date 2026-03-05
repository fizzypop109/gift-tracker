import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
}

export const Input = ({ label, className, ...props }: InputProps) => {
    return (
        <label className="block mb-3">
            {label && <span className="block text-[10px] font-semibold uppercase tracking-[0.8px] text-brown-muted mb-1">{label}</span>}
            <input
                {...props}
                className={clsx(
                    "w-full py-[9px] px-[11px] border-[1.5px] border-tan rounded-[10px] text-sm font-sans bg-white text-brown outline-none focus:border-gold",
                    className
                )}
            />
        </label>
    );
}
