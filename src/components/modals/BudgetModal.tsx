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
            <p className="text-xs text-brown-muted mb-[14px] leading-[1.5]">Spending limit per person per occasion.</p>
            {receivers.map(r => occs.map(occ => {
                const key = `${r.id}:${occ}`;
                return (
                    <div key={key} className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-brown flex-1 font-medium">{r.emoji} {r.name}{occs.length > 1 ? ` — ${occ}` : ""}</span>
                        <input
                            type="number" min="0" step="1"
                            value={lb[key] || ""}
                            onChange={e => setLb(b => ({ ...b, [key]: e.target.value }))}
                            placeholder="$"
                            className="w-20 py-[6px] px-2 border-[1.5px] border-tan rounded-lg text-xs font-sans text-right"
                        />
                    </div>
                );
            }))}
            <div className="flex gap-2 justify-end mt-4">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={() => {
                    Object.entries(lb).forEach(([k, v]) => onSave(k, parseFloat(v) || 0));
                    onClose();
                }}>Save</Button>
            </div>
        </Modal>
    );
}
