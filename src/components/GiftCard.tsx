import {Badge} from "@/components/Badge";
import {STATUS_COLORS, STATUS_OPTIONS} from "@/utils";
import {Gift, Receiver, Status} from "@/types";

type GiftCardProps = {
    gift: Gift;
    receiver?: Receiver,
    onEdit: (gift: Gift) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, s: Status) => void;
    compact?: boolean;
    isMobile?: boolean;
}

export const GiftCard = ({ gift, receiver, onEdit, onDelete, onStatusChange, compact, isMobile }: GiftCardProps) => {
    return (
        <div style={{ background: "#FFF", borderRadius: 12, padding: isMobile ? "12px" : compact ? "12px 14px" : "14px 16px", border: "1px solid #EDE5D8", transition: "all .2s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: isMobile ? 13 : 14, color: "#2D1810", marginBottom: 2 }}>{gift.name}</div>
                    {!compact && <div style={{ fontSize: 11, color: "#8B7355" }}>for {receiver?.emoji} {receiver?.name} · {gift.occasion}</div>}
                </div>

                {gift.price && <div style={{ fontFamily: "'Fraunces', serif", fontSize: isMobile ? 15 : 17, fontWeight: 700, color: "#B8860B", marginLeft: 8 }}>${parseFloat(gift.price).toFixed(2)}</div>}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6, flexWrap: "wrap", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Badge status={gift.status} />

                    {gift.url && <a href={gift.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: "#B8860B", textDecoration: "none", fontWeight: 600 }}>🔗</a>}
                </div>

                <div style={{ display: "flex", gap: 3 }}>
                    {STATUS_OPTIONS.filter(s => s !== gift.status).map(s => (
                        <button
                            key={s}
                            onClick={() => onStatusChange(gift.id, s)}
                            title={`Mark ${s}`}
                            style={{ width: 22, height: 22, borderRadius: 6, border: "1px solid #E8DDD0", background: STATUS_COLORS[s].bg, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                            <span
                                style={{ width: 5, height: 5, borderRadius: "50%", background: STATUS_COLORS[s].dot }}
                            />
                        </button>
                    ))}

                    <button
                        onClick={() => onEdit(gift)}
                        style={{ width: 22, height: 22, borderRadius: 6, border: "1px solid #E8DDD0", background: "#FFF", cursor: "pointer", fontSize: 10 }}
                    >
                        ✏️
                    </button>

                    <button
                        onClick={() => onDelete(gift.id)}
                        style={{ width: 22, height: 22, borderRadius: 6, border: "1px solid #FFCDD2", background: "#FFF", cursor: "pointer", fontSize: 10 }}
                    >
                        🗑
                    </button>
                </div>
            </div>

            {gift.notes && <div style={{ fontSize: 11, color: "#8B7355", marginTop: 6, fontStyle: "italic", lineHeight: 1.4 }}>{gift.notes}</div>}
        </div>
    );
}