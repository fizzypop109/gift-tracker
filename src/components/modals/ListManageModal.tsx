import {Modal, Button} from "@/components";
import {formatDate} from "@/utils";
import {ModalProps} from "@/types";

type ListManageModalProps = ModalProps & {
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
            {off.length > 0 && (
                <>
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.8px] text-brown-muted mb-[6px]">Not on list</span>
                    <div className="flex flex-col gap-[5px] mb-4">
                        {off.map(r => (
                            <div key={r.id} className="flex items-center justify-between px-3 py-[9px] rounded-[10px] border-[1.5px] border-cream-subtle bg-white">
                                <span className="text-[13px]">{r.emoji} {r.name}</span>
                                <button
                                    onClick={() => onToggle(r.id)}
                                    className="px-3 py-1 rounded-lg border-[1.5px] border-purchased-border bg-purchased-bg text-purchased-text text-[11px] font-semibold cursor-pointer font-sans"
                                >
                                    + Add
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
            {on.length > 0 && (
                <>
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.8px] text-brown-muted mb-[6px]">On the list</span>
                    <div className="flex flex-col gap-[5px] mb-[14px]">
                        {on.map(r => (
                            <div
                                key={r.id}
                                className="flex items-center justify-between px-3 py-[9px] rounded-[10px]"
                                style={{ border: `1.5px solid ${accentColor}33`, background: `${accentColor}0A` }}
                            >
                                <span className="text-[13px]">{r.emoji} {r.name}{r.birthday ? ` · 🎂 ${formatDate(r.birthday)}` : ""}</span>
                                <button
                                    onClick={() => onToggle(r.id)}
                                    className="px-3 py-1 rounded-lg border-[1.5px] border-danger-border bg-white text-danger text-[11px] font-semibold cursor-pointer font-sans"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
            {receivers.length === 0 && (
                <p className="text-center text-brown-muted text-xs p-4">Add people from the main Gifts tab first.</p>
            )}
            <div className="flex justify-end">
                <Button variant="secondary" onClick={onClose}>Done</Button>
            </div>
        </Modal>
    );
}
