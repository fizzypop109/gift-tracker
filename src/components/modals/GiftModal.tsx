import clsx from "clsx";
import {useEffect, useState} from "react";
import {Modal, Input, Select, Button} from "@/components";
import {STATUS_OPTIONS} from "@/utils";
import {Gift, ModalProps, Status} from "@/types";

type GiftModalProps = ModalProps & {
    occasions: string[];
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
        if (initial?.id) {
            setName(initial.name || "");
            setReceiverId(initial.receiverId || "");
            setOccasion(initial.occasion || "Christmas");
            setPrice(initial.price || "");
            setStatus(initial.status || "Idea");
            setNotes(initial.notes || "");
            setUrl(initial.url || "");
        } else {
            setName("");
            setReceiverId(defaultReceiver || receivers[0]?.id || "");
            setOccasion(defaultOccasion || "Christmas");
            setPrice("");
            setStatus("Idea");
            setNotes("");
            setUrl("");
        }
    }, [initial, open, receivers, defaultOccasion, defaultReceiver]);

    return (
        <Modal open={open} onClose={onClose} title={initial?.id ? "Edit Gift" : "Add Gift"}>
            <Input label="Gift Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Kindle Paperwhite" />

            <div className="mb-3">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.8px] text-brown-muted mb-1">For</span>
                <div className="flex flex-wrap gap-[5px]">
                    {receivers.map(r => (
                        <button
                            key={r.id}
                            onClick={() => setReceiverId(r.id)}
                            className={clsx(
                                "px-3 py-[5px] rounded-[20px] text-xs cursor-pointer font-sans",
                                receiverId === r.id ? "border-2 border-gold bg-gold-tint" : "border-[1.5px] border-cream-subtle bg-white"
                            )}
                        >
                            {r.emoji} {r.name}
                        </button>
                    ))}
                </div>
            </div>

            <Select label="Occasion" options={occasions} value={occasion} onChange={e => setOccasion(e.target.value)} />

            <div className="flex gap-2">
                <div className="flex-1">
                    <Input label="Price ($)" type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" />
                </div>
                <div className="flex-1">
                    <Select label="Status" options={[...STATUS_OPTIONS]} value={status} onChange={e => setStatus(e.target.value as Status)} />
                </div>
            </div>

            <Input label="Link (optional)" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." />

            <label className="block mb-3">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.8px] text-brown-muted mb-1">Notes</span>
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Size, colour, etc."
                    className="w-full py-[9px] px-[11px] border-[1.5px] border-tan rounded-[10px] text-sm font-sans bg-white text-brown outline-none resize-y"
                />
            </label>

            <div className="flex gap-2 justify-end mt-4">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={() => {
                    if (!name.trim() || !receiverId) return;
                    onSave({ name: name.trim(), receiverId, occasion, price, status, notes, url });
                    onClose();
                }}>Save</Button>
            </div>
        </Modal>
    );
}
