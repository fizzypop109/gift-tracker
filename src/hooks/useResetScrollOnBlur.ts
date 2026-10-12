import {useEffect} from "react";

/**
 * iOS scrolls the whole page to keep a focused field above the keyboard and
 * doesn't always scroll back when the keyboard closes, leaving a gap at the
 * bottom. The app shell never scrolls the page itself, so snap back to the top
 * once focus leaves a field (and no other field took it).
 */
export const useResetScrollOnBlur = () => {
    useEffect(() => {
        const h = () => {
            setTimeout(() => {
                const el = document.activeElement;
                if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) return;
                window.scrollTo(0, 0);
            }, 50);
        };
        document.addEventListener("focusout", h);
        return () => document.removeEventListener("focusout", h);
    }, []);
};
