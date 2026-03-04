type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "danger" | "christmas" | "birthday";
    small?: boolean;
}

export const Button = ({ children, variant = "primary", small, ...props }: ButtonProps) => {
    const base = { padding: small ? "6px 12px" : "9px 18px", borderRadius: 10, fontSize: small ? 12 : 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all .15s", whiteSpace: "nowrap" };
    const v = variant === "primary" ? { background: "linear-gradient(135deg, #B8860B, #DAA520)", color: "#FFF", border: "none", boxShadow: "0 2px 8px rgba(184,134,11,0.3)" }
        : variant === "danger" ? { background: "#FFF", color: "#C62828", border: "1.5px solid #FFCDD2" }
            : variant === "christmas" ? { background: "linear-gradient(135deg, #1B5E20, #2E7D32)", color: "#FFF", border: "none" }
                : variant === "birthday" ? { background: "linear-gradient(135deg, #AD1457, #D81B60)", color: "#FFF", border: "none" }
                    : { background: "#FFF", color: "#5D4E37", border: "1.5px solid #D4C4AE" };
    return <button {...props} style={{ ...base, ...v, ...(props.style || {}) }}>{children}</button>;
}