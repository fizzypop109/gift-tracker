import clsx from "clsx";
import {STATUS_OPTIONS} from "@/utils";
import {Button} from "@/components/Button";
import {Gift, GiftDefault, Receiver, Status} from "@/types";
import {GiftCard} from "@/components/GiftCard";
import {useApp, useIsMobile} from "@/hooks";
import {Dispatch, SetStateAction, useState} from "react";

type AllGiftsViewProps = {
    view: string;
    setView: (view: string) => void;
    selectedReceiver?: Receiver | null;
    occasionLabels: string[];
    setBudgetModal: (open: boolean) => void;
    setReceiverModal: (modal: {open: boolean, initial: Receiver | null}) => void;
    setGiftModal: (modal: {open: boolean, initial: Gift | null}) => void;
    setGiftDefaults: Dispatch<SetStateAction<GiftDefault | null>>;
    handleStatusChange: (id: string, s: Status) => void;
}

export const AllGiftsView = ({ view, setView, selectedReceiver, occasionLabels, setBudgetModal, setGiftDefaults, setGiftModal, setReceiverModal, handleStatusChange }: AllGiftsViewProps) => {
    const isMobile = useIsMobile();

    const { state, dispatch } = useApp();
    const { gifts, receivers, budgets } = state;

    const [filterOccasion, setFilterOccasion] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [search, setSearch] = useState("");

    const filteredGifts = gifts.filter((g: Gift) => {
        if (view !== "all" && g.receiverId !== view) return false;
        if (filterOccasion !== "All" && g.occasion !== filterOccasion) return false;
        if (filterStatus !== "All" && g.status !== filterStatus) return false;
        if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const budgetInfo = (() => {
        if (view === "all" || filterOccasion === "All") return null;
        const key = `${view}:${filterOccasion}`;
        const budget = budgets[key] || 0;
        if (!budget) return null;
        const spent = gifts
            .filter((g: Gift) => g.receiverId === view && g.occasion === filterOccasion && g.status !== "Idea")
            .reduce((s: number, g: Gift) => s + (parseFloat(g.price) || 0), 0);
        return {budget, spent, pct: Math.min((spent / budget) * 100, 100)};
    })();

    return (
        <div className="flex gap-4 flex-col md:flex-row">
            <div className="flex flex-col gap-[10px] flex-1 min-w-0">
                {isMobile && selectedReceiver && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gold-tint rounded-full border-[1.5px] border-gold-light w-fit text-xs font-semibold">
                        {selectedReceiver.emoji} {selectedReceiver.name}
                        <button className="bg-transparent border-none cursor-pointer text-xs text-brown-muted ml-1" onClick={() => setView("all")}>✕</button>
                    </div>
                )}

                <div className="flex gap-1.5 flex-wrap">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className={clsx(
                            "flex-1 py-[7px] px-2.5 border-[1.5px] border-tan rounded-[10px] text-xs font-sans bg-white outline-none focus:border-gold",
                            isMobile ? "min-w-[100px]" : "min-w-[120px]"
                        )}
                    />

                    <select
                        value={filterOccasion}
                        onChange={e => setFilterOccasion(e.target.value)}
                        className="py-[7px] px-2 border-[1.5px] border-tan rounded-[10px] text-[11px] font-sans bg-white"
                    >
                        <option value="All">All Occasions</option>
                        {occasionLabels.map(o => (
                            <option key={o} value={o}>{o}</option>
                        ))}
                    </select>

                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="py-[7px] px-2 border-[1.5px] border-tan rounded-[10px] text-[11px] font-sans bg-white"
                    >
                        <option value="All">All Status</option>
                        {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>

                    {isMobile && (
                        <Button variant="secondary" small onClick={() => setBudgetModal(true)}>💰</Button>
                    )}
                </div>

                {budgetInfo && (
                    <div className="mb-3 p-2.5 px-3.5 bg-white rounded-[10px] border border-cream-border">
                        <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-brown-muted">Budget</span>
                            <span className={clsx("font-semibold", budgetInfo.spent > budgetInfo.budget ? "text-danger" : "text-brown")}>
                                            ${budgetInfo.spent.toFixed(2)} / ${budgetInfo.budget.toFixed(2)}
                                        </span>
                        </div>
                        <div className="h-[5px] bg-cream-border rounded-sm overflow-hidden">
                            <div
                                className={clsx(
                                    "h-full rounded-sm transition-[width] duration-300",
                                    budgetInfo.spent > budgetInfo.budget
                                        ? "bg-danger-bar"
                                        : "bg-[linear-gradient(90deg,var(--color-gold),var(--color-gold-light))]"
                                )}
                                style={{width: `${budgetInfo.pct}%`}}
                            />
                        </div>
                    </div>
                )}

                {/* No Gifts - Empty State */}
                {filteredGifts.length === 0 && (
                    <div className="text-center py-12 px-4 text-brown-muted">
                        <div className="text-[44px] mb-2.5">🎀</div>
                        <div className="font-fraunces text-[17px] font-semibold mb-1.5 text-brown">
                            {gifts.length === 0 ? "No gifts yet" : "No matches"}
                        </div>
                        <p className="text-xs leading-normal max-w-[260px] mx-auto">
                            {receivers.length === 0
                                ? "Add someone to get started!"
                                : "Try adjusting your filters or add a new gift."}
                        </p>
                        <div className="flex gap-2 justify-center mt-3 flex-wrap">
                            {receivers.length === 0 && (
                                <Button small onClick={() => setReceiverModal({open: true, initial: null})}>+ Add Person</Button>
                            )}
                            {receivers.length > 0 && (
                                <Button small onClick={() => { setGiftDefaults(null); setGiftModal({open: true, initial: null}); }}>+ Add Gift</Button>
                            )}
                        </div>
                    </div>
                )}

                {/* Gifts List */}
                {filteredGifts.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                        {filteredGifts.map((g: Gift) => (
                            <GiftCard
                                key={g.id}
                                gift={g}
                                receiver={receivers.find((r: Receiver) => r.id === g.receiverId)}
                                onEdit={gift => { setGiftDefaults(null); setGiftModal({open: true, initial: gift}); }}
                                onDelete={id => { if (confirm("Delete?")) dispatch({type: "DELETE_GIFT", payload: id}); }}
                                onStatusChange={handleStatusChange}
                                isMobile={isMobile}
                            />
                        ))}
                    </div>
                )}

                {gifts.length > 0 && (
                    <button
                        onClick={() => setGiftModal({open: true, initial: null})}
                        disabled={receivers.length === 0}
                        className={clsx(
                            "flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed border-tan bg-transparent cursor-pointer font-sans text-[13px] font-semibold text-brown-muted transition-all duration-150 w-full hover:border-gold hover:text-gold",
                            receivers.length === 0 && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {`+ Add Gift`}
                    </button>
                )}
            </div>
        </div>
    )
}