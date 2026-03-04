import {Status} from "@/types";

export const OCCASIONS = ["Birthday", "Christmas", "Anniversary", "Valentine's Day", "Mother's Day", "Father's Day", "Other"];

export const STATUS_OPTIONS = ["Idea", "Purchased", "Wrapped", "Given"] as const;

export const STATUS_COLORS: Record<Status, { bg: string; text: string; dot: string }> = {
    Idea: { bg: "#FFF3E0", text: "#E65100", dot: "#FF9800" },
    Purchased: { bg: "#E8F5E9", text: "#1B5E20", dot: "#4CAF50" },
    Wrapped: { bg: "#E3F2FD", text: "#0D47A1", dot: "#2196F3" },
    Given: { bg: "#F3E5F5", text: "#4A148C", dot: "#9C27B0" },
};

export const DEFAULT_STATE = {
    receivers: [],
    gifts: [],
    budgets: {},
    christmasList: [],
    birthdayList: []
};