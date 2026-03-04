import {useEffect, useState} from "react";

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Consistent with Tailwind md breakpoint
        const h = () => setIsMobile(window.innerWidth < 768);
        h();
        window.addEventListener("resize", h);
        return () => window.removeEventListener("resize", h);
    }, []);

    return isMobile;
};