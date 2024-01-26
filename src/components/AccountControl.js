import ProfileNav from "./ProfileNav";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export default function AccountControl() {
    const {user, session, logout} = useAuth();
    const [authenticated, setAuthenticated] = useState((user?user.role=='authenticated':false));

    useEffect(()=>{
        if (session&&user) {
            setAuthenticated(true);
        }
        else {
            setAuthenticated(false);
        }
    },[user,session]); //load on mount

    switch (authenticated) {
        case true: 
            return (
            <div className="profile-signout-div">
                <ProfileNav/>
                <button className="cta-button" onClick={()=>logout()}>Sign Out</button>
            </div>)
        case false:
            return (<button className="cta-button" onClick={()=>window.location.href='/login'}>Sign In</button>);
    }

}