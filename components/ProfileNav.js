import { useAuth } from "./providers/AuthContext";

export default function ProfileNav() {
    const {meta} = useAuth();
    //{mapping(user)?mapping(user):"user.png"}
    return (<div className="profile-nav"><img src={meta.pfp} onClick={(e)=>window.location.href="/profile"}/></div>)
}