import clsx from "clsx";
import {useState, useEffect} from "react";
import {Modal, Input, Button} from "@/components";
import {OccasionConfig, OccasionDateType} from "@/types";

const ICONS = ["🎄","🎂","💝","💐","👔","🎃","🐣","🎆","🥂","🎁","🌟","🎉","💍","🧧","🕎"];
const COLORS = [
    { color: "#4CAF50", gradient: "linear-gradient(135deg, #1B5E20, #2E7D32, #1B5E20)" },
    { color: "#E91E63", gradient: "linear-gradient(135deg, #880E4F, #AD1457, #C2185B)" },
    { color: "#2196F3", gradient: "linear-gradient(135deg, #0D47A1, #1565C0, #1976D2)" },
    { color: "#FF9800", gradient: "linear-gradient(135deg, #E65100, #F57C00, #FF9800)" },
    { color: "#9C27B0", gradient: "linear-gradient(135deg, #4A148C, #7B1FA2, #9C27B0)" },
    { color: "#F44336", gradient: "linear-gradient(135deg, #B71C1C, #D32F2F, #F44336)" },
    { color: "#009688", gradient: "linear-gradient(135deg, #004D40, #00796B, #009688)" },
    { color: "#FFB300", gradient: "linear-gradient(135deg, #E65100, #FF8F00, #FFB300)" },
];

type OccasionModalProps = {
    open: boolean;
    onClose: () => void;
    onSave: (config: OccasionConfig) => void;
    initial?: OccasionConfig | null;
}

export const OccasionModal = ({ open, onClose, onSave, initial }: OccasionModalProps) => {
    const [label, setLabel] = useState("");
    const [icon, setIcon] = useState("🎁");
    const [colorIdx, setColorIdx] = useState(0);
    const [dateType, setDateType] = useState<"fixed" | "per-person" | "custom">("fixed");
    const [month, setMonth] = useState(1);
    const [day, setDay] = useState(1);
    const [customDate, setCustomDate] = useState("");
    const [autoAdd, setAutoAdd] = useState(true);

    useEffect(() => {
        if (initial) {
            setLabel(initial.label);
            setIcon(initial.icon);
            setAutoAdd(initial.autoAdd);
            const ci = COLORS.findIndex(c => c.color === initial.accentColor);
            setColorIdx(ci >= 0 ? ci : 0);
            if (initial.date.type === "fixed") {
                setDateType("fixed");
                setMonth(initial.date.month);
                setDay(initial.date.day);
            } else if (initial.date.type === "per-person") {
                setDateType("per-person");
            } else if (initial.date.type === "custom") {
                setDateType("custom");
                setCustomDate(initial.date.date);
            }
        } else {
            setLabel("");
            setIcon("🎁");
            setColorIdx(0);
            setDateType("fixed");
            setMonth(1);
            setDay(1);
            setCustomDate("");
            setAutoAdd(true);
        }
    }, [initial, open]);

    const handleSave = () => {
        if (!label.trim()) return;

        let date: OccasionDateType;
        if (dateType === "fixed") date = { type: "fixed", month, day };
        else if (dateType === "per-person") date = { type: "per-person" };
        else date = { type: "custom", date: customDate };

        const c = COLORS[colorIdx];

        onSave({
            id: initial?.id || label.toLowerCase().replace(/[^a-z0-9]/g, "-"),
            label: label.trim(),
            icon,
            date,
            accentColor: c.color,
            accentGradient: c.gradient,
            autoAdd,
        });

        onClose();
    };

    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    return (
        <Modal open={open} onClose={onClose} title={initial ? "Edit Event" : "New Event"}>
            <Input label="Name" value={label} onChange={e => setLabel(e.target.value)} placeholder="e.g. Easter" />

            <div className="mb-3">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-brown-muted mb-1">Icon</span>
                <div className="flex flex-wrap gap-1.5">
                    {ICONS.map(e => (
                        <button
                            key={e}
                            onClick={() => setIcon(e)}
                            className={clsx(
                                "w-9 h-9 rounded-lg text-lg cursor-pointer",
                                icon === e ? "border-2 border-gold bg-gold-tint" : "border border-cream-subtle bg-white"
                            )}
                        >
                            {e}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-3">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-brown-muted mb-1">Colour</span>
                <div className="flex flex-wrap gap-1.5">
                    {COLORS.map((c, i) => (
                        <button
                            key={c.color}
                            onClick={() => setColorIdx(i)}
                            className={clsx(
                                "w-8 h-8 rounded-full cursor-pointer",
                                colorIdx === i ? "ring-2 ring-offset-2 ring-gold" : ""
                            )}
                            style={{ background: c.gradient }}
                        />
                    ))}
                </div>
            </div>

            <div className="mb-3">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-brown-muted mb-1">When</span>
                <div className="flex flex-wrap gap-1.5 mb-2">
                    {([
                        { value: "fixed", label: "Same date every year" },
                        { value: "per-person", label: "Different per person" },
                        { value: "custom", label: "Specific date" },
                    ] as const).map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setDateType(opt.value)}
                            className={clsx(
                                "px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer font-sans",
                                dateType === opt.value ? "border-2 border-gold bg-gold-tint" : "border border-cream-subtle bg-white"
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {dateType === "fixed" && (
                    <div className="flex gap-2">
                        <select
                            value={month}
                            onChange={e => setMonth(Number(e.target.value))}
                            className="flex-1 p-2 border border-tan rounded-lg text-sm font-sans bg-white"
                        >
                            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                        </select>
                        <input
                            type="number" min={1} max={31} value={day}
                            onChange={e => setDay(Number(e.target.value))}
                            className="w-16 p-2 border border-tan rounded-lg text-sm font-sans bg-white text-center"
                        />
                    </div>
                )}

                {dateType === "custom" && (
                    <Input label="" type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} />
                )}

                {dateType === "per-person" && (
                    <p className="text-xs text-brown-muted">
                        Each person will have their own date for this event (like birthdays).
                    </p>
                )}
            </div>

            <label className="flex items-center gap-2 mb-4 cursor-pointer">
                <input
                    type="checkbox"
                    checked={autoAdd}
                    onChange={e => setAutoAdd(e.target.checked)}
                    className="w-4 h-4 accent-gold"
                />
                <span className="text-xs text-brown-mid">Automatically add new people to this list</span>
            </label>

            <div className="flex gap-2 justify-end">
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </div>
        </Modal>
    );
};
