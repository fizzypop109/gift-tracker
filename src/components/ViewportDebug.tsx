import {useEffect, useRef, useState} from "react";

// TEMPORARY: on-screen viewport readout for diagnosing the iOS bottom gap.
export const ViewportDebug = () => {
    const probe = useRef<HTMLDivElement>(null);
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        const read = () => {
            const shell = document.querySelector("[data-app-shell]")?.getBoundingClientRect();
            const p = probe.current ? getComputedStyle(probe.current) : null;
            const vv = window.visualViewport;
            const r = (n: number | undefined) => (n === undefined ? "-" : Math.round(n * 10) / 10);
            setLines([
                `inner ${window.innerWidth}x${window.innerHeight}  outer ${window.outerHeight}`,
                `screen ${screen.width}x${screen.height}  dpr ${window.devicePixelRatio}`,
                `docEl client ${document.documentElement.clientHeight}`,
                `vv h ${r(vv?.height)} top ${r(vv?.offsetTop)} scale ${r(vv?.scale)}`,
                `scrollY ${r(window.scrollY)}`,
                `shell top ${r(shell?.top)} bottom ${r(shell?.bottom)} h ${r(shell?.height)}`,
                `--app-height ${document.documentElement.style.getPropertyValue("--app-height") || "-"}`,
                `safe T ${p?.paddingTop} B ${p?.paddingBottom}`,
                `100dvh ${p?.height}  100lvh ${p?.width}`,
                `standalone ${window.matchMedia("(display-mode: standalone)").matches}`,
            ]);
        };
        read();
        const id = setInterval(read, 300);
        return () => clearInterval(id);
    }, []);

    return (
        <>
            {/* Probe: padding reports safe-area insets, height/width report dvh/lvh. */}
            <div
                ref={probe}
                aria-hidden
                className="fixed pointer-events-none invisible pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] h-dvh"
                style={{ top: 0, left: 0, width: "100lvh", boxSizing: "content-box" }}
            />
            <pre className="fixed left-2 right-2 top-1/3 z-[2000] m-0 p-2 rounded bg-black/80 text-[11px] leading-snug text-lime-300 font-mono pointer-events-none whitespace-pre-wrap">
                {lines.join("\n")}
            </pre>
        </>
    );
};
