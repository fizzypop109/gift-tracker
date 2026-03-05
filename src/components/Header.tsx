import clsx from "clsx";
import { Tab} from "@/types";
import {useApp} from "@/hooks";

type HeaderProps = {
    selectedTab: string;
    onTabClick: (id: string) => void;
}

export const Header = ({ selectedTab, onTabClick }: HeaderProps) => {
    const { state } = useApp();
    const { gifts, occasions } = state;

    const occasionTabs = occasions.map(o => ({
        id: o.id,
        label: `${o.icon} ${o.label}`,
        short: o.icon,
        count: (state.lists[o.id] || []).length,
    }));

    const tabs: Tab[] = [
        {id: "home", label: "🏠 Home", short: "🏠"},
        {id: "gifts", label: "🎁 Gifts", short: "🎁", count: gifts.length},
        ...occasionTabs,
        {id: "_add", label: "+ Event", short: "+"},
    ];

    return (
        <header className="bg-[linear-gradient(135deg,var(--color-brown),var(--color-brown-deep))] px-4 md:px-5 pt-3.5 md:pt-5 relative overflow-hidden">
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
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto no-scrollbar">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            className={clsx(
                                "font-sans cursor-pointer whitespace-nowrap transition-all duration-200 shrink-0 py-2.5 px-3.5 md:px-5 border-none rounded-t-[10px] text-xs font-semibold",
                                selectedTab === t.id
                                    ? "bg-cream text-brown"
                                    : "bg-white/5 text-white/60"
                            )}
                            onClick={() => onTabClick(t.id)}
                        >
                            <span className="md:hidden">
                                {t.short}
                            </span>

                            <span className="hidden md:inline">
                                {t.label}
                            </span>

                            {t.count !== undefined && (
                                <span
                                    className={clsx(
                                        "ml-1.5 py-px px-1 rounded-[10px] text-[10px]",
                                        selectedTab === t.id
                                            ? "bg-cream-border text-brown-mid"
                                            : "bg-white/10 text-white/50"
                                    )}
                                >
                                    {t.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
}
