import { useEffect, useState } from "react";
import NotificationBox from "./NotificationBox";
import { useAuth } from "../providers/AuthContext";
import { supabase } from "../../functions/SupabaseClient";

export default function NotificationIcon() {
    const [balanar, setBalanar] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const { meta } = useAuth();

    useEffect(() => {
        const getNotifications = async () => {
            if (meta?.publicID) {
                const { data, error } = await supabase.from("notifications").select().eq("dst", meta.publicID);
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
                className="notification-icon link"
                onClick={(e) => {
                    e.stopPropagation();
                    setBalanar(true);
                }}
            >
                <img src="/notification.png" style={{ height: "50px" }} />
            </div>
            {balanar ? (
                <NotificationBox
                    isOpen={balanar}
                    onClose={() => {
                        setBalanar(false);
                    }}
                    notifications={notifications}
                />
            ) : (
                <></>
            )}
        </>
    );
}
