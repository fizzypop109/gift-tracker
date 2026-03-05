import {daysUntil, getNextOccasionDate} from "@/utils";
import {useIsMobile, useApp} from "@/hooks";
import clsx from "clsx";
import {Button, Collapsible} from "@/components";
import {UpcomingEvent} from "@/types";
import {EventCard} from "@/components/EventCard";

type HomeViewProps = {
    onNavigate: (tab: string) => void;
    onSelectPerson: (id: string) => void;
    onAddPerson: () => void;
}

export const HomeView = ({onNavigate, onAddPerson, onSelectPerson}: HomeViewProps) => {
    const {state} = useApp();
    const {receivers, gifts, occasions} = state;
    const isMobile = useIsMobile();

    const totalSpent = gifts
        .filter(g => g.status === "Purchased")
        .reduce((s, g) => s + (parseFloat(g.price) || 0), 0);
    const totalIdeas = gifts.filter(g => g.status === "Idea").length;
    const totalPurchased = gifts.filter(g => g.status === "Purchased").length;

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcomingBirthdays: UpcomingEvent[] = receivers
        .filter(r => r.birthday)
        .map(r => ({
            type: "birthday",
            label: r.name,
            original: r,
            days: daysUntil(r.birthday),
        }));

    const upcomingOccasions: UpcomingEvent[] = occasions
        .filter(o => o.date.type !== "per-person")
        .map(o => {
            const year = now.getFullYear();
            let next = getNextOccasionDate(o.date, year);
            if (next && next < now) next = getNextOccasionDate(o.date, year + 1);
            const days = next ? Math.ceil((next.getTime() - now.getTime()) / 86400000) : Infinity;
            const occasionGifts = gifts.filter(g => g.occasion === o.label);
            return {
                type: "occasion" as const,
                label: o.label,
                original: o,
                days,
                totalGifts: occasionGifts.length,
                purchased: occasionGifts.filter(g => g.status === "Purchased").length,
            };
        })
        .filter(o => o.days !== Infinity);

    // Personal events
    const upcomingPersonalEvents: UpcomingEvent[] = receivers.flatMap(r =>
        (r.personalEvents || []).map(e => ({
            type: "personal" as const,
            label: e.label,
            days: daysUntil(e.date),
            original: e,
            receiver: r,
        }))
    );

    const upcoming: UpcomingEvent[] = [...upcomingBirthdays, ...upcomingOccasions, ...upcomingPersonalEvents]
        .sort((a, b) => a.days - b.days)
        .slice(0, 6);

    const needsAttention = receivers.filter(r => {
        const pg = gifts.filter(g => g.receiverId === r.id);
        return pg.length > 0 && pg.every(g => g.status === "Idea");
    });

    const handleEventClick = (event: UpcomingEvent) => {
        if (event.type === "birthday") {
            onSelectPerson(event.original.id);
        } else if (event.type === "personal") {
            onSelectPerson(event.receiver.id);
        } else {
            onNavigate(event.original.id);
        }
    };

    const stats = [
        {label: "Total Spent", value: `$${totalSpent.toFixed(0)}`, icon: "💰", color: "text-gold"},
        {label: "Gift Ideas", value: totalIdeas, icon: "💡", color: "text-idea-dot"},
        {label: "Purchased", value: totalPurchased, icon: "✓", color: "text-purchased"},
        {label: "People", value: receivers.length, icon: "👥", color: "text-people"},
    ];

    return (
        <div className="flex flex-col gap-4">
            {/* Overview card: stats + next event */}
            <div className="bg-white rounded-xl border border-cream-border overflow-hidden">
                <div className={clsx("grid gap-px bg-cream-border", isMobile ? "grid-cols-2" : "grid-cols-4")}>
                    {stats.map(s => (
                        <div key={s.label} className="bg-white p-3.5">
                            <div className="text-[10px] uppercase tracking-wider text-brown-muted mb-1">{s.label}</div>
                            <div className={clsx("flex items-center gap-1.5 font-fraunces text-2xl font-bold", s.color)}>
                                <span className="text-base">{s.icon}</span>{s.value}
                            </div>
                        </div>
                    ))}
                </div>

                {upcoming.length > 0 && (
                    <div className="border-t border-cream-border p-3.5">
                        <div className="text-[10px] uppercase tracking-wider text-brown-muted mb-2">Next Event</div>
                        <EventCard
                            event={upcoming[0]}
                            gifts={gifts}
                            onClick={() => handleEventClick(upcoming[0])}
                            featured
                        />
                    </div>
                )}
            </div>

            {/* People */}
            {receivers.length > 0 && (
                <Collapsible
                    title="People"
                    count={receivers.length}
                    action={{label: "+ Add", onClick: onAddPerson}}
                >
                    <div className={clsx("grid gap-2", isMobile ? "grid-cols-2" : "grid-cols-3")}>
                        {receivers.map(r => (
                            <button
                                key={r.id}
                                onClick={() => onSelectPerson(r.id)}
                                className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-cream-border cursor-pointer text-left font-sans transition-all hover:shadow-sm w-full"
                            >
                                <span className="text-2xl">{r.emoji}</span>
                                <div className="text-sm font-semibold text-brown truncate">{r.name}</div>
                            </button>
                        ))}
                    </div>
                </Collapsible>
            )}

            {/* Upcoming Events */}
            {upcoming.length > 1 && (
                <Collapsible title="Upcoming" count={upcoming.length - 1}>
                    <div className={clsx("grid gap-2.5", isMobile ? "grid-cols-1" : "grid-cols-2")}>
                        {upcoming.slice(1).map(event => (
                            <EventCard
                                key={event.original.id}
                                event={event}
                                gifts={gifts}
                                onClick={() => handleEventClick(event)}
                            />
                        ))}
                    </div>
                </Collapsible>
            )}

            {/* Needs Attention */}
            {needsAttention.length > 0 && (
                <Collapsible title="Needs Attention" count={needsAttention.length} defaultOpen={false}>
                    <p className="text-[11px] text-brown-muted mb-2">Gift ideas with nothing purchased yet.</p>
                    <div className="flex flex-wrap gap-2">
                        {needsAttention.map(r => (
                            <button
                                key={r.id}
                                onClick={() => onSelectPerson(r.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFF8E1] rounded-full border border-[#DAA520] cursor-pointer font-sans text-xs font-semibold text-brown hover:bg-[#FFF3E0] transition-colors"
                            >
                                {r.emoji} {r.name}
                            </button>
                        ))}
                    </div>
                </Collapsible>
            )}

            {/* Empty State */}
            {receivers.length === 0 && (
                <div className="text-center py-12 text-brown-muted">
                    <div className="text-5xl mb-3">
                        🎁
                    </div>

                    <div className="font-fraunces text-lg font-semibold text-brown mb-1">
                        Welcome to Gift Tracker
                    </div>

                    <p className="text-xs max-w-[280px] mx-auto mb-4">
                        Add people and events to start tracking gift ideas and budgets.
                    </p>

                    <Button
                        small
                        onClick={onAddPerson}
                    >
                        + Add Person
                    </Button>
                </div>
            )}
        </div>
    );
};