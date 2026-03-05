import clsx from "clsx";
import {useEffect, useState} from "react";
import {Modal, Input, Button} from "@/components";
import {ModalProps, Receiver} from "@/types";

type ReceiverModalProps = ModalProps & {
    onSave: (receiver: Omit<Receiver, "id">) => void;
    initial: Receiver | null;
}

export const ReceiverModal = ({ open, onClose, onSave, initial }: ReceiverModalProps) => {
    const [name, setName] = useState("");
    const [birthday, setBirthday] = useState("");
    const [emoji, setEmoji] = useState("🎁");

    useEffect(() => {
        if (initial) {
            setName(initial.name || "");
            setBirthday(initial.birthday || "");
            setEmoji(initial.emoji || "🎁");
        } else {
            setName("");
            setBirthday("");
            setEmoji("🎁");
        }
    }, [initial, open]);

    const emojis = ["🎁","🎂","🌟","💝","🎄","🌸","🧸","🎮","📚","🍰","👶","👧","👦","👩","👨","👵","👴","🐶","🐱"];

    return (
        <Modal open={open} onClose={onClose} title={initial ? "Edit Person" : "Add Person"}>
            <Input label="Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mum" />

            <Input label="Birthday" type="date" value={birthday} onChange={e => setBirthday(e.target.value)} />

            <div className="mb-3">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.8px] text-brown-muted mb-1">Icon</span>
                <div className="flex flex-wrap gap-[5px]">
                    {emojis.map(e => (
                        <button
                            key={e}
                            onClick={() => setEmoji(e)}
                            className={clsx(
                                "w-[34px] h-[34px] rounded-lg text-base cursor-pointer",
                                emoji === e ? "border-2 border-gold bg-gold-tint" : "border-[1.5px] border-cream-subtle bg-white"
                            )}
                        >
                            {e}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex gap-2 justify-end mt-4">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={() => {
                    if (!name.trim()) return;
                    onSave({ name: name.trim(), birthday, emoji, personalEvents: initial?.personalEvents || [] });
                    onClose();
                }}>Save</Button>
            </div>
        </Modal>
    );
}
