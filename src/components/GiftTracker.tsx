import {useState} from "react";
import {ReceiverModal, GiftModal, BudgetModal, GiftCard, Button, OccasionListView, Sidebar, Header, OccasionModal} from "@/components";
import {useApp, useIsMobile} from "@/hooks";
import {daysUntil, getNextOccasionDate, STATUS_OPTIONS} from "@/utils";
import {Gift, GiftDefault, ModalState, OccasionConfig, Receiver, Status, Tab} from "@/types";
import clsx from "clsx";

const uid = () => Math.random().toString(36).slice(2, 10);

const getOccasionCountdown = (config: OccasionConfig): string => {
    if (config.date.type === "per-person") return "—";
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const year = now.getFullYear();
    let next = getNextOccasionDate(config.date, year);
    if (!next) return "—";
    if (next < now) next = getNextOccasionDate(config.date, year + 1);
    if (!next) return "—";
    const days = Math.ceil((next.getTime() - now.getTime()) / 86400000);
    return days === 0 ? "Today!" : `${days}d`;
};

const getOccasionSubtitle = (config: OccasionConfig, upcoming: Receiver[]): string => {
    if (config.date.type === "per-person") {
        if (upcoming.length === 0) return "No upcoming dates";
        return `Next: ${upcoming[0].emoji} ${upcoming[0].name} in ${daysUntil(upcoming[0].birthday)}d`;
    }
    const countdown = getOccasionCountdown(config);
    if (countdown === "Today!") return `Happy ${config.label}!`;
    return `${countdown} to go`;
};

