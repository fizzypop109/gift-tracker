import {useEffect, useState} from "react";
import {Modal, Button} from "@/components";

type BudgetModalProps = {
    open: boolean;
    onClose: () => void;
    onSave: (key: string, value: number) => void;
    receivers: { id: string, name: string, emoji: string }[];
    budgets: { [key: string]: number };
    occasionFilter?: string;
}

export const BudgetModal = ({ open, onClose, onSave, receivers, budgets, occasionFilter }: BudgetModalProps) => {
    const [lb, setLb] = useState({});
    useEffect(() => { setLb({ ...budgets }); }, [budgets, open]);
    const occs = occasionFilter ? [occasionFilter] : ["Christmas", "Birthday"];
    return (
        <Modal open={open} onClose={onClose} title="Set Budgets">
            <p style={{ fontSize: 12, color: "#8B7355", margin: "0 0 14px", lineHeight: 1.5 }}>Spending limit per person per occasion.</p>
            {receivers.map(r => occs.map(occ => {
                const key = `${r.id}:${occ}`;
                return <div key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "#2D1810", flex: 1, fontWeight: 500 }}>{r.emoji} {r.name}{occs.length > 1 ? ` — ${occ}` : ""}</span>
                    <input type="number" min="0" step="1" value={lb[key] || ""} onChange={e => setLb(b => ({ ...b, [key]: e.target.value }))} placeholder="$"
                           style={{ width: 80, padding: "6px 8px", border: "1.5px solid #D4C4AE", borderRadius: 8, fontSize: 12, fontFamily: "'DM Sans', sans-serif", textAlign: "right" }} />
                </div>;
            }))}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 16 }}>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={() => { Object.entries(lb).forEach(([k, v]) => onSave(k, parseFloat(v) || 0)); onClose(); }}>Save</Button>
            </div>
        </Modal>
    );
}