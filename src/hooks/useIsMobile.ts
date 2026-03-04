import {useEffect, useState} from "react";

export const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const h = () => setIsMobile(window.innerWidth < 700);
        window.addEventListener("resize", h);
        return () => window.removeEventListener("resize", h);
    }, []);

    return isMobile;
}