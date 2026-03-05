import {PersonalEvent, Receiver} from "@/types/Receiver";
import {Gift} from "@/types/Gift";
import {OccasionConfig} from "@/types/Occasion";
import {AppState} from "@/utils";

export type Action =
    | { type: "LOAD"; payload: Partial<AppState> }
    | { type: "ADD_RECEIVER"; payload: Receiver }
    | { type: "EDIT_RECEIVER"; payload: Partial<Receiver> & { id: string } }
    | { type: "DELETE_RECEIVER"; payload: string }
    | { type: "ADD_GIFT"; payload: Gift }
    | { type: "EDIT_GIFT"; payload: Partial<Gift> & { id: string } }
    | { type: "DELETE_GIFT"; payload: string }
    | { type: "SET_BUDGET"; payload: { key: string; amount: number } }
    | { type: "TOGGLE_LIST"; payload: { list: string; id: string } }
    | { type: "ADD_OCCASION"; payload: OccasionConfig }
    | { type: "EDIT_OCCASION"; payload: Partial<OccasionConfig> & { id: string } }
    | { type: "DELETE_OCCASION"; payload: string }
    | { type: "ADD_PERSONAL_EVENT"; payload: { receiverId: string; event: PersonalEvent } }
    | { type: "EDIT_PERSONAL_EVENT"; payload: { receiverId: string; event: PersonalEvent } }
    | { type: "DELETE_PERSONAL_EVENT"; payload: { receiverId: string; eventId: string } }
