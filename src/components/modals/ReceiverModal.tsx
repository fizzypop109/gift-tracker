import {useEffect, useState} from "react";
import {Modal, Input, Button} from "@/components";
import {Receiver} from "@/types";

type ReceiverModalProps = {
    open: boolean;
    onClose: () => void;
    onSave: (receiver: Omit<Receiver, "id">) => void;
    initial: Receiver | null;
}

export const ReceiverModal = ({ open, onClose, onSave, initial }: ReceiverModalProps) => {
    const [name, setName] = useState(""); const [birthday, setBirthday] = useState(""); const [emoji, setEmoji] = useState("🎁");

    useEffect(() => { if (initial) { setName(initial.name || ""); setBirthday(initial.birthday || ""); setEmoji(initial.emoji || "🎁"); } else { setName(""); setBirthday(""); setEmoji("🎁"); } }, [initial, open]);

    const emojis = ["🎁","🎂","🌟","💝","🎄","🌸","🧸","🎮","📚","🍰","👶","👧","👦","👩","👨","👵","👴","🐶","🐱"];

    return (
        <Modal open={open} onClose={onClose} title={initial ? "Edit Person" : "Add Person"}>
            <Input label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mum" />

            <Input label="Birthday" type="date" value={birthday} onChange={e => setBirthday(e.target.value)} />

            <div style={{ marginBottom: 12 }}>
                <span style={{ display: "block", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, color: "#8B7355", marginBottom: 4 }}>Icon</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {emojis.map(e => <button key={e} onClick={() => setEmoji(e)} style={{ width: 34, height: 34, borderRadius: 8, border: emoji === e ? "2px solid #B8860B" : "1.5px solid #E8DDD0", background: emoji === e ? "#FFF8E1" : "#FFF", fontSize: 16, cursor: "pointer" }}>{e}</button>)}
                </div>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={() => { if (!name.trim()) return; onSave({ name: name.trim(), birthday, emoji }); onClose(); }}>Save</Button>
            </div>
        </Modal>
    );
}