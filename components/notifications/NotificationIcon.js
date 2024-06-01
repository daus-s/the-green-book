import { useEffect, useState } from "react";
import NotificationBox from "./NotificationBox";
import NotificationCounter from "./NotificationCounter";
import { useAuth } from "../providers/AuthContext";
import { supabase } from "../../functions/SupabaseClient";
import { count } from "../../functions/NotificationReader";

export default function NotificationIcon() {
    const [balanar, setBalanar] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const { meta } = useAuth();

    useEffect(() => {
        //this will become frankensteins monster
        const getNotifications = async () => {
            if (meta.id) {
                const { data, error } = await supabase.from("notifications").select().eq("dst", meta.id);
                if (!error) {
                    setNotifications(data);
                }
            }
        };

        getNotifications();
    }, [meta]);

    return (
        <>
            <div
                className="notification-icon link notification-box"
                onClick={(e) => {
                    e.stopPropagation();
                    setBalanar(true);
                }}
            >
                {!balanar ? <NotificationCounter count={count(notifications)} style={{ transform: "translateX(-10.5px)" }} /> : <></>}
                <img src="/notification.png" style={{ height: "50px" }} />
            </div>
            {balanar ? (
                <NotificationBox
                    isOpen={balanar}
                    onClose={() => {
                        setBalanar(false);
                    }}
                    notifications={notifications}
                    meta={meta}
                />
            ) : (
                <></>
            )}
        </>
    );
}
