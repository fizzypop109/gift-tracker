import {useState} from "react";
import {ReceiverModal, GiftModal, BudgetModal, GiftCard, Button, OccasionListView, Sidebar} from "@/components";
import {usePersistedReducer, useIsMobile} from "@/hooks";
import {daysUntil, daysUntilChristmas, OCCASIONS, STATUS_OPTIONS} from "@/utils";
import {Gift, GiftDefault, Occasion, Receiver, Status} from "@/types";
import clsx from "clsx";

const uid = () => Math.random().toString(36).slice(2, 10);

export const GiftTracker = () => {
    const isMobile = useIsMobile();

    const [state, dispatch] = usePersistedReducer();

    const {receivers, gifts, budgets} = state;

    const [tab, setTab] = useState("gifts");
    const [view, setView] = useState("all");
    const [filterOccasion, setFilterOccasion] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [search, setSearch] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [receiverModal, setReceiverModal] = useState<Receiver | null>(null);
    const [giftModal, setGiftModal] = useState<Gift | null>(null);
    const [giftDefaults, setGiftDefaults] = useState<GiftDefault | null>(null);
    const [budgetModal, setBudgetModal] = useState(false);

    const filteredGifts = gifts.filter((g: Gift) => {
        if (view !== "all" && g.receiverId !== view) return false;

        if (filterOccasion !== "All" && g.occasion !== filterOccasion) return false;

        if (filterStatus !== "All" && g.status !== filterStatus) return false;

        if (search && !g.name.toLowerCase().includes(search.toLowerCase())) return false;

        return true;
    });

    const upcoming = [...receivers].filter(r => r.birthday).sort((a, b) => daysUntil(a.birthday) - daysUntil(b.birthday)).slice(0, 3);

    const handleSaveReceiver = (data: Omit<Receiver, "id">) => {
        if (receiverModal?.id) {
            dispatch({
                type: "EDIT_RECEIVER",
                payload: {...data, id: receiverModal.id}
            });
        } else {
            dispatch({
                type: "ADD_RECEIVER",
                payload: {...data, id: uid()}
            });
        }
    };

    const handleSaveGift = (data: Omit<Gift, "id">) => {
        if (giftModal?.id) {
            dispatch({
                type: "EDIT_GIFT",
                payload: {...data, id: giftModal.id}
            });
        } else {
            dispatch({
                type: "ADD_GIFT",
                payload: {...data, id: uid()}
            });
        }
    };

    const handleStatusChange = (id: string, s: Status) => {
        dispatch({
            type: "EDIT_GIFT",
            payload: {id, status: s}
        });
    }

    const openGiftModalFor = (receiverId: string, occasion: Occasion) => {
        setGiftDefaults({
            defaultOccasion: occasion,
            defaultReceiver: receiverId
        });

        setGiftModal(null);
    };

    const budgetInfo = (() => {
        if (view === "all" || filterOccasion === "All") return null;

        const key = `${view}:${filterOccasion}`;
        const budget = parseFloat(budgets[key]) || 0;

        if (!budget) return null;

        const spent = gifts.filter((g: Gift) => g.receiverId === view && g.occasion === filterOccasion && g.status !== "Idea").reduce((s: number, g: Gift) => s + (parseFloat(g.price) || 0), 0);

        return {budget, spent, pct: Math.min((spent / budget) * 100, 100)};
    })();

    const nextBirthday = upcoming[0] ? daysUntil(upcoming[0].birthday) : "—";

    const tabs = [
        {id: "gifts", label: "🎁 Gifts", short: "🎁", count: gifts.length},
        {id: "christmas", label: "🎄 Christmas", short: "🎄", count: (state.christmasList || []).length},
        {id: "birthday", label: "🎂 Birthdays", short: "🎂", count: (state.birthdayList || []).length},
    ];

    return (
        <div className="font-sans text-[#2D1810] bg-[linear-gradient(180deg,#FBF7F0_0%,#F5EDE0_100%)] min-h-svh">
            {/* Header */}
            <header className="bg-[linear-gradient(135deg,#2D1810,#4A2C1A)] px-[16px] md:px-[20px] py-[14px] md:py-[22px] !pb-0 relative overflow-hidden">
                <div className="relative w-full">
                    <div className="flex justify-between items-center pb-[12px] gap-[8px]">
                        <div className="min-w-0">
                            <h1 className="font-fraunces text-[22px] md:text-[26px] font-extrabold text-white m-0 tracking-[-0.5px]">
                                🎁 Gift Tracker
                            </h1>

                            {!isMobile && (
                                <p className="text-[rgba(255,255,255,0.6)] text-[12px] mt-[3px]">
                                    Keep every gift idea organised
                                </p>
                            )}
                        </div>

                        <div className="flex gap-[6px]">
                            <Button
                                small
                                variant="secondary"
                                className="bg-[rgba(255,255,255,0.1)] text-white border-[rgba(255,255,255,0.2)]"
                                onClick={() => setReceiverModal(null)}
                            >
                                + Person
                            </Button>

                            {tab === "gifts" && !isMobile && (
                                <Button
                                    small
                                    variant="secondary"
                                    className="bg-[rgba(255,255,255,0.1)] text-white border-[rgba(255,255,255,0.2)]"
                                    onClick={() => setBudgetModal(true)}
                                >
                                    💰
                                </Button>
                            )}

                            {tab === "gifts" && (
                                <Button
                                    small
                                    onClick={() => {
                                        setGiftDefaults(null);
                                        setGiftModal(null);
                                    }}
                                >
                                    + Gift
                                </Button>
                            )}

                            {tab === "gifts" && isMobile && (
                                <Button
                                    small
                                    variant="secondary"
                                    className="bg-[rgba(255,255,255,0.1)] text-white border-[rgba(255,255,255,0.2)]"
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                >
                                    ☰
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Tabs */}
                    <div style={{display: "flex", gap: 0, overflowX: "auto", WebkitOverflowScrolling: "touch"}}>
                        {tabs.map(t => (
                            <button
                                key={t.id}
                                className={clsx(
                                    "font-sans cursor-pointer whitespace-nowrap transition-all duration-200 shrink-0 py-[10px] px-[14px] md:px-[20px] border-none rounded-t-[10px] text-[12px] font-semibold",
                                    tab === t.id ? "bg-[#FBF7F0] text-[#2D1810]" : "bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.6)]"
                                )}
                                onClick={() => {
                                    setTab(t.id);
                                    setSidebarOpen(false);
                                }}
                            >
                                {isMobile ? t.short : t.label}

                                <span
                                    className={clsx(
                                        "ml-[6px] py-[1px] px-[4px] rounded-[10px] text-[10px]",
                                        tab === t.id ? "bg-[#EDE5D8] text-[#5D4E37]" : "bg-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.5)]"
                                    )}
                                >
                                    {t.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Body */}
            <div className="py-[14px] px-[10px] md:py-[18px] md:px-[16px]">
                {tab === "christmas" && (
                    <OccasionListView
                        occasion="Christmas"
                        listKey="christmasList"
                        accentGradient="linear-gradient(135deg, #1B5E20, #2E7D32, #1B5E20)"
                        accentColor="#4CAF50"
                        icon="🎄"
                        headerTitle={`Christmas ${new Date().getFullYear()}`}
                        headerSubtitle={daysUntilChristmas() === 0 ? "Merry Christmas!" : `${daysUntilChristmas()} days to go`}
                        emptyIcon="🎅" emptyTitle="Christmas list is empty"
                        countdownLabel="Days Left"
                        countdownDays={daysUntilChristmas().toString()}
                        onStatusChange={handleStatusChange}
                        onOpenGiftModal={rid => openGiftModalFor(rid, "Christmas")}
                        onAddPerson={() => setReceiverModal(null)}
                        onEditGift={g => {
                            setGiftDefaults({defaultOccasion: "Christmas"});
                            setGiftModal(g);
                        }}
                        onDeleteGift={id => {
                            if (confirm("Delete?")) dispatch({type: "DELETE_GIFT", payload: id});
                        }}
                    />
                )}

                {tab === "birthday" && (
                    <OccasionListView
                        occasion="Birthday"
                        listKey="birthdayList"
                        accentGradient="linear-gradient(135deg, #880E4F, #AD1457, #C2185B)"
                        accentColor="#E91E63"
                        icon="🎂"
                        headerTitle="Birthday Tracker"
                        headerSubtitle={upcoming[0] ? `Next: ${upcoming[0].emoji} ${upcoming[0].name} in ${daysUntil(upcoming[0].birthday)}d` : "No birthdays tracked yet"}
                        emptyIcon="🎈" emptyTitle="Birthday list is empty"
                        countdownLabel="Next In"
                        countdownDays={nextBirthday === Infinity ? "—" : `${nextBirthday}d`}
                        onStatusChange={handleStatusChange}
                        onOpenGiftModal={rid => openGiftModalFor(rid, "Birthday")}
                        onAddPerson={() => setReceiverModal(null)}
                        onEditGift={g => {
                            setGiftDefaults({defaultOccasion: "Birthday"});
                            setGiftModal(g);
                        }}
                        onDeleteGift={id => {
                            if (confirm("Delete?")) dispatch({type: "DELETE_GIFT", payload: id});
                        }}
                    />
                )}

                {tab === "gifts" && (
                    <div style={{display: "flex", gap: 16, flexDirection: isMobile ? "column" : "row"}}>
                        {/* Mobile sidebar overlay */}
                        {isMobile && sidebarOpen && (
                            <div onClick={() => setSidebarOpen(false)} style={{
                                position: "fixed",
                                inset: 0,
                                background: "rgba(30,20,10,0.3)",
                                zIndex: 500,
                                animation: "fadeIn .15s ease"
                            }}>
                                <div onClick={e => e.stopPropagation()} style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    width: 280,
                                    background: "#FBF7F0",
                                    padding: "16px 14px",
                                    overflowY: "auto",
                                    boxShadow: "4px 0 20px rgba(0,0,0,0.1)"
                                }}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: 12
                                    }}>
                                        <span style={{
                                            fontFamily: "'Fraunces', serif",
                                            fontSize: 18,
                                            fontWeight: 700,
                                            color: "#2D1810"
                                        }}>People</span>
                                        <button onClick={() => setSidebarOpen(false)} style={{
                                            background: "none",
                                            border: "none",
                                            fontSize: 18,
                                            cursor: "pointer",
                                            color: "#8B7355"
                                        }}>✕
                                        </button>
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

                        {/* Desktop sidebar */}
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

                        {/* Main gifts list */}
                        <div style={{flex: 1, minWidth: 0}}>
                            {/* Mobile: show selected person pill */}
                            {isMobile && view !== "all" && (() => {
                                const r = receivers.find((x: Receiver) => x.id === view);
                                return r ? <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    marginBottom: 10,
                                    padding: "6px 10px",
                                    background: "#FFF8E1",
                                    borderRadius: 20,
                                    border: "1.5px solid #DAA520",
                                    width: "fit-content",
                                    fontSize: 12,
                                    fontWeight: 600
                                }}>
                                    {r.emoji} {r.name}
                                    <button onClick={() => setView("all")} style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        fontSize: 12,
                                        color: "#8B7355",
                                        marginLeft: 4
                                    }}>✕
                                    </button>
                                </div> : null;
                            })()}

                            {/* Filters */}
                            <div style={{display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap"}}>
                                <input type="text" placeholder="Search..." value={search}
                                       onChange={e => setSearch(e.target.value)}
                                       style={{
                                           flex: 1,
                                           minWidth: isMobile ? 100 : 120,
                                           padding: "7px 10px",
                                           border: "1.5px solid #D4C4AE",
                                           borderRadius: 10,
                                           fontSize: 12,
                                           fontFamily: "'DM Sans', sans-serif",
                                           background: "#FFF",
                                           outline: "none"
                                       }}/>
                                <select value={filterOccasion} onChange={e => setFilterOccasion(e.target.value)}
                                        style={{
                                            padding: "7px 8px",
                                            border: "1.5px solid #D4C4AE",
                                            borderRadius: 10,
                                            fontSize: 11,
                                            fontFamily: "'DM Sans', sans-serif",
                                            background: "#FFF"
                                        }}>
                                    <option value="All">All Occasions</option>
                                    {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                </select>
                                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                                        style={{
                                            padding: "7px 8px",
                                            border: "1.5px solid #D4C4AE",
                                            borderRadius: 10,
                                            fontSize: 11,
                                            fontFamily: "'DM Sans', sans-serif",
                                            background: "#FFF"
                                        }}>
                                    <option value="All">All Status</option>
                                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                {isMobile &&
                                    <Button variant="secondary" small onClick={() => setBudgetModal(true)}>💰</Button>}
                            </div>

                            {budgetInfo && (
                                <div style={{
                                    marginBottom: 12,
                                    padding: "10px 14px",
                                    background: "#FFF",
                                    borderRadius: 10,
                                    border: "1px solid #EDE5D8"
                                }}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontSize: 11,
                                        marginBottom: 4
                                    }}>
                                        <span style={{color: "#8B7355"}}>Budget</span>
                                        <span style={{
                                            fontWeight: 600,
                                            color: budgetInfo.spent > budgetInfo.budget ? "#C62828" : "#2D1810"
                                        }}>${budgetInfo.spent.toFixed(2)} / ${budgetInfo.budget.toFixed(2)}</span>
                                    </div>
                                    <div
                                        style={{height: 5, background: "#EDE5D8", borderRadius: 3, overflow: "hidden"}}>
                                        <div style={{
                                            height: "100%",
                                            width: `${budgetInfo.pct}%`,
                                            background: budgetInfo.spent > budgetInfo.budget ? "#EF5350" : "linear-gradient(90deg, #B8860B, #DAA520)",
                                            borderRadius: 3,
                                            transition: "width .3s"
                                        }}/>
                                    </div>
                                </div>
                            )}

                            {filteredGifts.length === 0 ? (
                                <div style={{textAlign: "center", padding: "50px 16px", color: "#8B7355"}}>
                                    <div style={{fontSize: 44, marginBottom: 10}}>🎀</div>
                                    <div style={{
                                        fontFamily: "'Fraunces', serif",
                                        fontSize: 17,
                                        fontWeight: 600,
                                        marginBottom: 6,
                                        color: "#2D1810"
                                    }}>{gifts.length === 0 ? "No gifts yet" : "No matches"}</div>
                                    <p style={{fontSize: 12, lineHeight: 1.5, maxWidth: 260, margin: "0 auto"}}>
                                        {receivers.length === 0 ? "Add someone to get started!" : "Try adjusting your filters or add a new gift."}
                                    </p>
                                    <div style={{
                                        display: "flex",
                                        gap: 8,
                                        justifyContent: "center",
                                        marginTop: 12,
                                        flexWrap: "wrap"
                                    }}>
                                        {receivers.length === 0 &&
                                            <Button small onClick={() => setReceiverModal(null)}>+ Add Person</Button>}
                                        {receivers.length > 0 && <Button small onClick={() => {
                                            setGiftDefaults(null);
                                            setGiftModal(null);
                                        }}>+ Add Gift</Button>}
                                    </div>
                                </div>
                            ) : (
                                <div style={{display: "flex", flexDirection: "column", gap: 6}}>
                                    {filteredGifts.map((g: Gift) => (
                                        <GiftCard
                                            key={g.id}
                                            gift={g}
                                            receiver={receivers.find((r: Receiver) => r.id === g.receiverId)}
                                            onEdit={gift => {
                                                setGiftDefaults(null);
                                                setGiftModal(gift);
                                            }}
                                            onDelete={id => {
                                                if (confirm("Delete?")) dispatch({
                                                    type: "DELETE_GIFT",
                                                    payload: id
                                                });
                                            }}
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
                open={receiverModal !== null}
                initial={receiverModal?.id ? receiverModal : null}
                onSave={handleSaveReceiver}
                onClose={() => setReceiverModal(null)}
            />

            <GiftModal
                receivers={receivers}
                open={giftModal !== null}
                initial={giftModal?.id ? giftModal : null}
                onClose={() => {
                    setGiftModal(null);
                    setGiftDefaults(null);
                }}
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
        </div>
    );
}
