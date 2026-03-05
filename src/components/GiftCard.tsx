import {Gift, Receiver, Status} from "@/types";
import clsx from "clsx";

type GiftCardProps = {
    gift: Gift;
    receiver?: Receiver;
    onEdit: (gift: Gift) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, s: Status) => void;
    compact?: boolean;
    isMobile?: boolean;
}

export const GiftCard = ({gift, receiver, onEdit, onDelete, onStatusChange, compact, isMobile}: GiftCardProps) => {
    const isPurchased = gift.status === "Purchased";

    return (
        <div className={clsx(
            "rounded-xl border transition-all duration-200",
            isPurchased ? "bg-purchased-card border-purchased-border" : "bg-white border-cream-border",
            isMobile ? "p-3" : compact ? "px-3.5 py-3" : "px-4 py-3.5"
        )}>
            <div className="flex justify-between items-start mb-1">
                <div className="flex-1 min-w-0 flex items-center gap-2">
                    {/* Checkbox toggle */}
                    <button
                        onClick={() => onStatusChange(gift.id, isPurchased ? "Idea" : "Purchased")}
                        className={clsx(
                            "shrink-0 size-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all duration-200",
                            isPurchased
                                ? "bg-purchased border-purchased"
                                : "bg-white border-tan hover:border-purchased"
                        )}
                    >
                        {isPurchased && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>

                    <div className="min-w-0">
                        <div className={clsx(
                            "font-semibold mb-0.5 transition-all duration-200",
                            isMobile ? "text-[13px]" : "text-sm",
                            isPurchased ? "line-through text-brown-muted" : "text-brown"
                        )}>
                            {gift.name}
                        </div>

                        {!compact && (
                            <div className="text-[11px] text-brown-muted">
                                for {receiver?.emoji} {receiver?.name} · {gift.occasion}
                            </div>
                        )}
                    </div>
                </div>

                {gift.price && (
                    <div className={clsx(
                        "font-fraunces font-bold ml-2 transition-all duration-200",
                        isMobile ? "text-[15px]" : "text-[17px]",
                        isPurchased ? "text-purchased" : "text-gold"
                    )}>
                        ${parseFloat(gift.price).toFixed(2)}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between mt-1.5 flex-wrap gap-1.5">
                <div className="flex items-center gap-1.5">
                    {isPurchased ? (
                        <span className="inline-flex items-center gap-1 bg-purchased-bg text-purchased-text px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide">
                            ✓ Purchased
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 bg-idea-bg text-idea-text px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide">
                            ○ Idea
                        </span>
                    )}

                    {gift.url && (
                        <a href={gift.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-gold no-underline font-semibold">
                            🔗
                        </a>
                    )}
                </div>

                <div className="flex gap-1">
                    <button
                        onClick={() => onEdit(gift)}
                        className="size-[22px] rounded-md border border-cream-subtle bg-white cursor-pointer text-[10px] flex items-center justify-center hover:bg-gold-tint transition-colors"
                    >
                        ✏️
                    </button>

                    <button
                        onClick={() => onDelete(gift.id)}
                        className="size-[22px] rounded-md border border-danger-border bg-white cursor-pointer text-[10px] flex items-center justify-center hover:bg-danger-hover transition-colors"
                    >
                        🗑
                    </button>
                </div>
            </div>

            {gift.notes && (
                <div className={clsx(
                    "text-[11px] mt-1.5 italic leading-snug",
                    isPurchased ? "text-purchased-notes" : "text-brown-muted"
                )}>
                    {gift.notes}
                </div>
            )}
        </div>
    );
};
