import {useState} from "react";
import {Button, ListManageModal, BudgetModal} from "@/components";
import {daysUntil, STATUS_COLORS} from "@/utils";
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
    const readyCount = occasionGifts.filter(g => listReceivers.some(r => r.id === g.receiverId) && (g.status === "Wrapped" || g.status === "Given")).length;

    return (
        <div>
            {/* Themed header */}
            <div style={{ background: config.accentGradient, borderRadius: isMobile ? 12 : 16, padding: isMobile ? "18px 16px 14px" : "22px 22px 18px", marginBottom: 16, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 15% 85%, rgba(255,215,0,0.1) 0%, transparent 50%), radial-gradient(circle at 85% 15%, rgba(255,255,255,0.06) 0%, transparent 50%)" }} />

                <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 8, flexWrap: "wrap" }}>
                        <div>
                            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: isMobile ? 20 : 24, fontWeight: 800, color: "#FFF", margin: 0 }}>
                                {config.icon} {config.label}
                            </h2>

                            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, margin: "3px 0 0" }}>
                                {headerSubtitle}
                            </p>
                        </div>

                        <div style={{ display: "flex", gap: 6 }}>
                            <Button variant="secondary" small onClick={() => setBudgetOpen(true)} style={{ background: "rgba(255,255,255,0.12)", color: "#FFF", border: "1px solid rgba(255,255,255,0.2)" }}>💰</Button>
                            <Button variant="secondary" small onClick={() => setManageOpen(true)} style={{ background: "rgba(255,255,255,0.12)", color: "#FFF", border: "1px solid rgba(255,255,255,0.2)" }}>👥 Manage</Button>
                            <Button variant="secondary" small onClick={onEditOccasion} style={{ background: "rgba(255,255,255,0.12)", color: "#FFF", border: "1px solid rgba(255,255,255,0.2)" }}>✏️</Button>
                            <Button variant="secondary" small onClick={onDeleteOccasion} style={{ background: "rgba(255,255,255,0.12)", color: "#FFF", border: "1px solid rgba(255,255,255,0.2)" }}>🗑</Button>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: 8 }}>
                        {[
                            { label: "People", value: listReceivers.length, color: "#FFF" },
                            { label: "Gifts", value: `${readyCount}/${totalGiftsCount}`, color: "#A5D6A7" },
                            { label: "Spent", value: `$${totalSpent.toFixed(0)}`, sub: totalBudget ? `/$${totalBudget.toFixed(0)}` : "", color: "#FFD54F" },
                            { label: countdownLabel, value: countdownDays, color: "#EF9A9A" },
                        ].map(s => (
                            <div key={s.label} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, padding: isMobile ? "8px 10px" : "8px 12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 0.4 }}>{s.label}</div>
                                <div style={{ fontFamily: "'Fraunces', serif", fontSize: isMobile ? 17 : 19, fontWeight: 700, color: s.color, marginTop: 1 }}>
                                    {s.value}{s.sub && <span style={{ fontSize: 10, fontWeight: 400, opacity: 0.6 }}>{s.sub}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Person accordion */}
            {sortedReceivers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "50px 20px", color: "#8B7355" }}>
                    <div style={{ fontSize: 44, marginBottom: 10 }}>{config.icon}</div>
                    <div style={{ fontFamily: "'Fraunces', serif", fontSize: 17, fontWeight: 600, marginBottom: 6, color: "#2D1810" }}>{config.label} list is empty</div>
                    <p style={{ fontSize: 12, lineHeight: 1.5, maxWidth: 280, margin: "0 auto 14px" }}>
                        {receivers.length === 0 ? "Add someone to get started!" : "Add people to this list to start tracking."}
                    </p>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                        {receivers.length === 0 && <Button small onClick={onAddPerson}>+ Add Person</Button>}
                        {receivers.length > 0 && <Button small onClick={() => setManageOpen(true)}>👥 Manage List</Button>}
                    </div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {sortedReceivers.map(r => {
                        const pg = occasionGifts.filter(g => g.receiverId === r.id);
                        const spent = pg.filter(g => g.status !== "Idea").reduce((s, g) => s + (parseFloat(g.price) || 0), 0);
                        const budget = budgets[`${r.id}:${config.label}`] || 0;
                        const isExpanded = expanded === r.id;
                        const bdayInfo = config.id === "birthday" && r.birthday ? `${daysUntil(r.birthday)} day${daysUntil(r.birthday) !== 1 ? "s" : ""} away` : null;

                        return (
                            <div key={r.id} style={{ background: "#FFF", borderRadius: 12, border: "1px solid #EDE5D8", overflow: "hidden" }}>
                                <button onClick={() => setExpanded(isExpanded ? null : r.id)}
                                        style={{ display: "flex", alignItems: "center", width: "100%", padding: isMobile ? "12px" : "14px 16px", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left", gap: 10 }}>
                                    <span style={{ fontSize: isMobile ? 24 : 26 }}>{r.emoji}</span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: isMobile ? 14 : 15, color: "#2D1810" }}>{r.name}</div>
                                        <div style={{ fontSize: 11, color: "#8B7355", marginTop: 1 }}>
                                            {pg.length} gift{pg.length !== 1 ? "s" : ""}
                                            {budget > 0 && ` · $${spent.toFixed(0)}/$${budget.toFixed(0)}`}
                                            {bdayInfo && ` · ${bdayInfo}`}
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: 3, marginRight: 8, flexShrink: 0 }}>
                                        {pg.slice(0, 8).map(g => <span key={g.id} style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_COLORS[g.status]?.dot }} />)}
                                        {pg.length === 0 && <span style={{ fontSize: 10, color: "#ccc" }}>—</span>}
                                    </div>
                                    <span style={{ fontSize: 12, color: "#8B7355", transition: "transform .2s", transform: isExpanded ? "rotate(180deg)" : "none", flexShrink: 0 }}>▼</span>
                                </button>
                                {budget > 0 && <div style={{ padding: "0 16px 6px" }}><div style={{ height: 3, background: "#EDE5D8", borderRadius: 2, overflow: "hidden" }}><div style={{ height: "100%", width: `${Math.min((spent / budget) * 100, 100)}%`, background: spent > budget ? "#EF5350" : config.accentColor, borderRadius: 2, transition: "width .3s" }} /></div></div>}
                                {isExpanded && (
                                    <div style={{ padding: isMobile ? "8px 12px 14px" : "8px 16px 14px", borderTop: "1px solid #F0E8DB" }}>
                                        {pg.length === 0 ? <div style={{ textAlign: "center", padding: "12px 0", color: "#8B7355", fontSize: 12 }}>No gifts yet</div>
                                            : <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>{pg.map(g => <GiftCard key={g.id} gift={g} receiver={r} onEdit={onEditGift} onDelete={onDeleteGift} onStatusChange={onStatusChange} compact isMobile={isMobile} />)}</div>}
                                        <Button small onClick={() => onOpenGiftModal(r.id)} style={{ width: "100%", textAlign: "center" }}>+ Add Gift for {r.name}</Button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {/* Quick add person */}
                    <button onClick={onAddPerson}
                            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: isMobile ? "14px" : "16px", borderRadius: 12, border: "2px dashed #D4C4AE", background: "transparent", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#8B7355", transition: "all .15s", width: "100%" }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = config.accentColor; e.currentTarget.style.color = config.accentColor; e.currentTarget.style.background = `${config.accentColor}08`; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#D4C4AE"; e.currentTarget.style.color = "#8B7355"; e.currentTarget.style.background = "transparent"; }}>
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