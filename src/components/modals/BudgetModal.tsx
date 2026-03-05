import {useEffect, useState} from "react";
import {Modal, Button} from "@/components";
import {useApp} from "@/hooks";
import {ModalProps} from "@/types";

type BudgetModalProps = ModalProps & {
    onSave: (key: string, value: number) => void;
    receivers: { id: string, name: string, emoji: string }[];
    budgets: { [key: string]: number };
    occasionFilter?: string;
}

export const BudgetModal = ({ open, onClose, onSave, receivers, budgets, occasionFilter }: BudgetModalProps) => {
    const { state } = useApp();

    const [lb, setLb] = useState<Record<string, string>>({});

    useEffect(() => {
        const stringified: Record<string, string> = {};
        for (const [k, v] of Object.entries(budgets)) {
            stringified[k] = String(v);
        }
        setLb(stringified);
    }, [budgets, open]);

    const entries = occasionFilter
        ? (() => {
            const occasion = state.occasions.find(o => o.label === occasionFilter);
            if (!occasion) return [];
            const listIds = state.lists[occasion.id] || [];
            return receivers
                .filter(r => listIds.includes(r.id))
                .map(r => ({ receiver: r, occasion: occasionFilter }));
        })()
        : receivers.flatMap(r =>
            state.occasions
                .filter(o => (state.lists[o.id] || []).includes(r.id))
                .map(o => ({ receiver: r, occasion: o.label }))
        );

    return (
        <Modal open={open} onClose={onClose} title="Set Budgets">
            <p className="text-xs text-brown-muted mb-[14px] leading-[1.5]">
                Spending limit per person per occasion.
            </p>

            {entries.map(({ receiver: r, occasion: occ }) => {
                const key = `${r.id}:${occ}`;
                return (
                    <div key={key} className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-brown flex-1 font-medium">
                            {r.emoji} {r.name} — {occ}
                        </span>

                        <input
                            type="number" min="0" step="1"
                            value={lb[key] || ""}
                            onChange={e => setLb(b => ({...b, [key]: e.target.value}))}
                            placeholder="$"
                            className="w-20 py-[6px] px-2 border-[1.5px] border-tan rounded-lg text-xs font-sans text-right"
                        />
                    </div>
                );
            })}

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
