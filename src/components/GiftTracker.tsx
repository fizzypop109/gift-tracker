import {useState} from "react";
import {
    ReceiverModal, GiftModal, BudgetModal, OccasionListView, Header, OccasionModal, HomeView,
    AllGiftsView, PersonModal
} from "@/components";
import {useApp} from "@/hooks";
import {daysUntil, getNextOccasionDate} from "@/utils";
import {Gift, GiftDefault, ModalState, OccasionConfig, Receiver, Status} from "@/types";

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
    const { state, dispatch } = useApp();
    const {receivers, budgets, occasions} = state;

    const [tab, setTab] = useState("home");
    const [view, setView] = useState("all");
    const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
    const [receiverModal, setReceiverModal] = useState<ModalState<Receiver>>({open: false});
    const [giftModal, setGiftModal] = useState<ModalState<Gift>>({open: false});
    const [giftDefaults, setGiftDefaults] = useState<GiftDefault | null>(null);
    const [budgetModal, setBudgetModal] = useState(false);
    const [occasionModal, setOccasionModal] = useState<ModalState<OccasionConfig>>({open: false});

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

    const occasionLabels = occasions.map(o => o.label);

    const selectedReceiver = view !== "all" ? receivers.find((x: Receiver) => x.id === view) : null;

    const handleTabClick = (id: string) => {
        if (id === "_add") {
            setOccasionModal({open: true, initial: null});
        } else {
            setTab(id);
        }
    };

    return (
        <div className="w-full flex flex-col overflow-hidden font-sans text-brown bg-[linear-gradient(180deg,var(--color-cream)_0%,var(--color-cream-warm)_100%)] h-svh">
            <Header
                selectedTab={tab}
                onTabClick={handleTabClick}
            />

            <div className="py-3.5 px-2.5 md:py-4.5 md:px-4 flex-1 overflow-y-scroll">
                {/* Home Tab */}
                {tab === "home" && !selectedPerson && (
                    <HomeView
                        onNavigate={setTab}
                        onSelectPerson={setSelectedPerson}
                        onAddPerson={() => setReceiverModal({open: true, initial: null})}
                    />
                )}

                {/* Gifts Tab */}
                {tab === "gifts" && !selectedPerson && (
                    <AllGiftsView
                        view={view}
                        setView={setView}
                        setBudgetModal={setBudgetModal}
                        setGiftDefaults={setGiftDefaults}
                        setGiftModal={setGiftModal}
                        setReceiverModal={setReceiverModal}
                        handleStatusChange={handleStatusChange}
                        occasionLabels={occasionLabels}
                        selectedReceiver={selectedReceiver}
                    />
                )}

                {/* Dynamic occasion tabs */}
                {tab !== "gifts" && tab !== "_add" && tab !== "home" && !selectedPerson && (() => {
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
            </div>

            {/* Modals */}

            <PersonModal
                open={selectedPerson !== null}
                selectedPerson={selectedPerson}
                onStatusChange={handleStatusChange}
                setReceiverModal={setReceiverModal}
                onClose={() => setSelectedPerson(null)}
                onEditGift={g => { setGiftDefaults(null); setGiftModal({open: true, initial: g}); }}
                onDeleteGift={id => { if (confirm("Delete?")) dispatch({type: "DELETE_GIFT", payload: id}); }}
                onAddGift={(rid, occasion) => openGiftModalFor(rid, occasion || "")}
            />

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
