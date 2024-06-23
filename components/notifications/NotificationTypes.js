import { useEffect, useState } from "react";
import { supabase } from "../../functions/SupabaseClient";
import FriendRequestNotification from "./FriendRequest";
import PGATeamAnnouncement from "./PGATeamAnnoucement";

export default function Notification({ notification, key, meta }) {
    switch (notification.code) {
        case 0: //err code all falsy values coerce to 0
            return <></>;
        case 1:
            return <NotificationWrapper notification={notification} key={key} Component={FriendRequestNotification} meta={meta} />;
        case 2:
            return <NotificationWrapper notification={notification} key={key} Component={PGATeamAnnouncement} meta={meta} />;
        default:
            return <></>;
    }
}

function NotificationWrapper({ Component, notification, key, meta }) {
    const [locallyViewed, setLocallyViewed] = useState(false);

    useEffect(() => {
        const setRemoteViewed = async () => {
            if (!notification.viewed) {
                let {} = await supabase.rpc("view_notification", {
                    n: notification.id,
                    u: meta.id,
                });
                notification.viewed = true;
            }
        };

        if (locallyViewed) {
            setRemoteViewed();
        }
    }, [locallyViewed]);

    return <Component notification={notification} setLocallyViewed={setLocallyViewed} locallyViewed={locallyViewed} key={key} />;
}
