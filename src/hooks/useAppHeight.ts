import {useEffect} from "react";

/**
 * iOS home-screen apps can launch with a viewport that's too short (and 100dvh
 * with it), leaving a gap at the bottom until something forces a re-layout.
 * An installed app always fills the screen, so when the reported height is
 * just shy of the screen's, trust the screen. Exposed as --app-height.
 */
export const useAppHeight = () => {
    useEffect(() => {
        const standalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            (navigator as Navigator & { standalone?: boolean }).standalone === true;

        const h = () => {
            let height = window.innerHeight;
            if (standalone) {
                const portrait = window.matchMedia("(orientation: portrait)").matches;
                const screenHeight = portrait
                    ? Math.max(screen.width, screen.height)
                    : Math.min(screen.width, screen.height);
                // Only bridge a small shortfall; anything larger is a genuinely
                // smaller window (e.g. iPad split view).
                if (screenHeight > height && screenHeight - height < 120) height = screenHeight;
            }
            document.documentElement.style.setProperty("--app-height", `${height}px`);
        };

        // iOS launches standalone apps with the viewport short by the status
        // bar height and only fixes it after a scroll. Fake one: make the page
        // briefly scrollable, nudge it 1px and back.
        const kick = () => {
            if (!standalone || window.innerHeight >= Math.max(screen.width, screen.height) - 1) return;
            const spacer = document.createElement("div");
            spacer.style.height = "200vh";
            document.body.appendChild(spacer);
            window.scrollTo(0, 1);
            requestAnimationFrame(() => {
                window.scrollTo(0, 0);
                spacer.remove();
            });
        };
        const kickTimer = setTimeout(kick, 100);
        const onVisible = () => {
            if (document.visibilityState === "visible") setTimeout(kick, 100);
        };
        document.addEventListener("visibilitychange", onVisible);

        h();
        window.addEventListener("resize", h);
        window.addEventListener("orientationchange", h);
        return () => {
            clearTimeout(kickTimer);
            document.removeEventListener("visibilitychange", onVisible);
            window.removeEventListener("resize", h);
            window.removeEventListener("orientationchange", h);
        };
    }, []);
};
