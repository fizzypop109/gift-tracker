import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger" | "christmas" | "birthday";
    small?: boolean;
}

export const Button = ({ children, variant = "primary", small, className, style, ...props }: ButtonProps) => {
    const base = clsx(
        "rounded-[10px] font-semibold font-sans cursor-pointer transition-all duration-150 whitespace-nowrap",
        small ? "py-[6px] px-3 text-xs" : "py-[9px] px-[18px] text-[13px]"
    );
    const v = variant === "primary"
        ? "bg-[linear-gradient(135deg,var(--color-gold),var(--color-gold-light))] text-white border-none shadow-[0_2px_8px_rgba(184,134,11,0.3)]"
        : variant === "danger"
            ? "bg-white text-danger border-[1.5px] border-danger-border"
            : variant === "christmas"
                ? "bg-[linear-gradient(135deg,#1B5E20,#2E7D32)] text-white border-none"
                : variant === "birthday"
                    ? "bg-[linear-gradient(135deg,#AD1457,#D81B60)] text-white border-none"
                    : "bg-white text-brown-mid border-[1.5px] border-tan";
    return <button {...props} style={style} className={clsx(base, v, className)}>{children}</button>;
}
