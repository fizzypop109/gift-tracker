import {SetStateAction, useState} from "react";
import {useApp, useIsMobile} from "@/hooks";
import {daysUntil, formatDate, turningAge} from "@/utils";
import {Gift, ModalProps, ModalState, PersonalEvent, Receiver, Status} from "@/types";
import {Button, GiftCard, Modal, PersonalEventModal} from "@/components";
import clsx from "clsx";

const uid = () => Math.random().toString(36).slice(2, 10);

type PersonModalProps = ModalProps & {
    selectedPerson: string | null;
    onEditGift: (gift: Gift) => void;
    onDeleteGift: (id: string) => void;
    setReceiverModal: (value: SetStateAction<ModalState<Receiver>>) => void
    onStatusChange: (id: string, s: Status) => void;
    onAddGift: (receiverId: string, occasion?: string) => void;
}

export const PersonModal = ({open, onClose, setReceiverModal, selectedPerson, onEditGift, onDeleteGift, onStatusChange, onAddGift}: PersonModalProps) => {
    const isMobile = useIsMobile();

    const {state, dispatch} = useApp();
    const {gifts, occasions, lists, receivers} = state;

    const [eventModal, setEventModal] = useState<ModalState<PersonalEvent>>({open: false});

    const personGifts = gifts.filter(g => g.receiverId === selectedPerson);
    const totalSpent = personGifts
        .filter(g => g.status === "Purchased")
        .reduce((s, g) => s + (parseFloat(g.price) || 0), 0);

    // Global events this person is part of
    const memberOf = selectedPerson ? occasions.filter(o => (lists[o.id] || []).includes(selectedPerson)) : [];

    const person = receivers.find(r => r.id === selectedPerson);

    if (!person) return null;

    // Personal events
    const personalEvents = person.personalEvents || [];

    // All upcoming dates for this person
    const upcomingDates = [
        ...(person.birthday ? [{
            label: "Birthday",
            icon: "🎂",
            date: formatDate(person.birthday),
            days: daysUntil(person.birthday),
            age: turningAge(person.birthday),
        }] : []),
        ...personalEvents.map(e => ({
            label: e.label,
            icon: e.icon,
            date: formatDate(e.date),
            days: daysUntil(e.date),
            age: null,
        })),
    ].sort((a, b) => a.days - b.days);

    // Group gifts by occasion
    const giftsByOccasion = personGifts.reduce<Record<string, Gift[]>>((acc, g) => {
        const key = g.occasion || "Other";
        if (!acc[key]) acc[key] = [];
        acc[key].push(g);
        return acc;
    }, {});

    const handleSaveEvent = (data: Omit<PersonalEvent, "id">) => {
        if (!selectedPerson) return;

        const initial = eventModal.open ? eventModal.initial : null;
        if (initial?.id) {
            dispatch({
                type: "EDIT_PERSONAL_EVENT",
                payload: {receiverId: selectedPerson, event: {...data, id: initial.id}},
            });
        } else {
            dispatch({
                type: "ADD_PERSONAL_EVENT",
                payload: {receiverId: selectedPerson, event: {...data, id: uid()}},
            });
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="" width={560}>
            <div className="flex flex-col gap-4">
                <div className="bg-white rounded-xl border border-cream-border p-5">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl">{person.emoji}</span>
                        <div className="flex-1">
                            <h2 className="font-fraunces text-xl font-bold text-brown m-0">{person.name}</h2>
                            {person.birthday && (
                                <div className="text-xs text-brown-muted mt-1">
                                    🎂 {formatDate(person.birthday)}
                                    {turningAge(person.birthday) && ` · Turning ${turningAge(person.birthday)}`}
                                    {` · ${daysUntil(person.birthday)}d away`}
                                </div>
                            )}
                        </div>

                        <Button
                            small
                            variant="secondary"
                            onClick={() => setReceiverModal({ open: true, initial: person })}
                        >
                            Edit
                        </Button>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-px bg-cream-border rounded-lg overflow-hidden">
                        {[
                            {label: "Gifts", value: personGifts.length},
                            {label: "Purchased", value: personGifts.filter(g => g.status === "Purchased").length},
                            {label: "Spent", value: `$${totalSpent.toFixed(0)}`},
                        ].map(s => (
                            <div key={s.label} className="bg-white p-3 text-center">
                                <div className="text-[9px] uppercase tracking-wider text-brown-muted">{s.label}</div>
                                <div className="font-fraunces text-lg font-bold text-brown">{s.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Important Dates */}
                <div className="bg-white rounded-xl border border-cream-border p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-brown-muted m-0">Important Dates</h3>
                        <button
                            onClick={() => setEventModal({open: true, initial: null})}
                            className="text-[11px] font-semibold text-gold cursor-pointer bg-none border-none font-sans"
                        >
                            + Add
                        </button>
                    </div>

                    {upcomingDates.length === 0 ? (
                        <p className="text-xs text-brown-muted">No dates added yet.</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {upcomingDates.map(d => (
                                <div key={d.label} className={clsx(
                                    "flex items-center gap-3 p-2.5 rounded-lg border",
                                    d.days <= 14 ? "bg-idea-bg border-[#FFB74D]" : "bg-[#FAFAF5] border-cream-border"
                                )}>
                                    <span className="text-lg">{d.icon}</span>
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-brown">{d.label}</div>
                                        <div className="text-[11px] text-brown-muted">
                                            {d.date}
                                            {d.age && ` · Turning ${d.age}`}
                                        </div>
                                    </div>
                                    <div className={clsx(
                                        "text-right",
                                        d.days <= 14 ? "text-idea-text" : "text-brown-muted"
                                    )}>
                                        <div className="font-fraunces text-base font-bold">{d.days}</div>
                                        <div className="text-[8px] uppercase tracking-wider">days</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Member of (global events) */}
                {memberOf.length > 0 && (
                    <div className="bg-white rounded-xl border border-cream-border p-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-brown-muted m-0 mb-3">Event Lists</h3>
                        <div className="flex flex-wrap gap-2">
                            {memberOf.map(o => (
                                <span key={o.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-cream-border"
                                      style={{background: `${o.accentColor}10`, color: o.accentColor}}>
                                    {o.icon} {o.label}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Gifts by occasion */}
                {Object.entries(giftsByOccasion).map(([occasion, og]) => (
                    <div key={occasion}>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-brown-muted m-0">{occasion} Gifts</h3>
                            <button
                                onClick={() => onAddGift(person.id, occasion)}
                                className="text-[11px] font-semibold text-gold cursor-pointer bg-none border-none font-sans"
                            >
                                + Add
                            </button>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {og.map(g => (
                                <GiftCard
                                    key={g.id}
                                    gift={g}
                                    onEdit={onEditGift}
                                    onDelete={onDeleteGift}
                                    onStatusChange={onStatusChange}
                                    compact
                                    isMobile={isMobile}
                                />
                            ))}
                        </div>
                    </div>
                ))}

                {personGifts.length === 0 && (
                    <div className="text-center py-8 text-brown-muted">
                        <div className="text-3xl mb-2">🎁</div>
                        <p className="text-xs mb-3">No gifts yet for {person.name}</p>
                        <Button small onClick={() => onAddGift(person.id)}>+ Add Gift</Button>
                    </div>
                )}

                {/* Personal Event Modal */}
                <PersonalEventModal
                    open={eventModal.open}
                    initial={eventModal.open ? eventModal.initial : null}
                    onClose={() => setEventModal({open: false})}
                    onSave={handleSaveEvent}
                />
            </div>
        </Modal>
    );
};