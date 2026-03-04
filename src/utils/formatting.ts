export const formatDate = (d: string)=> {
    if (!d) return "";

    return new Date(d + "T00:00:00").toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}