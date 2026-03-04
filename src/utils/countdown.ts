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