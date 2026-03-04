import {OCCASIONS} from "@/utils";

export type Occasion = (typeof OCCASIONS)[number];

export type OccasionDateType =
    | { type: "fixed"; month: number; day: number }         // e.g. Christmas Dec 25
    | { type: "per-person" }                                 // uses receiver.birthday or custom date per person
    | { type: "custom"; date: string }                       // specific date like "2026-06-15"

export type OccasionConfig = {
    id: string;
    label: string;
    icon: string;
    date: OccasionDateType;
    accentColor: string;
    accentGradient: string;
    autoAdd: boolean;       // auto-add new receivers to this list
}