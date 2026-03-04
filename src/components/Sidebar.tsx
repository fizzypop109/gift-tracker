import clsx from "clsx";
import {useIsMobile, useApp} from "@/hooks";
import {daysUntil, formatDate} from "@/utils";
import {Receiver, Gift, ModalState} from "@/types";
import {Dispatch, SetStateAction} from "react";

type SidebarProps = {
    setSidebarOpen: (open: boolean) => void;
    setReceiverModal: Dispatch<SetStateAction<ModalState<Receiver>>>;
    view: string;
    setView: (view: string) => void;
    receivers: Receiver[];
    gifts: Gift[];
    upcoming: Receiver[];
}

export const Sidebar = ({ setSidebarOpen, setReceiverModal, view, setView, receivers, gifts, upcoming }: SidebarProps) => {
    const isMobile = useIsMobile();

    const { dispatch } = useApp();

    const totalSpent = gifts.filter(g => g.status !== "Idea").reduce((s, g) => s + (parseFloat(g.price) || 0), 0);

    return (
        <div className="w-[250px]">
            <div className="flex justify-between items-center mb-[10px]">
                <span className="text-[11px] font-bold uppercase tracking-[0.8px] text-[#8B7355]">
                    People
                </span>

                <button
                    className="size-[24px] rounded-[8px] border-[1.5px] border-[#D4C4AE] bg-[#FFF] cursor-pointer text-[13px] flex items-center justify-center font-bold text-[#B8860B]"
                    onClick={() => setReceiverModal({ open: true, initial: null })}
                >
                    +
                </button>
            </div>

            <div className="flex flex-col gap-[5px]">
                <button
                    onClick={() => {
                        setView("all");
                        if (isMobile) setSidebarOpen(false);
                    }}
                    className={clsx(
                        "flex font-sans cursor-pointer w-full text-left text-[13px] font-[600] text-[#2D1810] items-center gap-[8px] px-[9px] py-[12px] rounded-[10px]",
                        view === "all" ? "border-[2px] border-[#B8860B] bg-[#FFF8E1]" : "border-[1.5px] border-[#EDE5D8] bg-[#FFF]",
                    )}
                >
                    📋 All Gifts

                    <span className="ml-auto text-[11px] text-[#8B7355]">
                        {gifts.length}
                    </span>
                </button>

                {receivers.map(r => (
                    <div key={r.id}>
                        <button
                            onClick={() => {
                                setView(r.id);
                                if (isMobile) setSidebarOpen(false);
                            }}
                            className={clsx(
                                "flex font-sans items-center gap-[8px] px-[9px] py-[12px] rounded-[10px] w-full text-left cursor-pointer",
                                view === r.id ? "border-2 border-[#B8860B] bg-[#FFF8E1]" : "border-[1.5px] border-[#EDE5D8] bg-[#FFF]",
                            )}
                        >
                            <span className="text-[20px]">
                                {r.emoji}
                            </span>

                            <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-semibold text-[#2D1810] truncate">
                                    {r.name}
                                </div>

                                <div className="text-[10px] text-[#8B7355]">
                                    {gifts.filter(g => g.receiverId === r.id).length} gifts{r.birthday ? ` · ${formatDate(r.birthday)}` : ""}
                                </div>
                            </div>
                        </button>

                        {view === r.id && (
                            <div className="flex gap-[4px] mt-[3px] pl-[40px]">
                                <button
                                    onClick={() => setReceiverModal({ open: true, initial: r })}
                                    className="text-[10px] bg-none border-none underline text-[#8B7355] cursor-pointer"
                                >
                                    Edit
                                </button>

                                <button
                                    className="text-[10px] bg-none border-none underline text-[#C62828] cursor-pointer"
                                    onClick={() => {
                                        if (confirm(`Remove ${r.name}?`)) {
                                            dispatch({type: "DELETE_RECEIVER", payload: r.id});
                                            setView("all");
                                        }
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Stats card */}
            <div className="mt-[16px] bg-white rounded-[10px] border-1 border-[#EDE5D8] p-[12px]">
                <span className="text-[10px] font-bold uppercase tracking-[0.8px] text-[#8B7355] mb-[8px] block">
                    Overview
                </span>

                {[
                    {l: "Total Spent", v: `$${totalSpent.toFixed(2)}`, c: "#B8860B"},
                    {l: "Ideas", v: gifts.filter(g => g.status === "Idea").length, c: "#FF9800"},
                    {
                        l: "Purchased",
                        v: gifts.filter(g => g.status === "Purchased" || g.status === "Wrapped").length,
                        c: "#4CAF50"
                    },
                    {l: "Given", v: gifts.filter(g => g.status === "Given").length, c: "#9C27B0"},
                ].map(s => <div key={s.l} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "5px 0",
                    borderBottom: "1px solid #F5EDE0"
                }}>

                    <span className="text-[11px] text-[#8B7355]">
                        {s.l}
                    </span>

                    <span
                        className="text-[15px] font-bold font-fraunces"
                        style={{ color: s.c }}
                    >
                        {s.v}
                    </span>
                </div>
                )}
            </div>

            {upcoming.length > 0 && <div style={{marginTop: 14}}>
                <span style={{
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    color: "#8B7355",
                    display: "block",
                    marginBottom: 6
                }}>
                    Upcoming
                </span>

                {upcoming.map(r => <div key={r.id} style={{
                    padding: "7px 9px",
                    borderRadius: 8,
                    background: daysUntil(r.birthday) <= 14 ? "#FFF3E0" : "#FFF",
                    border: "1px solid #EDE5D8",
                    marginBottom: 5,
                    fontSize: 11
                }}>
                    <span style={{fontWeight: 600}}>
                        {r.emoji} {r.name}
                    </span>

                    <div
                        className={clsx(
                            "mt-px",
                            daysUntil(r.birthday) <= 14 ? "text-[#E65100]" : "text-[#8B7355]"
                        )}
                    >
                        {formatDate(r.birthday)} · {daysUntil(r.birthday)}d away
                    </div>
                </div>)}
            </div>}
        </div>
    );
}