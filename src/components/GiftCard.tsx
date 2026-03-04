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
            isPurchased
                ? "bg-[#F6FFF6] border-[#C8E6C9]"
                : "bg-white border-[#EDE5D8]",
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
                                ? "bg-[#4CAF50] border-[#4CAF50]"
                                : "bg-white border-[#D4C4AE] hover:border-[#4CAF50]"
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
                            isPurchased ? "line-through text-[#8B7355]" : "text-[#2D1810]"
                        )}>
                            {gift.name}
                        </div>

                        {!compact && (
                            <div className="text-[11px] text-[#8B7355]">
                                for {receiver?.emoji} {receiver?.name} · {gift.occasion}
                            </div>
                        )}
                    </div>
                </div>

                {gift.price && (
                    <div className={clsx(
                        "font-fraunces font-bold ml-2 transition-all duration-200",
                        isMobile ? "text-[15px]" : "text-[17px]",
                        isPurchased ? "text-[#4CAF50]" : "text-[#B8860B]"
                    )}>
                        ${parseFloat(gift.price).toFixed(2)}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between mt-1.5 flex-wrap gap-1.5">
                <div className="flex items-center gap-1.5">
                    {isPurchased ? (
                        <span className="inline-flex items-center gap-1 bg-[#E8F5E9] text-[#1B5E20] px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide">
                            ✓ Purchased
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 bg-[#FFF3E0] text-[#E65100] px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide">
                            ○ Idea
                        </span>
                    )}

                    {gift.url && (
                        <a href={gift.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#B8860B] no-underline font-semibold">
                            🔗
                        </a>
                    )}
                </div>

                <div className="flex gap-1">
                    <button
                        onClick={() => onEdit(gift)}
                        className="size-[22px] rounded-md border border-[#E8DDD0] bg-white cursor-pointer text-[10px] flex items-center justify-center hover:bg-[#FFF8E1] transition-colors"
                    >
                        ✏️
                    </button>

                    <button
                        onClick={() => onDelete(gift.id)}
                        className="size-[22px] rounded-md border border-[#FFCDD2] bg-white cursor-pointer text-[10px] flex items-center justify-center hover:bg-[#FFF0F0] transition-colors"
                    >
                        🗑
                    </button>
                </div>
            </div>

            {gift.notes && (
                <div className={clsx(
                    "text-[11px] mt-1.5 italic leading-snug",
                    isPurchased ? "text-[#A5D6A7]" : "text-[#8B7355]"
                )}>
                    {gift.notes}
                </div>
            )}
        </div>
    );
};