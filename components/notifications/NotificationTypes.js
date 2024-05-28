import { useEffect, useState } from "react";
import { supabase } from "../../functions/SupabaseClient";

export default function Notification({ notification, key, meta }) {
    console.log("choosing notification...");
    console.log(notification);
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
    console.log("creating notification...");
    return (
        <div className={"notification friend-request " + (notification.viewed || locallyViewed ? "" : "new")} onMouseEnter={() => setLocallyViewed(true)}>
            {JSON.stringify(notification)}
            <button className="accept">accept</button>
            <button className="reject">reject</button>
        </div>
    );
}

function NotificationWrapper({ Component, notification, key, meta }) {
    const [locallyViewed, setLocallyViewed] = useState(false);

    useEffect(() => {
        const setRemoteViewed = async () => {
            let {} = await supabase.rpc("view_notification", {
                n: notification.id,
                u: meta.publicID,
            });
        };

        if (locallyViewed) {
            setRemoteViewed();
        }
    }, [locallyViewed]);

    return <Component notification={notification} setLocallyViewed={setLocallyViewed} locallyViewed={locallyViewed} />;
}
