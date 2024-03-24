import { useState, useRef, useEffect } from "react";
import { useAuth } from "./providers/AuthContext";
import { useMobile } from "./providers/MobileContext";

export default function ProfileNav() {
    const [profileMenu, setProfileMenuVisible] = useState(false);
    const {isMobile} = useMobile();
    const {meta, logout} = useAuth();

    const profileMenuRef = useRef(null);
    
    const onClick = (e) => {
        if (!isMobile) {
            window.location.href="/profile";
            return;
        } 
        else if (isMobile) {
            setProfileMenuVisible(true);
        }
    }

    // Function to handle clicks outside the profile menu
    // when clicked outside of the mobile option box it should close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setProfileMenuVisible(false);
            }
        };
    
        document.addEventListener('mousedown', handleClickOutside);
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [profileMenuRef]);

    return (
        <div className="profile-nav" style={isMobile?{paddingLeft: '0px'}:{}}>
            <img src={meta.pfp} onClick={onClick} style={isMobile?{cursor: 'default', marginRight: '0', height: '50px', width: '50px', paddingLeft: '0px'}:{}}/>
            {profileMenu?(
                <div className="profile-menu-mobile" ref={profileMenuRef}>
                    <div className="profile-link" onClick={()=>window.location.href="/profile"}>Profile</div>
                    <div className="sign-out" onClick={logout}>Sign-out</div>
                </div>
                )
            :
                <></>
            }
        </div>)
}