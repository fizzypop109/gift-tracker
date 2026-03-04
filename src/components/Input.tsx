type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
}

export const Input = ({ label, ...props }: InputProps) => {
    return (
        <label style={{ display: "block", marginBottom: 12 }}>
            <span style={{ display: "block", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, color: "#8B7355", marginBottom: 4 }}>{label}</span>
            <input {...props} style={{ width: "100%", padding: "9px 11px", border: "1.5px solid #D4C4AE", borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans', sans-serif", background: "#FFF", color: "#2D1810", outline: "none", boxSizing: "border-box", ...(props.style || {}) }}
                   onFocus={e => e.target.style.borderColor = "#B8860B"} onBlur={e => e.target.style.borderColor = "#D4C4AE"} />
        </label>
    );
}