import User from "./User";
import { useMobile } from "./providers/MobileContext";

export default function UserSearchResult({ r, select, style }) {
    const { isMobile } = useMobile();
    return (
        <div className="result" onClick={() => select(r)} style={isMobile ? { ...style, ...mobileStyle.result } : { ...style }}>
            <User user={r} />
        </div>
    );
}

const mobileStyle = {
    result: {
        width: "calc(100% - 20px)",
    },
};
