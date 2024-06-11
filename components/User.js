import { useRef, useState } from "react";
import { useMobile } from "./providers/MobileContext";
import FriendStatus from "./FriendStatus";
import ProfilePopout from "./ProfilePopout";

export default function User({ user }) {
    const [viewProfilePopout, setViewProfilePopout] = useState(false);
    const { isMobile } = useMobile();
    const ref = useRef(null);

    return (
        <>
            <div className="user" style={isMobile ? { width: "100%" } : {}} ref={ref} onClick={() => setViewProfilePopout(true)}>
                <div className="pfp">{user && user.pfp_url ? <img src={user.pfp_url} /> : <></>}</div>
                <div className="top-down">
                    <div className="display">{user.display ? user.display : "Something went wrong..."}</div>
                    <div className="username">@{user.username ? user.username : "Uh-oh :("}</div>
                </div>
            </div>
            {user && viewProfilePopout && <ProfilePopout user={user} />}
        </>
    );
}
