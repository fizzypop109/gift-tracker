import clsx from "clsx";
import {useState} from "react";
import {Button, ListManageModal, BudgetModal} from "@/components";
import {daysUntil} from "@/utils";
import {GiftCard} from "@/components/GiftCard";
import {useIsMobile, useApp} from "@/hooks";
import {Gift, Receiver, Status, OccasionConfig} from "@/types";

type OccasionListViewProps = {
    config: OccasionConfig;
    headerSubtitle: string;
    countdownLabel: string;
    countdownDays: string;
    onEditGift: (gift: Gift) => void;
    onDeleteGift: (id: string) => void;
    onStatusChange: (id: string, s: Status) => void;
    onOpenGiftModal: (id: string) => void;
    onAddPerson: () => void;
    onEditOccasion: () => void;
    onDeleteOccasion: () => void;
}

export const OccasionListView = ({ config, headerSubtitle, countdownLabel, countdownDays, onEditGift, onDeleteGift, onStatusChange, onOpenGiftModal, onAddPerson, onEditOccasion, onDeleteOccasion }: OccasionListViewProps) => {
    const isMobile = useIsMobile();

    const { state, dispatch } = useApp();
    const { receivers, gifts, budgets, lists } = state;

    const listIds = lists[config.id] || [];

    const [manageOpen, setManageOpen] = useState(false);
    const [budgetOpen, setBudgetOpen] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);

    const listReceivers: Receiver[] = receivers.filter((r: Receiver) => listIds.includes(r.id));
    const occasionGifts: Gift[] = gifts.filter((g: Gift) => g.occasion === config.label);

    const sortedReceivers = config.id === "birthday"
        ? [...listReceivers].sort((a, b) => daysUntil(a.birthday) - daysUntil(b.birthday))
        : listReceivers;

    const totalBudget = listReceivers.reduce((s, r) => s + (budgets[`${r.id}:${config.label}`] || 0), 0);
    const totalSpent = listReceivers.reduce((s, r) => s + occasionGifts.filter(g => g.receiverId === r.id && g.status !== "Idea").reduce((gs, g) => gs + (parseFloat(g.price) || 0), 0), 0);
    const totalGiftsCount = occasionGifts.filter(g => listReceivers.some(r => r.id === g.receiverId)).length;
    const readyCount = occasionGifts.filter(g => listReceivers.some(r => r.id === g.receiverId) && g.status === "Purchased").length;

    return (
        <div>
            {/* Themed header — gradient is dynamic so background stays inline */}
            <div
                className={clsx(
                    "relative overflow-hidden mb-4",
                    isMobile ? "rounded-xl p-[18px_16px_14px]" : "rounded-2xl p-[22px_22px_18px]"
                )}
                style={{ background: config.accentGradient }}
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_85%,rgba(255,215,0,0.1)_0%,transparent_50%),radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.06)_0%,transparent_50%)]" />

                <div className="relative">
                    <div className="flex justify-between items-start mb-[14px] gap-2 flex-wrap">
                        <div>
                            <h2 className={clsx("font-fraunces font-extrabold text-white m-0", isMobile ? "text-xl" : "text-2xl")}>
                                {config.icon} {config.label}
                            </h2>
                            <p className="text-white/70 text-xs mt-[3px] mb-0">
                                {headerSubtitle}
                            </p>
                        </div>

                        <div className="flex gap-1.5">
                            <Button variant="secondary" small onClick={() => setBudgetOpen(true)} className="!bg-white/[12%] !text-white !border-white/20">💰</Button>
                            <Button variant="secondary" small onClick={() => setManageOpen(true)} className="!bg-white/[12%] !text-white !border-white/20">👥 Manage</Button>
                            <Button variant="secondary" small onClick={onEditOccasion} className="!bg-white/[12%] !text-white !border-white/20">✏️</Button>
                            <Button variant="secondary" small onClick={onDeleteOccasion} className="!bg-white/[12%] !text-white !border-white/20">🗑</Button>
                        </div>
                    </div>

                    <div className={clsx("grid gap-2", isMobile ? "grid-cols-2" : "grid-cols-4")}>
                        {[
                            { label: "People", value: listReceivers.length, className: "text-white" },
                            { label: "Gifts", value: `${readyCount}/${totalGiftsCount}`, className: "text-[#A5D6A7]" },
                            { label: "Spent", value: `$${totalSpent.toFixed(0)}`, sub: totalBudget ? `/$${totalBudget.toFixed(0)}` : "", className: "text-[#FFD54F]" },
                            { label: countdownLabel, value: countdownDays, className: "text-[#EF9A9A]" },
                        ].map(s => (
                            <div key={s.label} className={clsx("bg-white/[8%] rounded-lg border border-white/[6%]", isMobile ? "px-[10px] py-2" : "px-3 py-2")}>
                                <div className="text-[9px] text-white/50 uppercase tracking-[0.4px]">{s.label}</div>
                                <div className={clsx("font-fraunces font-bold mt-px", isMobile ? "text-[17px]" : "text-[19px]", s.className)}>
                                    {s.value}
                                    {s.sub && <span className="text-[10px] font-normal opacity-60">{s.sub}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Person accordion */}
            {sortedReceivers.length === 0 ? (
                <div className="text-center py-[50px] px-5 text-brown-muted">
                    <div className="text-[44px] mb-2.5">{config.icon}</div>
                    <div className="font-fraunces text-[17px] font-semibold mb-1.5 text-brown">{config.label} list is empty</div>
                    <p className="text-xs leading-[1.5] max-w-[280px] mx-auto mb-[14px]">
                        {receivers.length === 0 ? "Add someone to get started!" : "Add people to this list to start tracking."}
                    </p>
                    <div className="flex gap-2 justify-center flex-wrap">
                        {receivers.length === 0 && <Button small onClick={onAddPerson}>+ Add Person</Button>}
                        {receivers.length > 0 && <Button small onClick={() => setManageOpen(true)}>👥 Manage List</Button>}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-[10px]">
                    {sortedReceivers.map(r => {
                        const pg = occasionGifts.filter(g => g.receiverId === r.id);
                        const spent = pg.filter(g => g.status !== "Idea").reduce((s, g) => s + (parseFloat(g.price) || 0), 0);
                        const budget = budgets[`${r.id}:${config.label}`] || 0;
                        const isExpanded = expanded === r.id;
                        const bdayInfo = config.id === "birthday" && r.birthday ? `${daysUntil(r.birthday)} day${daysUntil(r.birthday) !== 1 ? "s" : ""} away` : null;

                        return (
                            <div key={r.id} className="bg-white rounded-xl border border-cream-border overflow-hidden">
                                <button
                                    onClick={() => setExpanded(isExpanded ? null : r.id)}
                                    className={clsx(
                                        "flex items-center w-full bg-transparent border-none cursor-pointer font-sans text-left gap-[10px]",
                                        isMobile ? "p-3" : "px-4 py-[14px]"
                                    )}
                                >
                                    <span className={clsx(isMobile ? "text-2xl" : "text-[26px]")}>{r.emoji}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className={clsx("font-semibold text-brown", isMobile ? "text-sm" : "text-[15px]")}>{r.name}</div>
                                        <div className="text-[11px] text-brown-muted mt-px">
                                            {pg.length} gift{pg.length !== 1 ? "s" : ""}
                                            {budget > 0 && ` · $${spent.toFixed(0)}/$${budget.toFixed(0)}`}
                                            {bdayInfo && ` · ${bdayInfo}`}
                                        </div>
                                    </div>
                                    <div className="flex gap-[3px] mr-2 shrink-0">
                                        {pg.slice(0, 8).map(g => (
                                            <span
                                                key={g.id}
                                                className={clsx(
                                                    "w-[7px] h-[7px] rounded-full",
                                                    g.status === "Purchased" ? "bg-purchased" : "bg-idea-dot"
                                                )}
                                            />
                                        ))}
                                        {pg.length === 0 && <span className="text-[10px] text-cream-border">—</span>}
                                    </div>
                                    <span
                                        className="text-xs text-brown-muted shrink-0 transition-transform duration-200"
                                        style={{ transform: isExpanded ? "rotate(180deg)" : "none" }}
                                    >
                                        ▼
                                    </span>
                                </button>

                                {budget > 0 && (
                                    <div className="px-4 pb-[6px]">
                                        <div className="h-[3px] bg-cream-border rounded-sm overflow-hidden">
                                            <div
                                                className="h-full rounded-sm transition-[width] duration-300"
                                                style={{
                                                    width: `${Math.min((spent / budget) * 100, 100)}%`,
                                                    background: spent > budget ? "var(--color-danger-bar)" : config.accentColor,
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {isExpanded && (
                                    <div className={clsx(
                                        "border-t border-cream-warm",
                                        isMobile ? "px-3 pt-2 pb-[14px]" : "px-4 pt-2 pb-[14px]"
                                    )}>
                                        {pg.length === 0 ? (
                                            <div className="text-center py-3 text-brown-muted text-xs">No gifts yet</div>
                                        ) : (
                                            <div className="flex flex-col gap-1.5 mb-[10px]">
                                                {pg.map(g => (
                                                    <GiftCard key={g.id} gift={g} receiver={r} onEdit={onEditGift} onDelete={onDeleteGift} onStatusChange={onStatusChange} compact isMobile={isMobile} />
                                                ))}
                                            </div>
                                        )}
                                        <Button small onClick={() => onOpenGiftModal(r.id)} className="w-full text-center">+ Add Gift for {r.name}</Button>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Quick add person */}
                    <button
                        onClick={onAddPerson}
                        className="flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed border-tan bg-transparent cursor-pointer font-sans text-[13px] font-semibold text-brown-muted transition-all duration-150 w-full hover:border-gold hover:text-gold"
                    >
                        + Add New Person
                    </button>
                </div>
            )}

            <ListManageModal
                open={manageOpen}
                onClose={() => setManageOpen(false)}
                receivers={receivers}
                listIds={listIds}
                onToggle={id => dispatch({ type: "TOGGLE_LIST", payload: { list: config.id, id } })}
                title={`Manage ${config.label} List`}
                accentColor={config.accentColor}
            />

            <BudgetModal
                open={budgetOpen}
                onClose={() => setBudgetOpen(false)}
                onSave={(k, v) => dispatch({ type: "SET_BUDGET", payload: { key: k, amount: v } })}
                receivers={listReceivers}
                budgets={budgets}
                occasionFilter={config.label}
            />
        </div>
    );
}
