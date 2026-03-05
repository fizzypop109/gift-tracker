import {useState, useEffect} from "react";
import {Modal, Input, Button} from "@/components";
import {ModalProps, PersonalEvent} from "@/types";

const ICONS = ["💍", "🎓", "💝", "🏠", "👶", "🐶", "✈️", "🎉", "⭐", "🌹"];

type Props = ModalProps & {
    initial: PersonalEvent | null;
    onSave: (data: Omit<PersonalEvent, "id">) => void;
}

export const PersonalEventModal = ({open, initial, onClose, onSave}: Props) => {
    const [label, setLabel] = useState("");
    const [icon, setIcon] = useState("💍");
    const [date, setDate] = useState("");

    useEffect(() => {
        if (initial) {
            setLabel(initial.label);
            setIcon(initial.icon);
            setDate(initial.date);
        } else {
            setLabel("");
            setIcon("💍");
            setDate("");
        }
    }, [initial, open]);

    return (
        <Modal open={open} onClose={onClose} title={initial ? "Edit Date" : "Add Important Date"}>
            <Input label="Name" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Anniversary" />
            <Input label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} />
            <div className="mb-3">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-brown-muted mb-1">Icon</span>
                <div className="flex flex-wrap gap-1.5">
                    {ICONS.map(e => (
                        <button key={e} onClick={() => setIcon(e)}
                                className={`w-9 h-9 rounded-lg text-lg cursor-pointer ${icon === e ? "border-2 border-gold bg-gold-tint" : "border border-cream-subtle bg-white"}`}>
                            {e}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex gap-2 justify-end">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={() => {
                    if (!label.trim() || !date) return;
                    onSave({label: label.trim(), icon, date});
                    onClose();
                }}>Save</Button>
            </div>
        </Modal>
    );
};