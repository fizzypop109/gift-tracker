import {OccasionConfig, Status} from "@/types";
import {AppState} from "@/utils/reducer";

export const OCCASIONS = ["Birthday", "Christmas", "Anniversary", "Valentine's Day", "Mother's Day", "Father's Day", "Other"];

export const STATUS_OPTIONS = ["Idea", "Purchased"] as const;

export const STATUS_COLORS: Record<Status, { bg: string; text: string; dot: string }> = {
    Idea: { bg: "#FFF3E0", text: "#E65100", dot: "#FF9800" },
    Purchased: { bg: "#E8F5E9", text: "#1B5E20", dot: "#4CAF50" },
};

export const DEFAULT_OCCASIONS: OccasionConfig[] = [
    {
        id: "christmas",
        label: "Christmas",
        icon: "🎄",
        date: { type: "fixed", month: 12, day: 25 },
        accentColor: "#4CAF50",
        accentGradient: "linear-gradient(135deg, #1B5E20, #2E7D32, #1B5E20)",
        autoAdd: true,
    },
    {
        id: "birthday",
        label: "Birthday",
        icon: "🎂",
        date: { type: "per-person" },
        accentColor: "#E91E63",
        accentGradient: "linear-gradient(135deg, #880E4F, #AD1457, #C2185B)",
        autoAdd: true,
    },
];

export const DEFAULT_STATE: AppState = {
    receivers: [],
    gifts: [],
    budgets: {},
    lists: {},
    occasions: DEFAULT_OCCASIONS,
};