import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "./providers/AuthContext";
import CommissionerShield from "./CommissionerShield";
import Notification from "./Notification";
import { supabase } from "../functions/SupabaseClient";

function SidebarProfile({ meta, user }) {
    if (meta && user) {
        return (
            <div className="sidebar-profile">
                <div className="pfp-box">
                    <img className="pfp" src={meta.pfp_url} onClick={() => (window.location.href = "/profile")} />
                    {meta.commish ? <CommissionerShield style={{ height: "30px", pointerEvents: "none" }} /> : <></>}
                </div>
                <div className="display">{user.display}</div>
                <div className="username">@{meta.username}</div>
            </div>
        );
    } else {
        return (
            <div className="sidebar-profile">
                <div className="pfp-box">
                    <img className="big" src="/greenbook.jpg" onClick={() => (window.location.href = "/")} />
                </div>
            </div>
        );
    }
}

function Sidebar({ close }) {
    const [requests, setRequests] = useState(0);
    const sidebarRef = useRef(null);
    const { user, meta, logout } = useAuth();

    useEffect(() => {
        const getRequests = async () => {
            try {
                let sum = 0;
                const { data: groupIDs, error } = await supabase.from("groups").select("groupID").eq("commissionerID", meta.commish);
                if (error) {
                    throw error;
                }
                const requestsPromises = groupIDs.map(async (id) => {
                    const { data: requests, error } = await supabase.from("requests").select().eq("group_id", id.groupID);
                    if (error) {
                        throw error;
                    }
                    return requests ? requests.length : 0;
                });
                const requestsLengths = await Promise.all(requestsPromises);
                sum = requestsLengths.reduce((acc, length) => acc + length, 0);
                setRequests(sum);
            } catch (error) {}
        };

        getRequests();
    }, []);

    const handleClickInside = (e) => {
        if (sidebarRef.current && sidebarRef.current.contains(e.target)) {
            return;
        } else {
            close();
        }
    };

    return (
        <div className="sidebar-container" onClick={handleClickInside}>
            <div className="sidebar" ref={sidebarRef}>
                <SidebarProfile user={user} meta={meta} />
                <div className="bars">
                    {user && (
                        <div className="sidebar-nav">
                            <div className="user-options">
                                <div className="user-title">
                                    <Link href="/profile" onClick={close}>
                                        User
                                    </Link>
                                </div>
                                <div className="user-links">
                                    <Link href="/bets" onClick={close}>
                                        Place Bets
                                    </Link>
                                    <Link href="/history" onClick={close}>
                                        Bet History
                                    </Link>
                                    <Link href="/wallet" onClick={close}>
                                        Wallet
                                    </Link>
                                    <Link href="/social" onClick={close}>
                                        Social
                                    </Link>
                                </div>
                            </div>
                            {meta.commish ? (
                                <div className="commish-options">
                                    <div className="commish-title">
                                        <Link href="/commissioner" onClick={close}>
                                            Commissioners
                                        </Link>
                                    </div>
                                    <div className="commish-links">
                                        <Link href="/new-bet" onClick={close}>
                                            Create Bet
                                        </Link>
                                        <Link href="/bookkeeping" onClick={close}>
                                            Bet Manager
                                        </Link>
                                        <Link href="/new-group" onClick={close}>
                                            Create Group
                                        </Link>
                                        <div className="notification-box" style={{ textAlign: "left" }}>
                                            <Link href="/your-groups" onClick={close} style={{ paddingLeft: "0" }}>
                                                Group Manager
                                            </Link>
                                            <Notification
                                                count={requests}
                                                style={{ width: "18px", height: "18px", fontSize: "14px", fontWeight: 500, transform: "translateX(-6px) translateY(-4px)", padding: "0" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    )}
                    {user && meta ? (
                        <button className="signout" onClick={logout}>
                            Sign-out
                        </button>
                    ) : (
                        <button className="login mmt" onClick={() => (window.location.href = "/login")}>
                            Log-in
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
export default function MobileFooter() {
    const [sidebar, setSidebarVis] = useState(false);

    return (
        <>
            <div className="mobile-menu-button">
                <img src="/menu.png" alt="mobile menu" onClick={() => setSidebarVis(true)} />
            </div>
            {sidebar ? <Sidebar close={() => setSidebarVis(false)} /> : <></>}
        </>
    );
}
