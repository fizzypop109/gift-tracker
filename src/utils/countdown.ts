import {OccasionDate} from "@/types";

export const daysUntil = (d: string): number => {
    if (!d) return Infinity;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(d + "T00:00:00");
    target.setFullYear(today.getFullYear());

    if (target < today) target.setFullYear(today.getFullYear() + 1);

    return Math.ceil((target.getTime() - today.getTime()) / 86400000);
};

export const daysUntilChristmas = (): number => daysUntil("2000-12-25");

export const getNextOccasionDate = (config: OccasionDate, year: number): Date | null => {
    switch (config.type) {
        case "fixed":
            return new Date(year, config.month - 1, config.day);
        case "relative": {
            // e.g. 2nd Sunday of May
            const first = new Date(year, config.month - 1, 1);
            const firstDay = first.getDay();
            const offset = (config.dayOfWeek - firstDay + 7) % 7;
            const day = 1 + offset + (config.week - 1) * 7;
            return new Date(year, config.month - 1, day);
        }
        case "custom":
            return config.date ? new Date(config.date + "T00:00:00") : null;
        case "variable":
            return null; // handle Easter etc. separately
    }
};