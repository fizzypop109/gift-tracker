type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    options: (string | { value: string, label: string })[];
}

export const Select = ({ label, options, ...props }: SelectProps) => {
    return (
        <label style={{ display: "block", marginBottom: 12 }}>
            <span style={{ display: "block", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, color: "#8B7355", marginBottom: 4 }}>{label}</span>
            <select {...props} style={{ width: "100%", padding: "9px 11px", border: "1.5px solid #D4C4AE", borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans', sans-serif", background: "#FFF", color: "#2D1810", outline: "none", boxSizing: "border-box" }}>
                {options.map(o => typeof o === "string" ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
        </label>
    );
}