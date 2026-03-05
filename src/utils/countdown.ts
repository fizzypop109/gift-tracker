import {OccasionDateType} from "@/types";

export const daysUntil = (d: string): number => {
    if (!d) return Infinity;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(d + "T00:00:00");
    target.setFullYear(today.getFullYear());

    if (target < today) target.setFullYear(today.getFullYear() + 1);

    return Math.ceil((target.getTime() - today.getTime()) / 86400000);
};

export const getNextOccasionDate = (config: OccasionDateType, year: number): Date | null => {
    switch (config.type) {
        case "fixed":
            return new Date(year, config.month - 1, config.day);
        case "custom":
            return config.date ? new Date(config.date + "T00:00:00") : null;
        case "per-person":
            return null;
    }
};

export const turningAge = (birthday: string): number | null => {
    if (!birthday) return null;
    const birth = new Date(birthday + "T00:00:00");
    const birthYear = birth.getFullYear();
    if (birthYear < 1900 || birthYear > new Date().getFullYear()) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextBirthday = new Date(birthday + "T00:00:00");
    nextBirthday.setFullYear(today.getFullYear());
    if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);

    return nextBirthday.getFullYear() - birthYear;
};