import {STATUS_COLORS} from "@/utils";
import {Status} from "@/types";

type BadgeProps = {
    status?: Status;
}

export const Badge = ({ status }: BadgeProps) => {
    const c = status ? STATUS_COLORS[status] : STATUS_COLORS.Idea;
    return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, background: c.bg, color: c.text, padding: "2px 9px", borderRadius: 20, fontSize: 10, fontWeight: 600, letterSpacing: 0.3, textTransform: "uppercase" }}><span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot }} />{status}</span>;
}