import { useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { useMobile } from "./providers/MobileContext";

export default function ProfileNav() {
    const [profileMenu, setProfileMenuVisible] = useState(false);
    const {isMobile} = useMobile();
    const {meta, logout} = useAuth();
    //{mapping(user)?mapping(user):"user.png"}
    const onClick = (e) => {
        if (!isMobile) {
            window.location.href="/profile";
            return;
        } 
        else if (isMobile) {
            setProfileMenuVisible(true);
        }
    }
    return (
        <div className="profile-nav">
            <img src={meta.pfp} onClick={onClick} style={isMobile?{'cursor': 'default'}:{}}/>
            {profileMenu?(
                <div className="profile-menu-mobile">
                    <div className="profile-link" href="/profile">Profile</div>
                    <div className="sign-out" onClick={logout}>Sign-out</div>
                </div>)
            :
                <></>
            }
        </div>)
}