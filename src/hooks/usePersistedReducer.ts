import { useEffect, useReducer, useRef } from "react";
import { DEFAULT_STATE, reducer } from "@/utils";

export const usePersistedReducer = () => {
    const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
    const loaded = useRef(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("gift-tracker-v2");
            if (saved) dispatch({ type: "LOAD", payload: JSON.parse(saved) });
        } catch {}
        loaded.current = true;
    }, []);

    useEffect(() => {
        if (!loaded.current) return;
        try {
            localStorage.setItem("gift-tracker-v2", JSON.stringify(state));
        } catch {}
    }, [state]);

    return [state, dispatch] as const;
};