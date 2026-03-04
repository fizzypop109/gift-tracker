type ModalProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    width?: number;
}

export const Modal = ({ open, onClose, title, children, width }: ModalProps) => {
    if (!open) return null;

    return (
        <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(30,20,10,0.45)", backdropFilter: "blur(6px)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 1000, padding: 0, animation: "fadeIn .2s ease" }}>
            <div onClick={e => e.stopPropagation()} style={{ background: "#FFFBF5", borderRadius: "16px 16px 0 0", padding: "24px 20px 20px", width: "100%", maxWidth: width || 440, maxHeight: "90vh", overflow: "auto", boxShadow: "0 -10px 40px rgba(30,20,10,0.2)", border: "1px solid #E8DDD0", borderBottom: "none" }}>
                <div style={{ width: 36, height: 4, borderRadius: 2, background: "#D4C4AE", margin: "0 auto 16px" }} />
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, color: "#2D1810", margin: "0 0 16px" }}>{title}</h2>
                {children}
            </div>
        </div>
    );
}