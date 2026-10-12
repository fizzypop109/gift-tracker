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

        h();
        window.addEventListener("resize", h);
        window.addEventListener("orientationchange", h);
        return () => {
            window.removeEventListener("resize", h);
            window.removeEventListener("orientationchange", h);
        };
    }, []);
};
