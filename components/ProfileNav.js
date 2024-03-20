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

    useEffect(() => {
        // Function to handle clicks outside the profile menu
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setProfileMenuVisible(false);
            }
        };
    
        // Add event listener when component mounts
        document.addEventListener('mousedown', handleClickOutside);
    
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [profileMenuRef]);

    return (
        <div className="profile-nav">
            <img src={meta.pfp} onClick={onClick} style={isMobile?{cursor: 'default', marginRight: '0', height: '50px', width: '50px', paddingLeft: '0px'}:{}}/>
            {profileMenu?(
                <div className="profile-menu-mobile" ref={profileMenuRef}>
                    <div className="profile-link" onClick={(e)=>window.location.href="/profile"}>Profile</div>
                    <div className="sign-out" onClick={logout}>Sign-out</div>
                </div>
                )
            :
                <></>
            }
        </div>)
}