import { useEffect, useState } from "react";
import { supabase } from "../../functions/SupabaseClient";
import Image from "next/image";

export default function Notification({ notification, key, meta }) {
    switch (notification.code) {
        case 0: //err code all falsy values coerce to 0
            console.log("choosing err");
            return <></>;
        case 1:
            console.log("choosing friend_request");
            return <NotificationWrapper notification={notification} key={key} Component={FriendRequestNotification} meta={meta} />;
        default:
            console.log("choosing WTF");
    }
}

function FriendRequestNotification({ notification, locallyViewed, setLocallyViewed }) {
    const [candidate, setCandidate] = useState(undefined);
    const getSrcAndDst = async () => {
        const { data, error } = await supabase.from("public_users").select().eq("id", notification.src).single();
        if (!error && data) {
            setCandidate(data);
        }
    };

    useEffect(() => {
        getSrcAndDst();
    }, []);
    return (
        <div className={"notification friend-request " + (notification.viewed || locallyViewed ? "" : "new")} onMouseEnter={() => setLocallyViewed(true)}>
            <div className="message">
                <Image src={candidate?.pfp_url ? candidate.pfp_url : "/user.png"} width={48} height={48} alt="user asking to be your friend" style={{ borderRadius: "24px" }} />
                <span style={{ fontWeight: 600, marginRight: 3 }}>{candidate?.display}</span> wants to be friends.
            </div>
            <div className="buttons">
                <button className="accept">accept</button>
                <button className="reject">reject</button>
            </div>
        </div>
    );
}

function NotificationWrapper({ Component, notification, key, meta }) {
    const [locallyViewed, setLocallyViewed] = useState(false);

    useEffect(() => {
        const setRemoteViewed = async () => {
            let {} = await supabase.rpc("view_notification", {
                n: notification.id,
                u: meta.id,
            });
        };

        if (locallyViewed) {
            setRemoteViewed();
        }
    }, [locallyViewed]);

    return <Component notification={notification} setLocallyViewed={setLocallyViewed} locallyViewed={locallyViewed} />;
}
