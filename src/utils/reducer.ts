import { DEFAULT_STATE } from "@/utils/collections";
import { Gift, Receiver } from "@/types";

export type AppState = {
    receivers: Receiver[];
    gifts: Gift[];
    budgets: Record<string, number>;
    christmasList: string[];
    birthdayList: string[];
};

type ListKey = "christmasList" | "birthdayList";

type Action =
    | { type: "LOAD"; payload: Partial<AppState> }
    | { type: "ADD_RECEIVER"; payload: Receiver }
    | { type: "EDIT_RECEIVER"; payload: Partial<Receiver> & { id: string } }
    | { type: "DELETE_RECEIVER"; payload: string }
    | { type: "ADD_GIFT"; payload: Gift }
    | { type: "EDIT_GIFT"; payload: Partial<Gift> & { id: string } }
    | { type: "DELETE_GIFT"; payload: string }
    | { type: "SET_BUDGET"; payload: { key: string; amount: number } }
    | { type: "TOGGLE_LIST"; payload: { list: ListKey; id: string } };

export const reducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case "LOAD":
            return { ...DEFAULT_STATE, ...action.payload };
        case "ADD_RECEIVER":
            return {
                ...state,
                receivers: [...state.receivers, action.payload],
                christmasList: [...state.christmasList, action.payload.id],
                birthdayList: [...state.birthdayList, action.payload.id],
            };
        case "EDIT_RECEIVER":
            return {
                ...state,
                receivers: state.receivers.map(r =>
                    r.id === action.payload.id ? { ...r, ...action.payload } : r
                ),
            };
        case "DELETE_RECEIVER":
            return {
                ...state,
                receivers: state.receivers.filter(r => r.id !== action.payload),
                gifts: state.gifts.filter(g => g.receiverId !== action.payload),
                christmasList: state.christmasList.filter(id => id !== action.payload),
                birthdayList: state.birthdayList.filter(id => id !== action.payload),
            };
        case "ADD_GIFT":
            return { ...state, gifts: [...state.gifts, action.payload] };
        case "EDIT_GIFT":
            return {
                ...state,
                gifts: state.gifts.map(g =>
                    g.id === action.payload.id ? { ...g, ...action.payload } : g
                ),
            };
        case "DELETE_GIFT":
            return { ...state, gifts: state.gifts.filter(g => g.id !== action.payload) };
        case "SET_BUDGET":
            return {
                ...state,
                budgets: { ...state.budgets, [action.payload.key]: action.payload.amount },
            };
        case "TOGGLE_LIST": {
            const { list, id } = action.payload;
            const arr = state[list];
            return {
                ...state,
                [list]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id],
            };
        }
        default:
            return state;
    }
};