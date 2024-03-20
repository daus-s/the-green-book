import ProfileNav from "./ProfileNav";
import { useEffect, useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { useMobile } from "./providers/MobileContext";

export default function AccountControl() {
    const {user, session, logout} = useAuth();
    const [authenticated, setAuthenticated] = useState((user?user.role=='authenticated':false));
    const {isMobile} = useMobile();

    useEffect(()=>{
        if (session&&user) {
            setAuthenticated(true);
        }
        else {
            setAuthenticated(false);
        }
    },[user,session]);

    switch (authenticated) {
        case true: 
            return (
            <div className="profile-signout-div">
                <ProfileNav/>
                {!isMobile?<button className="cta-button" onClick={()=>logout()}>Sign Out</button>:<></>}
            </div>)
        case false:
            return (<button className="cta-button" onClick={()=>window.location.href='/login'}>Sign In</button>);
    }

}