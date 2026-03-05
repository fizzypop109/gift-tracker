import clsx from "clsx";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    options: (string | { value: string, label: string })[];
}

export const Select = ({ label, options, className, ...props }: SelectProps) => {
    return (
        <label className="block mb-3">
            {label && <span className="block text-[10px] font-semibold uppercase tracking-[0.8px] text-brown-muted mb-1">{label}</span>}
            <select
                {...props}
                className={clsx(
                    "w-full py-[9px] px-[11px] border-[1.5px] border-tan rounded-[10px] text-sm font-sans bg-white text-brown outline-none",
                    className
                )}
            >
                {options.map(o => typeof o === "string"
                    ? <option key={o} value={o}>{o}</option>
                    : <option key={o.value} value={o.value}>{o.label}</option>
                )}
            </select>
        </label>
    );
}
