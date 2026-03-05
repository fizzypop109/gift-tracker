import {ReactNode, useState} from "react";
import clsx from "clsx";

type CollapsibleProps = {
    title: string;
    defaultOpen?: boolean;
    count?: number;
    action?: { label: string; onClick: () => void };
    children: ReactNode;
}

export const Collapsible = ({title, defaultOpen = true, count, action, children}: CollapsibleProps) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div>
            <div className="flex items-center mb-2.5">
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center gap-1.5 bg-none border-none cursor-pointer font-sans p-0"
                >
                    <span className={clsx(
                        "text-[10px] text-brown-muted transition-transform duration-200",
                        open ? "rotate-90" : "rotate-0"
                    )}>
                        ▶
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brown-muted m-0">
                        {title}
                    </h3>
                    {count !== undefined && (
                        <span className="text-[10px] text-brown-muted bg-cream-border px-1.5 py-px rounded-full">
                            {count}
                        </span>
                    )}
                </button>

                {action && (
                    <button
                        onClick={action.onClick}
                        className="ml-auto text-[11px] font-semibold text-gold cursor-pointer bg-none border-none font-sans"
                    >
                        {action.label}
                    </button>
                )}
            </div>

            <div className={clsx(
                "grid transition-all duration-200 ease-in-out",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}>
                <div className="overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
};
