import clsx from "clsx";
import {Status} from "@/types";

type BadgeProps = {
    status?: Status;
}

export const Badge = ({ status }: BadgeProps) => {
    const isPurchased = status === "Purchased";
    return (
        <span className={clsx(
            "inline-flex items-center gap-1 px-[9px] py-[2px] rounded-[20px] text-[10px] font-semibold tracking-[0.3px] uppercase",
            isPurchased ? "bg-purchased-bg text-purchased-text" : "bg-idea-bg text-idea-text"
        )}>
            <span className={clsx(
                "size-[5px] rounded-full",
                isPurchased ? "bg-purchased" : "bg-idea-dot"
            )} />
            {status}
        </span>
    );
}
