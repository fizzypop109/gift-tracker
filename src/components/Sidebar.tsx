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
                <span className="text-[11px] font-bold uppercase tracking-[0.8px] text-brown-muted">
                    People
                </span>
                <button
                    className="size-[24px] rounded-[8px] border-[1.5px] border-tan bg-white cursor-pointer text-[13px] flex items-center justify-center font-bold text-gold"
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
                        "flex font-sans cursor-pointer w-full text-left text-[13px] font-[600] text-brown items-center gap-[8px] px-[9px] py-[12px] rounded-[10px]",
                        view === "all" ? "border-2 border-gold bg-gold-tint" : "border-[1.5px] border-cream-border bg-white",
                    )}
                >
                    📋 All Gifts
                    <span className="ml-auto text-[11px] text-brown-muted">
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
                                view === r.id ? "border-2 border-gold bg-gold-tint" : "border-[1.5px] border-cream-border bg-white",
                            )}
                        >
                            <span className="text-[20px]">{r.emoji}</span>
                            <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-semibold text-brown truncate">{r.name}</div>
                                <div className="text-[10px] text-brown-muted">
                                    {gifts.filter(g => g.receiverId === r.id).length} gifts{r.birthday ? ` · ${formatDate(r.birthday)}` : ""}
                                </div>
                            </div>
                        </button>

                        {view === r.id && (
                            <div className="flex gap-[4px] mt-[3px] pl-[40px]">
                                <button
                                    onClick={() => setReceiverModal({ open: true, initial: r })}
                                    className="text-[10px] bg-transparent border-none underline text-brown-muted cursor-pointer"
                                >
                                    Edit
                                </button>
                                <button
                                    className="text-[10px] bg-transparent border-none underline text-danger cursor-pointer"
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
            <div className="mt-4 bg-white rounded-[10px] border border-cream-border p-3">
                <span className="text-[10px] font-bold uppercase tracking-[0.8px] text-brown-muted mb-2 block">
                    Overview
                </span>
                {[
                    { l: "Total Spent", v: `$${totalSpent.toFixed(2)}`, c: "text-gold" },
                    { l: "Ideas", v: gifts.filter(g => g.status === "Idea").length, c: "text-idea-dot" },
                    { l: "Purchased", v: gifts.filter(g => g.status === "Purchased").length, c: "text-purchased" },
                ].map(s => (
                    <div key={s.l} className="flex justify-between py-[5px] border-b border-cream-warm">
                        <span className="text-[11px] text-brown-muted">{s.l}</span>
                        <span className={clsx("text-[15px] font-bold font-fraunces", s.c)}>{s.v}</span>
                    </div>
                ))}
            </div>

            {/* Upcoming birthdays */}
            {upcoming.length > 0 && (
                <div className="mt-[14px]">
                    <span className="text-[10px] font-bold uppercase tracking-[0.8px] text-brown-muted block mb-[6px]">
                        Upcoming
                    </span>
                    {upcoming.map(r => (
                        <div
                            key={r.id}
                            className={clsx(
                                "px-[9px] py-[7px] rounded-lg border border-cream-border mb-[5px] text-[11px]",
                                daysUntil(r.birthday) <= 14 ? "bg-idea-bg" : "bg-white"
                            )}
                        >
                            <span className="font-semibold">{r.emoji} {r.name}</span>
                            <div className={clsx(
                                "mt-px",
                                daysUntil(r.birthday) <= 14 ? "text-idea-text" : "text-brown-muted"
                            )}>
                                {formatDate(r.birthday)} · {daysUntil(r.birthday)}d away
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
