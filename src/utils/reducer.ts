import { DEFAULT_STATE } from "@/utils/collections";
import {Action, Gift, OccasionConfig, Receiver} from "@/types";

export type AppState = {
    receivers: Receiver[];
    gifts: Gift[];
    budgets: Record<string, number>;
    lists: Record<string, string[]>;
    occasions: OccasionConfig[];
}

export const reducer = (state: AppState, action: Action): AppState => {
    switch (action.type) {
        case "LOAD":
            return {
                ...DEFAULT_STATE,
                ...action.payload,
                lists: { ...DEFAULT_STATE.lists, ...action.payload.lists },
            };
        case "ADD_RECEIVER": {
            const updatedLists = { ...state.lists };
            for (const occasion of state.occasions) {
                if (occasion.autoAdd) {
                    const existing = updatedLists[occasion.id] || [];
                    updatedLists[occasion.id] = [...existing, action.payload.id];
                }
            }
            return {
                ...state,
                receivers: [...state.receivers, action.payload],
                lists: updatedLists,
            };
        }
        case "EDIT_RECEIVER":
            return {
                ...state,
                receivers: state.receivers.map(r =>
                    r.id === action.payload.id ? { ...r, ...action.payload } : r
                ),
            };
        case "DELETE_RECEIVER": {
            // Remove from all lists
            const cleanedLists = { ...state.lists };
            for (const key of Object.keys(cleanedLists)) {
                cleanedLists[key] = cleanedLists[key].filter(id => id !== action.payload);
            }
            return {
                ...state,
                receivers: state.receivers.filter(r => r.id !== action.payload),
                gifts: state.gifts.filter(g => g.receiverId !== action.payload),
                lists: cleanedLists,
            };
        }
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
            const arr = state.lists[list] || [];
            return {
                ...state,
                lists: {
                    ...state.lists,
                    [list]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id],
                },
            };
        }
        case "ADD_OCCASION":
            return {
                ...state,
                occasions: [...state.occasions, action.payload],
                lists: {
                    ...state.lists,
                    [action.payload.id]: action.payload.autoAdd
                        ? state.receivers.map(r => r.id)
                        : [],
                },
            };
        case "EDIT_OCCASION":
            return {
                ...state,
                occasions: state.occasions.map(o =>
                    o.id === action.payload.id ? { ...o, ...action.payload } : o
                ),
            };
        case "DELETE_OCCASION": {
            const { [action.payload]: _, ...remainingLists } = state.lists;
            return {
                ...state,
                occasions: state.occasions.filter(o => o.id !== action.payload),
                gifts: state.gifts.filter(g => g.occasion !== state.occasions.find(o => o.id === action.payload)?.label),
                lists: remainingLists,
            };
        }
        case "ADD_PERSONAL_EVENT":
            return {
                ...state,
                receivers: state.receivers.map(r =>
                    r.id === action.payload.receiverId
                        ? { ...r, personalEvents: [...(r.personalEvents || []), action.payload.event] }
                        : r
                ),
            };
        case "EDIT_PERSONAL_EVENT":
            return {
                ...state,
                receivers: state.receivers.map(r =>
                    r.id === action.payload.receiverId
                        ? {
                            ...r,
                            personalEvents: (r.personalEvents || []).map(e =>
                                e.id === action.payload.event.id ? action.payload.event : e
                            ),
                        }
                        : r
                ),
            };
        case "DELETE_PERSONAL_EVENT":
            return {
                ...state,
                receivers: state.receivers.filter(r =>
                    r.id === action.payload.receiverId
                        ? { ...r, personalEvents: (r.personalEvents || []).filter(e => e.id !== action.payload.eventId) }
                        : r
                ),
            };
        default:
            return state;
    }
};