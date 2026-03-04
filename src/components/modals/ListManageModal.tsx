import {Modal, Button} from "@/components";
import {formatDate} from "@/utils";

type ListManageModalProps = {
    open: boolean;
    onClose: () => void;
    receivers: { id: string, name: string, emoji: string, birthday: string }[];
    listIds: string[];
    onToggle: (id: string) => void;
    title: string;
    accentColor: string;
}

export const ListManageModal = ({ open, onClose, receivers, listIds, onToggle, title, accentColor }: ListManageModalProps) => {
    const on = receivers.filter(r => listIds.includes(r.id));
    const off = receivers.filter(r => !listIds.includes(r.id));
    return (
        <Modal open={open} onClose={onClose} title={title} width={460}>
            {off.length > 0 && <>
                <span style={{ display: "block", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, color: "#8B7355", marginBottom: 6 }}>Not on list</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 16 }}>
                    {off.map(r => <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 10, border: "1.5px solid #E8DDD0", background: "#FFF" }}>
                        <span style={{ fontSize: 13 }}>{r.emoji} {r.name}</span>
                        <button onClick={() => onToggle(r.id)} style={{ padding: "4px 12px", borderRadius: 8, border: "1.5px solid #C8E6C9", background: "#E8F5E9", color: "#1B5E20", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>+ Add</button>
                    </div>)}
                </div>
            </>}
            {on.length > 0 && <>
                <span style={{ display: "block", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, color: "#8B7355", marginBottom: 6 }}>On the list</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
                    {on.map(r => <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", borderRadius: 10, border: `1.5px solid ${accentColor}33`, background: `${accentColor}0A` }}>
                        <span style={{ fontSize: 13 }}>{r.emoji} {r.name}{r.birthday ? ` · 🎂 ${formatDate(r.birthday)}` : ""}</span>
                        <button onClick={() => onToggle(r.id)} style={{ padding: "4px 12px", borderRadius: 8, border: "1.5px solid #FFCDD2", background: "#FFF", color: "#C62828", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Remove</button>
                    </div>)}
                </div>
            </>}
            {receivers.length === 0 && <p style={{ textAlign: "center", color: "#8B7355", fontSize: 12, padding: 16 }}>Add people from the main Gifts tab first.</p>}
            <div style={{ display: "flex", justifyContent: "flex-end" }}><Button variant="secondary" onClick={onClose}>Done</Button></div>
        </Modal>
    );
}