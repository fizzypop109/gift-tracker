import {Button} from "@/components/Button";
import clsx from "clsx";
import {Dispatch, SetStateAction} from "react";
import {Gift, GiftDefault, ModalState, Receiver, Tab} from "@/types";

type HeaderProps = {
    tabs: Tab[];
    selectedTab: string;
    onTabClick: (id: string) => void;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    setReceiverModal: Dispatch<SetStateAction<ModalState<Receiver>>>
    setGiftModal: Dispatch<SetStateAction<ModalState<Gift>>>
    setBudgetModal: (open: boolean) => void;
    setGiftDefaults: Dispatch<SetStateAction<GiftDefault | null>>
}

export const Header = ({ selectedTab, tabs, onTabClick, sidebarOpen, setSidebarOpen, setReceiverModal, setGiftModal, setBudgetModal, setGiftDefaults }: HeaderProps) => {
    return (
        <header className="bg-[linear-gradient(135deg,#2D1810,#4A2C1A)] px-4 md:px-5 pt-3.5 md:pt-5 relative overflow-hidden">
            <div className="relative w-full">
                <div className="flex justify-between items-center pb-3 gap-2">
                    <div className="min-w-0">
                        <h1 className="font-fraunces text-[22px] md:text-[26px] font-extrabold text-white m-0 tracking-tight">
                            🎁 Gift Tracker
                        </h1>

                        <p className="text-white/60 text-xs mt-0.5 hidden md:block">
                            Keep every gift idea organised
                        </p>
                    </div>

                    <div className="flex gap-1.5">
                        <Button
                            small
                            variant="secondary"
                            className="!bg-white/10 !text-white !border-white/20"
                            onClick={() => setReceiverModal({ open: true, initial: null })}
                        >
                            + Person
                        </Button>

                        {selectedTab === "gifts" && (
                            <Button
                                small
                                variant="secondary"
                                className="hidden md:block !bg-white/10 !text-white !border-white/20"
                                onClick={() => setBudgetModal(true)}
                            >
                                💰
                            </Button>
                        )}

                        {selectedTab === "gifts" && (
                            <Button
                                small
                                onClick={() => {
                                    setGiftDefaults(null);
                                    setGiftModal({ open: true, initial: null });
                                }}
                            >
                                + Gift
                            </Button>
                        )}

                        {selectedTab === "gifts" && (
                            <Button
                                small
                                variant="secondary"
                                className="hidden md:block !bg-white/10 !text-white !border-white/20"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                            >
                                ☰
                            </Button>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            className={clsx(
                                "font-sans cursor-pointer whitespace-nowrap transition-all duration-200 shrink-0 py-2.5 px-3.5 md:px-5 border-none rounded-t-[10px] text-xs font-semibold",
                                selectedTab === t.id
                                    ? "bg-[#FBF7F0] text-[#2D1810]"
                                    : "bg-white/5 text-white/60"
                            )}
                            onClick={() => onTabClick(t.id)}
                        >
                            <span className="md:hidden">{t.short}</span>

                            <span className="hidden md:inline">{t.label}</span>

                            <span
                                className={clsx(
                                    "ml-1.5 py-px px-1 rounded-[10px] text-[10px]",
                                    selectedTab === t.id
                                        ? "bg-[#EDE5D8] text-[#5D4E37]"
                                        : "bg-white/10 text-white/50"
                                )}
                            >
                                    {t.count}
                                </span>
                        </button>
                    ))}
                </div>
            </div>
        </header>
    )
}