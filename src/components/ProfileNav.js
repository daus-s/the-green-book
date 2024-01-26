import { useAuth } from "./AuthContext";

import "../styles/profile.css";
export default function ProfileNav() {
    const {user} = useAuth();
    //{mapping(user)?mapping(user):"user.png"}
    return (<div className="profile-nav"><img src="user.png" onClick={(e)=>window.location.href="/profile"}/></div>)
}