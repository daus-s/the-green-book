import ProfileNav from "./ProfileNav";
import { useEffect, useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { useMobile } from "./providers/MobileContext";
import Image from "next/image";
import NotificationIcon from "./notifications/NotificationIcon";

export default function AccountControl() {
    const { user, session, logout } = useAuth();
    const [authenticated, setAuthenticated] = useState(user ? user.role == "authenticated" : false);
    const { isMobile } = useMobile();

    useEffect(() => {
        if (session && user) {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
    }, [user, session]);

    switch (authenticated) {
        case true:
            return (
                <div className="profile-signout-div">
                    <NotificationIcon />
                    <ProfileNav />
                    {!isMobile ? (
                        <button className="cta-button" onClick={() => logout()}>
                            Sign Out
                        </button>
                    ) : (
                        <></>
                    )}
                </div>
            );
        case false:
            return isMobile ? (
                <button className="login-as-button" onClick={() => (window.location.href = "/login")}>
                    <Image src="/login.png" width={40} height={40} alt="login" />
                </button>
            ) : (
                <button className="cta-button" onClick={() => (window.location.href = "/login")}>
                    Sign In
                </button>
            );
    }
}
