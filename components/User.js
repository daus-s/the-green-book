import { useMobile } from "./providers/MobileContext";

export default function User({ user }) {
    const { isMobile } = useMobile();
    return (
        <div className="user" style={isMobile ? { width: "100%" } : {}}>
            <div className="pfp">{user && user.pfp_url ? <img src={user.pfp_url} /> : <></>}</div>
            <div className="top-down">
                <div className="display">{user.display ? user.display : "Something went wrong..."}</div>
                <div className="username">@{user.username ? user.username : "Uh-oh :("}</div>
            </div>
        </div>
    );
}
