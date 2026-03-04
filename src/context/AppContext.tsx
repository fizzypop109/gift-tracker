import {createContext, ReactNode, Dispatch} from "react";
import { usePersistedReducer } from "@/hooks";
import { AppState } from "@/utils/reducer";
import {Action} from "@/types";

type AppContextType = {
    state: AppState;
    dispatch: Dispatch<Action>;
};

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = usePersistedReducer();
    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};