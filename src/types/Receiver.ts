export type PersonalEvent = {
    id: string;
    label: string;
    icon: string;
    date: string; // "2024-06-15"
}

export type Receiver = {
    id: string;
    name: string;
    emoji: string;
    birthday: string;
    personalEvents: PersonalEvent[];
}