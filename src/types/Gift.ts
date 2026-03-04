import {Status} from "@/types/Status";
import {Occasion} from "@/types/Occasion";

export type Gift = {
    id: string;
    receiverId?: string;
    name: string;
    occasion: string;
    price: string;
    url: string;
    notes: string;
    status: Status;
}

export type GiftDefault = {
    defaultOccasion: Occasion;
    defaultReceiver?: string;
}