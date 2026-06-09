import {OCCASIONS} from "@/utils";
import {PersonalEvent, Receiver} from "@/types/Receiver";

export type Occasion = (typeof OCCASIONS)[number];

export type OccasionDateType =
    | { type: "fixed"; month: number; day: number }                       // e.g. Christmas Dec 25
    | { type: "floating"; month: number; weekday: number; nth: number }   // nth weekday of month, e.g. Mother's Day = 2nd Sun May. weekday 0=Sun. nth 1-4 or -1 = last
    | { type: "per-person" }                                              // uses receiver.birthday or custom date per person
    | { type: "custom"; date: string }                                    // one-time specific date like "2026-06-15"

export type OccasionConfig = {
    id: string;
    label: string;
    icon: string;
    date: OccasionDateType;
    accentColor: string;
    accentGradient: string;
    autoAdd: boolean;
    scope: "global"; // only global events live here now
}

export type UpcomingEvent =
    | { type: "birthday"; label: string; days: number; original: Receiver }
    | { type: "occasion"; label: string; days: number; original: OccasionConfig; totalGifts: number; purchased: number }
    | { type: "personal"; label: string; days: number; original: PersonalEvent; receiver: Receiver };