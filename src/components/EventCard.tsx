import {Gift, OccasionConfig, UpcomingEvent} from "@/types";
import {formatDate, turningAge} from "@/utils";
import clsx from "clsx";

type EventCardProps = {
    event: UpcomingEvent;
    gifts: Gift[];
    onClick: () => void;
    featured?: boolean;
}

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getOccasionDateLabel = (config: OccasionConfig): string => {
    if (config.date.type === "fixed") return `${config.date.day} ${SHORT_MONTHS[config.date.month - 1]}`;
    if (config.date.type === "custom") return formatDate(config.date.date);
    return "";
};

export const EventCard = ({event, gifts, onClick, featured}: EventCardProps) => {
    let personGifts: Gift[] = [];
    let purchased = 0;
    let total = 0;
    let icon = "";
    let dateLabel = "";
    let age: number | null = null;
    let personName: string | null = null;
    let personEmoji: string | null = null;
    let bgColor = "#FBF7F0";

    switch (event.type) {
        case "birthday":
            personGifts = gifts.filter(g => g.receiverId === event.original.id && g.occasion === "Birthday");
            purchased = personGifts.filter(g => g.status === "Purchased").length;
            total = personGifts.length;
            icon = "🎂";
            dateLabel = formatDate(event.original.birthday);
            age = turningAge(event.original.birthday);
            break;
        case "personal":
            personGifts = gifts.filter(g => g.receiverId === event.receiver.id && g.occasion === event.original.label);
            purchased = personGifts.filter(g => g.status === "Purchased").length;
            total = personGifts.length;
            icon = event.original.icon;
            dateLabel = formatDate(event.original.date);
            personName = event.receiver.name;
            personEmoji = event.receiver.emoji;
            bgColor = "#FFF8E1";
            break;
        case "occasion":
            purchased = event.purchased;
            total = event.totalGifts;
            icon = event.original.icon;
            dateLabel = getOccasionDateLabel(event.original);
            bgColor = `${event.original.accentColor}15`;
            break;
    }

    return (
        <button
            onClick={onClick}
            className={clsx(
                "flex items-center gap-3 bg-white rounded-xl border border-cream-border cursor-pointer text-left font-sans transition-all hover:shadow-sm hover:-translate-y-px w-full",
                featured ? "p-4" : "p-3.5"
            )}
        >
            <div
                className="size-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                style={{background: bgColor}}
            >
                {icon}
            </div>

            <div className="flex-1 min-w-0">
                <div className={clsx("font-semibold text-brown", featured ? "text-base" : "text-sm")}>
                    {event.label}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-brown-muted flex-wrap">
                    {personName && (
                        <>
                            <span>{personEmoji} {personName}</span>
                            <span>·</span>
                        </>
                    )}
                    <span>{purchased}/{total} gifts ready</span>
                    <span>·</span>
                    <span>{dateLabel}</span>
                    {age && (
                        <>
                            <span>·</span>
                            <span>Turning {age}</span>
                        </>
                    )}
                </div>
            </div>

            <div className={clsx(
                "text-right shrink-0",
                event.days <= 14 ? "text-danger" : event.days <= 30 ? "text-idea-text" : "text-brown-muted"
            )}>
                <div className={clsx("font-fraunces font-bold", featured ? "text-xl" : "text-lg")}>
                    {event.days}
                </div>
                
                <div className="text-[9px] uppercase tracking-wider">
                    days
                </div>
            </div>
        </button>
    );
};