export const GiftTracker = () => {
    const isMobile = useIsMobile();

    const { state, dispatch } = useApp();
    const {receivers, gifts, budgets, occasions} = state;

    const [tab, setTab] = useState("gifts");
    const [view, setView] = useState("all");
    const [filterOccasion, setFilterOccasion] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [search, setSearch] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [receiverModal, setReceiverModal] = useState<ModalState<Receiver>>({open: false});
    const [giftModal, setGiftModal] = useState<ModalState<Gift>>({open: false});
    const [giftDefaults, setGiftDefaults] = useState<GiftDefault | null>(null);
    const [budgetModal, setBudgetModal] = useState(false);
    const [occasionModal, setOccasionModal] = useState<ModalState<OccasionConfig>>({open: false});

    const filteredGifts = gifts.filter((g: Gift) => {
        if (view !== "all" && g.receiverId !== view) return false;
        if (filterOccasion !== "All" && g.occasion !== filterOccasion) return false;
        if (filterStatus !== "All" && g.status !== filterStatus) return false;
        if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const upcoming = [...receivers]
        .filter(r => r.birthday)
        .sort((a, b) => daysUntil(a.birthday) - daysUntil(b.birthday))
        .slice(0, 3);

    const handleSaveReceiver = (data: Omit<Receiver, "id">) => {
        const initial = receiverModal.open ? receiverModal.initial : null;
        if (initial?.id) {
            dispatch({type: "EDIT_RECEIVER", payload: {...data, id: initial.id}});
        } else {
            dispatch({type: "ADD_RECEIVER", payload: {...data, id: uid()}});
        }
    };

    const handleSaveGift = (data: Omit<Gift, "id">) => {
        const initial = giftModal.open ? giftModal.initial : null;
        if (initial?.id) {
            dispatch({type: "EDIT_GIFT", payload: {...data, id: initial.id}});
        } else {
            dispatch({type: "ADD_GIFT", payload: {...data, id: uid()}});
        }
    };

    const handleStatusChange = (id: string, s: Status) => {
        dispatch({type: "EDIT_GIFT", payload: {id, status: s}});
    };

    const handleSaveOccasion = (config: OccasionConfig) => {
        const initial = occasionModal.open ? occasionModal.initial : null;
        if (initial?.id) {
            dispatch({type: "EDIT_OCCASION", payload: config});
        } else {
            dispatch({type: "ADD_OCCASION", payload: config});
            setTab(config.id);
        }
    };

    const openGiftModalFor = (receiverId: string, occasionLabel: string) => {
        setGiftDefaults({defaultOccasion: occasionLabel, defaultReceiver: receiverId});
        setGiftModal({open: true, initial: null});
    };

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

    const occasionTabs = occasions.map(o => ({
        id: o.id,
        label: `${o.icon} ${o.label}`,
        short: o.icon,
        count: (state.lists[o.id] || []).length,
    }));

    const tabs: Tab[] = [
        {id: "gifts", label: "🎁 Gifts", short: "🎁", count: gifts.length},
        ...occasionTabs,
        {id: "_add", label: "+ Event", short: "+", count: 0},
    ];

    const occasionLabels = occasions.map(o => o.label);

    const selectedReceiver = view !== "all" ? receivers.find((x: Receiver) => x.id === view) : null;

    const handleTabClick = (id: string) => {
        if (id === "_add") {
            setOccasionModal({open: true, initial: null});
        } else {
            setTab(id);
            setSidebarOpen(false);
        }
    };

    return (
        <div className="w-full font-sans text-brown bg-[linear-gradient(180deg,var(--color-cream)_0%,var(--color-cream-warm)_100%)] min-h-svh">
            <Header
                tabs={tabs}
                selectedTab={tab}
                onTabClick={handleTabClick}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                setReceiverModal={setReceiverModal}
                setGiftModal={setGiftModal}
                setBudgetModal={setBudgetModal}
                setGiftDefaults={setGiftDefaults}
            />

            <div className="py-3.5 px-2.5 md:py-4.5 md:px-4">
                {/* Dynamic occasion tabs */}
                {tab !== "gifts" && tab !== "_add" && (() => {
                    const config = occasions.find(o => o.id === tab);
                    if (!config) return null;
                    return (
                        <OccasionListView
                            config={config}
                            headerSubtitle={getOccasionSubtitle(config, upcoming)}
                            countdownLabel={config.date.type === "per-person" ? "Next In" : "Days Left"}
                            countdownDays={config.date.type === "per-person"
                                ? (upcoming[0] ? `${daysUntil(upcoming[0].birthday)}d` : "—")
                                : getOccasionCountdown(config)
                            }
                            onStatusChange={handleStatusChange}
                            onOpenGiftModal={rid => openGiftModalFor(rid, config.label)}
                            onAddPerson={() => setReceiverModal({open: true, initial: null})}
                            onEditGift={g => {
                                setGiftDefaults({defaultOccasion: config.label});
                                setGiftModal({open: true, initial: g});
                            }}
                            onDeleteGift={id => {
                                if (confirm("Delete?")) dispatch({type: "DELETE_GIFT", payload: id});
                            }}
                            onEditOccasion={() => setOccasionModal({open: true, initial: config})}
                            onDeleteOccasion={() => {
                                if (confirm(`Delete "${config.label}" and all its gifts?`)) {
                                    dispatch({type: "DELETE_OCCASION", payload: config.id});
                                    setTab("gifts");
                                }
                            }}
                        />
                    );
                })()}

                {/* Gifts Tab */}
                {tab === "gifts" && (
                    <div className="flex gap-4 flex-col md:flex-row">
                        {isMobile && sidebarOpen && (
                            <div
                                className="fixed inset-0 bg-brown/30 z-[500] animate-[fadeIn_.15s_ease]"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <div
                                    className="absolute top-0 left-0 bottom-0 w-[280px] bg-cream p-3.5 overflow-y-auto shadow-[4px_0_20px_rgba(0,0,0,0.1)]"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-fraunces text-lg font-bold text-brown">People</span>
                                        <button className="bg-transparent border-none text-lg cursor-pointer text-brown-muted" onClick={() => setSidebarOpen(false)}>✕</button>
                                    </div>

                                    <Sidebar
                                        view={view}
                                        setView={setView}
                                        receivers={receivers}
                                        gifts={gifts}
                                        upcoming={upcoming}
                                        setSidebarOpen={setSidebarOpen}
                                        setReceiverModal={setReceiverModal}
                                    />
                                </div>
                            </div>
                        )}

                        {!isMobile && (
                            <Sidebar
                                view={view}
                                setView={setView}
                                receivers={receivers}
                                gifts={gifts}
                                upcoming={upcoming}
                                setSidebarOpen={setSidebarOpen}
                                setReceiverModal={setReceiverModal}
                            />
                        )}

                        <div className="flex-1 min-w-0">
                            {isMobile && selectedReceiver && (
                                <div className="flex items-center gap-1.5 mb-2.5 px-2.5 py-1.5 bg-gold-tint rounded-full border-[1.5px] border-gold-light w-fit text-xs font-semibold">
                                    {selectedReceiver.emoji} {selectedReceiver.name}
                                    <button className="bg-transparent border-none cursor-pointer text-xs text-brown-muted ml-1" onClick={() => setView("all")}>✕</button>
                                </div>
                            )}

                            <div className="flex gap-1.5 mb-3 flex-wrap">
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

                            {filteredGifts.length === 0 ? (
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
                            ) : (
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
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <ReceiverModal
                open={receiverModal.open}
                initial={receiverModal.open ? receiverModal.initial : null}
                onSave={handleSaveReceiver}
                onClose={() => setReceiverModal({open: false})}
            />

            <GiftModal
                receivers={receivers}
                occasions={occasionLabels}
                open={giftModal.open}
                initial={giftModal.open ? giftModal.initial : null}
                onClose={() => { setGiftModal({open: false}); setGiftDefaults(null); }}
                onSave={handleSaveGift}
                defaultOccasion={giftDefaults?.defaultOccasion}
                defaultReceiver={giftDefaults?.defaultReceiver}
            />

            <BudgetModal
                budgets={budgets}
                open={budgetModal}
                receivers={receivers}
                onClose={() => setBudgetModal(false)}
                onSave={(k, v) => dispatch({type: "SET_BUDGET", payload: {key: k, amount: v}})}
            />

            <OccasionModal
                open={occasionModal.open}
                initial={occasionModal.open ? occasionModal.initial : null}
                onClose={() => setOccasionModal({open: false})}
                onSave={handleSaveOccasion}
            />
        </div>
    );
};
