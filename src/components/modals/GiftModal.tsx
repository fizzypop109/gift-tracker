import {useEffect, useState} from "react";
import {Modal, Input, Select, Button} from "@/components";
import {STATUS_OPTIONS} from "@/utils";
import {Gift, Status} from "@/types";

type GiftModalProps = {
    open: boolean;
    occasions: string[];
    onClose: () => void;
    onSave: (gift: Omit<Gift, "id">) => void;
    initial: Gift | null;
    receivers: { id: string, name: string, emoji: string }[];
    defaultOccasion?: string;
    defaultReceiver?: string;
}

export const GiftModal = ({ open, occasions, onClose, onSave, initial, receivers, defaultOccasion, defaultReceiver }: GiftModalProps) => {
    const [name, setName] = useState("");
    const [receiverId, setReceiverId] = useState("");
    const [occasion, setOccasion] = useState("Christmas");
    const [price, setPrice] = useState("");
    const [status, setStatus] = useState<Status>("Idea");
    const [notes, setNotes] = useState("");
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (initial?.id) { setName(initial.name||""); setReceiverId(initial.receiverId||""); setOccasion(initial.occasion||"Christmas"); setPrice(initial.price||""); setStatus(initial.status||"Idea"); setNotes(initial.notes||""); setUrl(initial.url||""); }
        else { setName(""); setReceiverId(defaultReceiver || receivers[0]?.id || ""); setOccasion(defaultOccasion || "Christmas"); setPrice(""); setStatus("Idea"); setNotes(""); setUrl(""); }
    }, [initial, open, receivers, defaultOccasion, defaultReceiver]);

    return (
        <Modal open={open} onClose={onClose} title={initial?.id ? "Edit Gift" : "Add Gift"}>
            <Input label="Gift Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Kindle Paperwhite" />

            <div style={{ marginBottom: 12 }}>
                <span style={{ display: "block", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, color: "#8B7355", marginBottom: 4 }}>For</span>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {receivers.map(r => <button key={r.id} onClick={() => setReceiverId(r.id)} style={{ padding: "5px 12px", borderRadius: 20, border: receiverId === r.id ? "2px solid #B8860B" : "1.5px solid #E8DDD0", background: receiverId === r.id ? "#FFF8E1" : "#FFF", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>{r.emoji} {r.name}</button>)}
                </div>
            </div>

            <Select label="Occasion" options={occasions} value={occasion} onChange={e => setOccasion(e.target.value)} />

            <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>
                    <Input label="Price ($)" type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" />
                </div>

                <div style={{ flex: 1 }}>
                    <Select label="Status" options={[...STATUS_OPTIONS]} value={status} onChange={e => setStatus(e.target.value as Status)} />
                </div>
            </div>
            <Input label="Link (optional)" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />
            <label style={{ display: "block", marginBottom: 12 }}>
                <span style={{ display: "block", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, color: "#8B7355", marginBottom: 4 }}>Notes</span>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Size, colour, etc."
                          style={{ width: "100%", padding: "9px 11px", border: "1.5px solid #D4C4AE", borderRadius: 10, fontSize: 14, fontFamily: "'DM Sans', sans-serif", background: "#FFF", color: "#2D1810", outline: "none", boxSizing: "border-box", resize: "vertical" }} />
            </label>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={() => { if (!name.trim() || !receiverId) return; onSave({ name: name.trim(), receiverId, occasion, price, status, notes, url }); onClose(); }}>Save</Button>
            </div>
        </Modal>
    );
}